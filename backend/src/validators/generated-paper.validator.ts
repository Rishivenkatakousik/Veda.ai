import { z } from "zod";
import { QUESTION_DIFFICULTY_LEVELS } from "../types/assignment";

const generatedQuestionSchema = z.object({
  text: z.string().min(1),
  difficulty: z.enum(QUESTION_DIFFICULTY_LEVELS).default("moderate"),
  marks: z.coerce.number().int().positive()
});

const generatedSectionSchema = z.object({
  title: z.string().min(1),
  instructions: z.string().default(""),
  questions: z.array(generatedQuestionSchema).min(1)
});

export const generatedPaperSchema = z.object({
  header: z.object({
    schoolName: z.string().default(""),
    subject: z.string().default(""),
    className: z.string().default(""),
    timeAllowed: z.string().default(""),
    maxMarks: z.coerce.number().min(0).default(0)
  }),
  studentSection: z
    .object({
      nameLabel: z.string().default("Name"),
      rollNumberLabel: z.string().default("Roll Number"),
      classSectionLabel: z.string().default("Class")
    })
    .default({
      nameLabel: "Name",
      rollNumberLabel: "Roll Number",
      classSectionLabel: "Class"
    }),
  sections: z.array(generatedSectionSchema).min(1),
  answerKey: z.string().default("")
});

export type GeneratedPaper = z.infer<typeof generatedPaperSchema>;
