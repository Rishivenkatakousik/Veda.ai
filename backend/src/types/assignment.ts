export const ASSIGNMENT_STATUSES = [
    "draft",
    "queued",
    "processing",
    "completed",
    "failed"
] as const;
export type AssignmentStatus = (typeof ASSIGNMENT_STATUSES)[number];
export const QUESTION_DIFFICULTY_LEVELS = [
    "easy",
    "moderate",
    "challenging"
] as const;
export type QuestionDifficulty = (typeof QUESTION_DIFFICULTY_LEVELS)[number];
