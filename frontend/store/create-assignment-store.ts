import { create } from "zustand";
import type { QuestionConfig } from "@/types/assignment";

const MAX_STEPS = 2;

interface CreateAssignmentState {
  step: number;
  title: string;
  subject: string;
  className: string;
  schoolName: string;
  dueDate: Date | null;
  questionConfig: QuestionConfig[];
  instructions: string;
  files: File[];

  setField: <K extends keyof CreateAssignmentFields>(
    field: K,
    value: CreateAssignmentFields[K],
  ) => void;
  addQuestionType: () => void;
  removeQuestionType: (index: number) => void;
  updateQuestionType: (
    index: number,
    field: keyof QuestionConfig,
    value: string | number,
  ) => void;
  addFiles: (files: File[]) => void;
  removeFile: (index: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
}

type CreateAssignmentFields = Pick<
  CreateAssignmentState,
  | "title"
  | "subject"
  | "className"
  | "schoolName"
  | "dueDate"
  | "instructions"
>;

const initialState: Pick<
  CreateAssignmentState,
  | "step"
  | "title"
  | "subject"
  | "className"
  | "schoolName"
  | "dueDate"
  | "questionConfig"
  | "instructions"
  | "files"
> = {
  step: 1,
  title: "",
  subject: "",
  className: "",
  schoolName: "",
  dueDate: null,
  questionConfig: [{ type: "Multiple Choice", count: 1, marks: 1 }],
  instructions: "",
  files: [],
};

export const useCreateAssignmentStore = create<CreateAssignmentState>(
  (set) => ({
    ...initialState,

    setField: (field, value) => set({ [field]: value }),

    addQuestionType: () =>
      set((state) => ({
        questionConfig: [
          ...state.questionConfig,
          { type: "", count: 1, marks: 1 },
        ],
      })),

    removeQuestionType: (index) =>
      set((state) => ({
        questionConfig: state.questionConfig.filter((_, i) => i !== index),
      })),

    updateQuestionType: (index, field, value) =>
      set((state) => ({
        questionConfig: state.questionConfig.map((item, i) =>
          i === index ? { ...item, [field]: value } : item,
        ),
      })),

    addFiles: (newFiles) =>
      set((state) => ({
        files: [...state.files, ...newFiles],
      })),

    removeFile: (index) =>
      set((state) => ({
        files: state.files.filter((_, i) => i !== index),
      })),

    nextStep: () =>
      set((state) => ({
        step: Math.min(state.step + 1, MAX_STEPS),
      })),

    prevStep: () =>
      set((state) => ({
        step: Math.max(state.step - 1, 1),
      })),

    reset: () => set(initialState),
  }),
);

export function selectTotalQuestions(state: CreateAssignmentState): number {
  return state.questionConfig.reduce((sum, q) => sum + q.count, 0);
}

export function selectTotalMarks(state: CreateAssignmentState): number {
  return state.questionConfig.reduce(
    (sum, q) => sum + q.count * q.marks,
    0,
  );
}
