import { Router } from "express";
import { assignmentUpload } from "../config/upload";
import {
  createAssignmentController,
  deleteAssignmentController,
  getAssignmentController,
  listAssignmentsController
} from "../controllers/assignment.controller";
import { validate } from "../middlewares/validate.middleware";
import {
  assignmentByIdSchema,
  createAssignmentSchema,
  listAssignmentsSchema
} from "../validators/assignment.validator";

const assignmentRouter = Router();

assignmentRouter.get("/", validate(listAssignmentsSchema), listAssignmentsController);
assignmentRouter.get("/:id", validate(assignmentByIdSchema), getAssignmentController);
assignmentRouter.post(
  "/",
  assignmentUpload.array("materialFiles", 5),
  validate(createAssignmentSchema),
  createAssignmentController
);
assignmentRouter.delete("/:id", validate(assignmentByIdSchema), deleteAssignmentController);

export { assignmentRouter };
