import cors from "cors";
import express from "express";
import { env } from "./config/env";
import { errorMiddleware } from "./middlewares/error.middleware";
import { notFoundMiddleware } from "./middlewares/notFound.middleware";
import { assignmentRouter } from "./routes/assignment.routes";
import { healthRouter } from "./routes/health.routes";

export const app = express();

app.use(
  cors({
    origin: env.CORS_ORIGINS,
    credentials: true
  })
);
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    data: { service: "vedaai-backend", version: "1.0.0" },
    error: null,
    meta: {}
  });
});

app.use(`${env.API_PREFIX}/health`, healthRouter);
app.use(`${env.API_PREFIX}/assignments`, assignmentRouter);

app.use(notFoundMiddleware);
app.use(errorMiddleware);
