import { Router } from "express";
import { getHealth } from "../controllers/health.controller";
import { validate } from "../middlewares/validate.middleware";
import { healthQuerySchema } from "../validators/health.validator";
const healthRouter = Router();
healthRouter.get("/", validate(healthQuerySchema), getHealth);
export { healthRouter };
