import { z } from "zod";
import { QUESTION_DIFFICULTY_LEVELS } from "../types/assignment";
const MCQ_MIN_OPTIONS = 4;
export const isMcqQuestionType = (type: string): boolean => {
    const t = type.trim().toLowerCase();
    return t === "mcq" || t === "multiple choice" || t.includes("multiple choice");
};
const generatedQuestionSchema = z.object({
    text: z.string().min(1),
    difficulty: z.enum(QUESTION_DIFFICULTY_LEVELS).default("moderate"),
    marks: z.coerce.number().int().positive(),
    options: z.array(z.string().min(1)).optional()
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
type QuestionConfigRow = {
    type: string;
    count: number;
    marks: number;
};
export function assertMcqOptionsForConfig(paper: GeneratedPaper, questionConfig: QuestionConfigRow[]): void {
    if (paper.sections.length !== questionConfig.length) {
        throw new Error(`Expected exactly ${questionConfig.length} section(s) in the same order as the question breakdown; got ${paper.sections.length}.`);
    }
    for (let i = 0; i < questionConfig.length; i++) {
        const cfg = questionConfig[i];
        const section = paper.sections[i];
        if (section.questions.length !== cfg.count) {
            throw new Error(`Section ${i + 1} (${cfg.type}): expected ${cfg.count} question(s), got ${section.questions.length}.`);
        }
        if (!isMcqQuestionType(cfg.type))
            continue;
        for (let j = 0; j < section.questions.length; j++) {
            const q = section.questions[j];
            const n = q.options?.length ?? 0;
            if (n < MCQ_MIN_OPTIONS) {
                throw new Error(`Section ${i + 1} (${cfg.type}), question ${j + 1}: multiple-choice items must include "options" with at least ${MCQ_MIN_OPTIONS} non-empty strings (got ${n}).`);
            }
        }
    }
}
