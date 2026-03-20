import { assignmentQueue } from "../config/queue";
import { AssignmentModel, type AssignmentDocument } from "../models/assignment.model";
import type { AssignmentStatus } from "../types/assignment";

type ListAssignmentsInput = {
  page: number;
  limit: number;
  search?: string;
  status?: AssignmentStatus;
  sort: string;
};

type CreateAssignmentInput = {
  title: string;
  subject: string;
  className: string;
  schoolName: string;
  assignedOn?: Date;
  dueDate: Date;
  questionConfig: Array<{ type: string; count: number; marks: number }>;
  instructions?: string;
  materialFiles?: string[];
  createdBy: string;
};

const buildSort = (sort: string): Record<string, 1 | -1> => {
  const field = sort.startsWith("-") ? sort.slice(1) : sort;
  return { [field]: sort.startsWith("-") ? -1 : 1 };
};

export const listAssignments = async (input: ListAssignmentsInput) => {
  const { page, limit, search, status, sort } = input;
  const filter: Record<string, unknown> = { isDeleted: false };

  if (status) {
    filter.status = status;
  }

  if (search) {
    filter.$text = { $search: search };
  }

  const [items, totalItems] = await Promise.all([
    AssignmentModel.find(filter)
      .sort(buildSort(sort))
      .skip((page - 1) * limit)
      .limit(limit)
      .select({
        title: 1,
        subject: 1,
        className: 1,
        assignedOn: 1,
        dueDate: 1,
        status: 1,
        totalQuestions: 1,
        totalMarks: 1
      })
      .lean(),
    AssignmentModel.countDocuments(filter)
  ]);

  return {
    items,
    pagination: {
      page,
      limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit) || 1
    }
  };
};

export const getAssignmentById = async (id: string) => {
  return AssignmentModel.findOne({ _id: id, isDeleted: false }).lean();
};

export const createAssignment = async (
  input: CreateAssignmentInput
): Promise<{ assignment: AssignmentDocument; jobId: string }> => {
  const totalQuestions = input.questionConfig.reduce((sum, row) => sum + row.count, 0);
  const totalMarks = input.questionConfig.reduce(
    (sum, row) => sum + row.count * row.marks,
    0
  );

  const assignment = await AssignmentModel.create({
    ...input,
    status: "queued",
    totalQuestions,
    totalMarks
  });

  const job = await assignmentQueue.add(
    "assignment-generate",
    { assignmentId: assignment._id.toString() },
    {
      attempts: 3,
      backoff: { type: "exponential", delay: 2000 },
      removeOnComplete: true
    }
  );

  return {
    assignment,
    jobId: String(job.id)
  };
};

export const regenerateAssignment = async (
  id: string
): Promise<{ assignment: AssignmentDocument; jobId: string } | null> => {
  const assignment = await AssignmentModel.findOne({ _id: id, isDeleted: false });
  if (!assignment) return null;

  assignment.status = "queued";
  assignment.set("generatedPaper", undefined);
  assignment.answerKey = "";
  assignment.pdfUrl = "";
  await assignment.save();

  const job = await assignmentQueue.add(
    "assignment-generate",
    { assignmentId: assignment._id.toString() },
    {
      attempts: 3,
      backoff: { type: "exponential", delay: 2000 },
      removeOnComplete: true
    }
  );

  return { assignment, jobId: String(job.id) };
};

export const softDeleteAssignment = async (id: string) => {
  return AssignmentModel.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { isDeleted: true, deletedAt: new Date() },
    { new: true }
  ).lean();
};
