import { z } from "zod";

const questionConfigSchema = z.object({
  type: z.string().trim().min(1, "Question type is required"),
  count: z.number().int().min(1, "At least 1 question required"),
  marks: z.number().int().min(1, "Marks must be at least 1"),
});

export const createAssignmentSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(3, "Title must be at least 3 characters")
      .max(120),
    subject: z.string().trim().min(2, "Subject is required").max(80),
    className: z.string().trim().min(1, "Class is required").max(40),
    schoolName: z.string().trim().min(2, "School name is required").max(120),
    dueDate: z.coerce.date({ message: "Due date is required" }),
    questionConfig: z
      .array(questionConfigSchema)
      .min(1, "At least one question type is required"),
    instructions: z.string().trim().max(4000).optional().default(""),
    createdBy: z.string().trim().min(2, "Created by is required").max(80),
  })
  .refine((data) => data.dueDate >= new Date(), {
    message: "Due date cannot be in the past",
    path: ["dueDate"],
  })
  .refine(
    (data) => {
      const types = data.questionConfig.map((q) => q.type.toLowerCase());
      return new Set(types).size === types.length;
    },
    { message: "Duplicate question types are not allowed", path: ["questionConfig"] },
  );

export type CreateAssignmentInput = z.infer<typeof createAssignmentSchema>;
