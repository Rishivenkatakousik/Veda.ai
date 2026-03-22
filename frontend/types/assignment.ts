export const ASSIGNMENT_STATUSES = [
  "draft",
  "queued",
  "processing",
  "completed",
  "failed",
] as const;

export type AssignmentStatus = (typeof ASSIGNMENT_STATUSES)[number];

export const QUESTION_DIFFICULTY_LEVELS = [
  "easy",
  "moderate",
  "challenging",
] as const;

export type QuestionDifficulty = (typeof QUESTION_DIFFICULTY_LEVELS)[number];

export interface QuestionConfig {
  type: string;
  count: number;
  marks: number;
}

export interface GeneratedQuestion {
  text: string;
  difficulty: QuestionDifficulty;
  marks: number;
  /** Present for multiple-choice questions (four or more choices). */
  options?: string[];
}

export interface GeneratedSection {
  title: string;
  instructions: string;
  questions: GeneratedQuestion[];
}

export interface PaperHeader {
  schoolName: string;
  subject: string;
  className: string;
  timeAllowed: string;
  maxMarks: number;
}

export interface StudentSection {
  nameLabel: string;
  rollNumberLabel: string;
  classSectionLabel: string;
}

export interface GeneratedPaper {
  header: PaperHeader;
  studentSection: StudentSection;
  sections: GeneratedSection[];
  answerKey: string;
}

export interface Assignment {
  _id: string;
  title: string;
  subject: string;
  className: string;
  schoolName: string;
  assignedOn: string;
  dueDate: string;
  questionConfig: QuestionConfig[];
  totalQuestions: number;
  totalMarks: number;
  instructions: string;
  materialFiles: string[];
  status: AssignmentStatus;
  generatedPaper?: GeneratedPaper;
  answerKey: string;
  pdfUrl: string;
  createdBy: string;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export type AssignmentListItem = Pick<
  Assignment,
  | "_id"
  | "title"
  | "subject"
  | "className"
  | "assignedOn"
  | "dueDate"
  | "status"
  | "totalQuestions"
  | "totalMarks"
  | "createdAt"
>;

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error: { message: string } | null;
  meta: PaginationMeta | Record<string, never>;
}

export interface CreateAssignmentResponse {
  assignmentId: string;
  status: AssignmentStatus;
  jobId: string;
}

export interface RegenerateAssignmentResponse {
  assignmentId: string;
  status: AssignmentStatus;
  jobId: string;
}

export interface GeneratePdfResponse {
  assignmentId: string;
  pdfUrl: string;
  filePath: string;
}

export interface DeleteAssignmentResponse {
  id: string;
  deleted: boolean;
}
