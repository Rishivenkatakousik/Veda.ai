import { Schema, model, type HydratedDocument, type InferSchemaType } from "mongoose";
import { ASSIGNMENT_STATUSES } from "../types/assignment";
const questionConfigSchema = new Schema({
    type: { type: String, required: true, trim: true },
    count: { type: Number, required: true, min: 1 },
    marks: { type: Number, required: true, min: 1 }
}, { _id: false });
const generatedQuestionSchema = new Schema({
    text: { type: String, required: true, trim: true },
    difficulty: {
        type: String,
        enum: ["easy", "moderate", "challenging"],
        default: "moderate"
    },
    marks: { type: Number, required: true, min: 1 },
    options: { type: [String], default: undefined }
}, { _id: false });
const generatedSectionSchema = new Schema({
    title: { type: String, required: true, trim: true },
    instructions: { type: String, trim: true, default: "" },
    questions: { type: [generatedQuestionSchema], default: [] }
}, { _id: false });
const generatedPaperSchema = new Schema({
    header: {
        schoolName: { type: String, trim: true, default: "" },
        subject: { type: String, trim: true, default: "" },
        className: { type: String, trim: true, default: "" },
        timeAllowed: { type: String, trim: true, default: "" },
        maxMarks: { type: Number, min: 0, default: 0 }
    },
    studentSection: {
        nameLabel: { type: String, trim: true, default: "Name" },
        rollNumberLabel: { type: String, trim: true, default: "Roll Number" },
        classSectionLabel: { type: String, trim: true, default: "Class" }
    },
    sections: { type: [generatedSectionSchema], default: [] },
    answerKey: { type: String, trim: true, default: "" }
}, { _id: false });
const assignmentSchema = new Schema({
    title: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    className: { type: String, required: true, trim: true },
    schoolName: { type: String, required: true, trim: true },
    assignedOn: { type: Date, default: Date.now },
    dueDate: { type: Date, required: true },
    questionConfig: { type: [questionConfigSchema], required: true, default: [] },
    totalQuestions: { type: Number, required: true, min: 0, default: 0 },
    totalMarks: { type: Number, required: true, min: 0, default: 0 },
    instructions: { type: String, trim: true, default: "" },
    materialFiles: { type: [String], default: [] },
    status: {
        type: String,
        enum: ASSIGNMENT_STATUSES,
        default: "draft",
        index: true
    },
    generatedPaper: { type: generatedPaperSchema, default: undefined },
    answerKey: { type: String, trim: true, default: "" },
    pdfUrl: { type: String, trim: true, default: "" },
    createdBy: { type: String, required: true, trim: true },
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date, default: null }
}, {
    timestamps: true
});
assignmentSchema.index({ createdAt: -1 });
assignmentSchema.index({ assignedOn: -1 });
assignmentSchema.index({ title: "text", subject: "text" });
export type AssignmentDocument = HydratedDocument<InferSchemaType<typeof assignmentSchema>>;
export const AssignmentModel = model("Assignment", assignmentSchema);
