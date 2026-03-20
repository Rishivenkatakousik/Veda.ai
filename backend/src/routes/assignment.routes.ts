import { Router } from "express";
import { assignmentUpload } from "../config/upload";
import {
  createAssignmentController,
  deleteAssignmentController,
  downloadPdfController,
  generatePdfController,
  getAssignmentController,
  listAssignmentsController,
  regenerateAssignmentController
} from "../controllers/assignment.controller";
import { createAssignmentLimiter } from "../middlewares/rate-limit.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  assignmentByIdSchema,
  createAssignmentSchema,
  listAssignmentsSchema,
  regenerateAssignmentSchema
} from "../validators/assignment.validator";

const assignmentRouter = Router();

assignmentRouter.get("/", validate(listAssignmentsSchema), listAssignmentsController);
assignmentRouter.get("/:id", validate(assignmentByIdSchema), getAssignmentController);
assignmentRouter.post(
  "/",
  createAssignmentLimiter,
  assignmentUpload.array("materialFiles", 5),
  validate(createAssignmentSchema),
  createAssignmentController
);
assignmentRouter.post(
  "/:id/regenerate",
  createAssignmentLimiter,
  validate(regenerateAssignmentSchema),
  regenerateAssignmentController
);
assignmentRouter.post("/:id/pdf", validate(assignmentByIdSchema), generatePdfController);
assignmentRouter.get("/:id/pdf", validate(assignmentByIdSchema), downloadPdfController);
assignmentRouter.delete("/:id", validate(assignmentByIdSchema), deleteAssignmentController);

export { assignmentRouter };
