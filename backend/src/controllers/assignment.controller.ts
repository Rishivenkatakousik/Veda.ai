import path from "path";
import type { Request, Response } from "express";
import { env } from "../config/env";
import { AssignmentModel } from "../models/assignment.model";
import { createAssignment, getAssignmentById, listAssignments, regenerateAssignment, softDeleteAssignment } from "../services/assignment.service";
import { generatePdf, getPdfPath } from "../services/pdf.service";
import type { GeneratedPaper } from "../validators/generated-paper.validator";
export const listAssignmentsController = async (req: Request, res: Response): Promise<void> => {
    const { page, limit, search, status, sort } = req.query as Record<string, string>;
    const result = await listAssignments({
        page: Number(page),
        limit: Number(limit),
        search,
        status: status as "draft" | "queued" | "processing" | "completed" | "failed" | undefined,
        sort
    });
    res.status(200).json({
        success: true,
        data: result.items,
        error: null,
        meta: result.pagination
    });
};
export const getAssignmentController = async (req: Request, res: Response): Promise<void> => {
    const assignment = await getAssignmentById(String(req.params.id));
    if (!assignment) {
        res.status(404).json({
            success: false,
            data: null,
            error: { message: "Assignment not found" },
            meta: {}
        });
        return;
    }
    res.status(200).json({
        success: true,
        data: assignment,
        error: null,
        meta: {}
    });
};
export const createAssignmentController = async (req: Request, res: Response): Promise<void> => {
    const uploadedFiles = (req.files as Express.Multer.File[] | undefined) ?? [];
    const storedPaths = uploadedFiles.map((file) => file.filename);
    const input = req.body as Record<string, unknown>;
    const questionConfig = typeof input.questionConfig === "string"
        ? (JSON.parse(input.questionConfig) as Array<{
            type: string;
            count: number;
            marks: number;
        }>)
        : (input.questionConfig as Array<{
            type: string;
            count: number;
            marks: number;
        }>);
    const result = await createAssignment({
        title: String(input.title),
        subject: String(input.subject),
        className: String(input.className),
        schoolName: String(input.schoolName),
        assignedOn: input.assignedOn ? new Date(String(input.assignedOn)) : undefined,
        dueDate: new Date(String(input.dueDate)),
        questionConfig,
        instructions: input.instructions ? String(input.instructions) : "",
        materialFiles: storedPaths,
        createdBy: String(input.createdBy),
        correlationId: req.requestId
    });
    res.status(201).json({
        success: true,
        data: {
            assignmentId: result.assignment._id.toString(),
            status: result.assignment.status,
            jobId: result.jobId
        },
        error: null,
        meta: {}
    });
};
export const regenerateAssignmentController = async (req: Request, res: Response): Promise<void> => {
    const result = await regenerateAssignment(String(req.params.id), {
        correlationId: req.requestId
    });
    if (!result) {
        res.status(404).json({
            success: false,
            data: null,
            error: { message: "Assignment not found" },
            meta: {}
        });
        return;
    }
    res.status(200).json({
        success: true,
        data: {
            assignmentId: result.assignment._id.toString(),
            status: result.assignment.status,
            jobId: result.jobId
        },
        error: null,
        meta: {}
    });
};
export const deleteAssignmentController = async (req: Request, res: Response): Promise<void> => {
    const deleted = await softDeleteAssignment(String(req.params.id));
    if (!deleted) {
        res.status(404).json({
            success: false,
            data: null,
            error: { message: "Assignment not found" },
            meta: {}
        });
        return;
    }
    res.status(200).json({
        success: true,
        data: { id: deleted._id.toString(), deleted: true },
        error: null,
        meta: {}
    });
};
export const generatePdfController = async (req: Request, res: Response): Promise<void> => {
    const id = String(req.params.id);
    const assignment = await getAssignmentById(id);
    if (!assignment) {
        res.status(404).json({
            success: false,
            data: null,
            error: { message: "Assignment not found" },
            meta: {}
        });
        return;
    }
    if (assignment.status !== "completed" || !assignment.generatedPaper) {
        res.status(400).json({
            success: false,
            data: null,
            error: { message: "Assignment has no generated paper yet" },
            meta: {}
        });
        return;
    }
    const pdfPath = await generatePdf(id, assignment.generatedPaper as unknown as GeneratedPaper);
    const pdfPathRel = `${env.API_PREFIX}/assignments/${id}/pdf`;
    const base = env.PUBLIC_BASE_URL?.replace(/\/$/, "") ?? "";
    const pdfUrl = base ? `${base}${pdfPathRel}` : pdfPathRel;
    await AssignmentModel.findByIdAndUpdate(id, { pdfUrl });
    res.status(201).json({
        success: true,
        data: {
            assignmentId: id,
            pdfUrl,
            downloadPath: pdfPathRel,
            filePath: path.basename(pdfPath)
        },
        error: null,
        meta: {}
    });
};
export const downloadPdfController = async (req: Request, res: Response): Promise<void> => {
    const id = String(req.params.id);
    const pdfPath = getPdfPath(id);
    if (!pdfPath) {
        res.status(404).json({
            success: false,
            data: null,
            error: { message: "PDF not found. Generate it first via POST." },
            meta: {}
        });
        return;
    }
    const assignment = await getAssignmentById(id);
    const filename = assignment
        ? `${assignment.title.replace(/[^a-zA-Z0-9 ]/g, "")}.pdf`
        : `assignment-${id}.pdf`;
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.sendFile(pdfPath);
};
