import type { Request, Response } from "express";
import {
  createAssignment,
  getAssignmentById,
  listAssignments,
  softDeleteAssignment
} from "../services/assignment.service";

export const listAssignmentsController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { page, limit, search, status, sort } = req.query as Record<string, string>;

  const result = await listAssignments({
    page: Number(page),
    limit: Number(limit),
    search,
    status: status as
      | "draft"
      | "queued"
      | "processing"
      | "completed"
      | "failed"
      | undefined,
    sort
  });

  res.status(200).json({
    success: true,
    data: result.items,
    error: null,
    meta: result.pagination
  });
};

export const getAssignmentController = async (
  req: Request,
  res: Response
): Promise<void> => {
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

export const createAssignmentController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const fileNames =
    ((req.files as Express.Multer.File[] | undefined) ?? []).map(
      (file) => file.originalname
    ) ?? [];

  const input = req.body as Record<string, unknown>;
  const fromBody = Array.isArray(input.materialFiles)
    ? (input.materialFiles as string[])
    : [];

  const result = await createAssignment({
    title: String(input.title),
    subject: String(input.subject),
    className: String(input.className),
    schoolName: String(input.schoolName),
    assignedOn: input.assignedOn ? new Date(String(input.assignedOn)) : undefined,
    dueDate: new Date(String(input.dueDate)),
    questionConfig: input.questionConfig as Array<{
      type: string;
      count: number;
      marks: number;
    }>,
    instructions: input.instructions ? String(input.instructions) : "",
    materialFiles: [...fromBody, ...fileNames],
    createdBy: String(input.createdBy)
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

export const deleteAssignmentController = async (
  req: Request,
  res: Response
): Promise<void> => {
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
