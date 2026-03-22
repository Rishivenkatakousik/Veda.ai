import { Worker, type Job } from "bullmq";
import { env } from "../config/env";
import { AssignmentModel } from "../models/assignment.model";
import { extractJSON, generateFromAI } from "../services/ai.service";
import { buildMaterialContext } from "../services/material-context.service";
import { buildSystemPrompt, buildUserPrompt } from "../services/prompt.service";
import { publishStatusChange } from "../services/realtime.service";
import { assertMcqOptionsForConfig, generatedPaperSchema } from "../validators/generated-paper.validator";
type JobPayload = {
    assignmentId: string;
    correlationId?: string;
};
const processAssignment = async (job: Job<JobPayload>): Promise<void> => {
    const { assignmentId, correlationId } = job.data;
    const logPrefix = `[worker] job=${job.id} assignment=${assignmentId}${correlationId ? ` requestId=${correlationId}` : ""}`;
    const started = Date.now();
    console.info(`${logPrefix} started`);
    const assignment = await AssignmentModel.findById(assignmentId);
    if (!assignment) {
        throw new Error(`Assignment ${assignmentId} not found`);
    }
    if (assignment.isDeleted) {
        console.info(`${logPrefix} skipped (deleted)`);
        return;
    }
    assignment.status = "processing";
    await assignment.save();
    await publishStatusChange(assignmentId, "processing");
    console.info(`${logPrefix} status → processing`);
    const materialContext = await buildMaterialContext((assignment.materialFiles ?? []).map((f) => String(f)));
    const systemPrompt = buildSystemPrompt();
    const userPrompt = buildUserPrompt({
        title: assignment.title,
        subject: assignment.subject,
        className: assignment.className,
        schoolName: assignment.schoolName,
        totalQuestions: assignment.totalQuestions,
        totalMarks: assignment.totalMarks,
        questionConfig: assignment.questionConfig.map((qc) => ({
            type: qc.type,
            count: qc.count,
            marks: qc.marks
        })),
        instructions: assignment.instructions ?? "",
        materialContext
    });
    console.info(`${logPrefix} calling AI (gemini/${env.AI_MODEL})`);
    const aiResponse = await generateFromAI(systemPrompt, userPrompt);
    const jsonStr = extractJSON(aiResponse.raw);
    let parsed: unknown;
    try {
        parsed = JSON.parse(jsonStr);
    }
    catch {
        throw new Error(`AI returned invalid JSON: ${jsonStr.slice(0, 200)}...`);
    }
    const validated = generatedPaperSchema.safeParse(parsed);
    if (!validated.success) {
        const issues = validated.error.issues
            .map((i) => `${i.path.join(".")}: ${i.message}`)
            .join("; ");
        throw new Error(`AI output schema validation failed: ${issues}`);
    }
    const paper = validated.data;
    assertMcqOptionsForConfig(paper, assignment.questionConfig.map((qc) => ({
        type: String(qc.type),
        count: qc.count,
        marks: qc.marks
    })));
    paper.header.schoolName = paper.header.schoolName || assignment.schoolName;
    paper.header.subject = paper.header.subject || assignment.subject;
    paper.header.className = paper.header.className || assignment.className;
    paper.header.maxMarks = paper.header.maxMarks || assignment.totalMarks;
    assignment.set("generatedPaper", paper);
    assignment.answerKey = paper.answerKey;
    assignment.status = "completed";
    await assignment.save();
    await publishStatusChange(assignmentId, "completed");
    console.info(`${logPrefix} status → completed (${paper.sections.length} sections) durationMs=${Date.now() - started}`);
};
export const createAssignmentWorker = (): Worker<JobPayload> => {
    const worker = new Worker<JobPayload>(env.QUEUE_NAME, processAssignment, {
        connection: { url: env.REDIS_URL },
        prefix: env.BULLMQ_PREFIX,
        concurrency: 2,
        removeOnComplete: { count: 50 },
        removeOnFail: { count: 200 }
    });
    worker.on("completed", (job) => {
        console.info(`[worker] job=${job.id} completed`);
    });
    worker.on("failed", (job, error) => {
        const jobId = job?.id ?? "unknown";
        const assignmentId = job?.data?.assignmentId ?? "unknown";
        const correlationId = job?.data?.correlationId;
        const attemptsMade = job?.attemptsMade ?? 0;
        const maxAttempts = job?.opts?.attempts ?? 3;
        const corr = correlationId ? ` requestId=${correlationId}` : "";
        console.error(`[worker] job=${jobId} assignment=${assignmentId}${corr} failed (attempt ${attemptsMade}/${maxAttempts}): ${error.message}`);
        if (attemptsMade >= maxAttempts) {
            markFailed(assignmentId, error.message).catch((e) => console.error(`[worker] failed to mark assignment as failed:`, e));
        }
    });
    worker.on("error", (error) => {
        console.error("[worker] error:", error.message);
    });
    return worker;
};
const markFailed = async (assignmentId: string, reason: string): Promise<void> => {
    if (assignmentId === "unknown")
        return;
    await AssignmentModel.findByIdAndUpdate(assignmentId, {
        status: "failed",
        $set: { "generatedPaper": undefined },
        answerKey: `Generation failed: ${reason.slice(0, 500)}`
    });
    await publishStatusChange(assignmentId, "failed");
    console.info(`[worker] assignment=${assignmentId} status → failed`);
};
