import { z } from "zod";
import { ASSIGNMENT_STATUSES } from "../types/assignment";
const objectIdSchema = z.preprocess((v) => (Array.isArray(v) ? v[0] : v), z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid assignment id"));
const questionConfigSchema = z.object({
    type: z.string().trim().min(1, "Question type is required"),
    count: z.coerce.number().int().positive("Question count must be > 0"),
    marks: z.coerce.number().int().positive("Question marks must be > 0")
});
const allowedSortFields = [
    "createdAt",
    "-createdAt",
    "assignedOn",
    "-assignedOn",
    "dueDate",
    "-dueDate"
] as const;
const listPageSchema = z.preprocess((val) => (val === undefined || val === "" ? 1 : val), z.coerce.number().int().min(1));
const listLimitSchema = z.preprocess((val) => (val === undefined || val === "" ? 10 : val), z.coerce.number().int().min(1).max(100));
const listSortSchema = z.preprocess((val) => (val === undefined || val === "" ? "-createdAt" : val), z.enum(allowedSortFields));
const questionConfigArraySchema = z
    .array(questionConfigSchema)
    .min(1, "At least one question type is required");
export const createAssignmentSchema = z.object({
    params: z.object({}),
    query: z.object({}),
    body: z
        .object({
        title: z.string().trim().min(3).max(120),
        subject: z.string().trim().min(2).max(80),
        className: z.string().trim().min(1).max(40),
        schoolName: z.string().trim().min(2).max(120),
        assignedOn: z.coerce.date().optional(),
        dueDate: z.coerce.date(),
        questionConfig: z.preprocess((val) => (typeof val === "string" ? JSON.parse(val) : val), questionConfigArraySchema),
        instructions: z.string().trim().max(4000).optional().default(""),
        materialFiles: z.array(z.string().trim().min(1)).optional().default([]),
        createdBy: z.string().trim().min(2).max(80)
    })
        .superRefine((body, ctx) => {
        if (body.dueDate < new Date()) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Due date cannot be in the past",
                path: ["dueDate"]
            });
        }
        const types = (body.questionConfig as Array<{
            type: string;
        }>).map((q) => q.type.toLowerCase());
        const seen = new Set<string>();
        for (let i = 0; i < types.length; i++) {
            if (seen.has(types[i])) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: `Duplicate question type: "${types[i]}"`,
                    path: ["questionConfig", i, "type"]
                });
            }
            seen.add(types[i]);
        }
    })
});
export const listAssignmentsSchema = z.object({
    params: z.object({}),
    body: z.object({}),
    query: z.object({
        page: listPageSchema,
        limit: listLimitSchema,
        search: z.string().trim().max(120).optional(),
        status: z.enum(ASSIGNMENT_STATUSES).optional(),
        sort: listSortSchema
    })
});
export const regenerateAssignmentSchema = z.object({
    body: z.object({}),
    query: z.object({}),
    params: z.object({
        id: objectIdSchema
    })
});
export const assignmentByIdSchema = z.object({
    body: z.object({}),
    query: z.object({}),
    params: z.object({
        id: objectIdSchema
    })
});
