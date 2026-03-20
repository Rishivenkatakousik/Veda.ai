import { connectMongo, disconnectMongo } from "./config/mongodb";
import { closeRedis } from "./config/redis";
import { closePublisher } from "./services/realtime.service";
import { createAssignmentWorker } from "./workers/assignment.worker";

const startWorker = async (): Promise<void> => {
  await connectMongo();

  const worker = createAssignmentWorker();
  console.info("[worker] assignment worker started, waiting for jobs...");

  const shutdown = async (): Promise<void> => {
    console.info("[worker] graceful shutdown started");
    await worker.close();
    await Promise.all([closePublisher(), closeRedis(), disconnectMongo()]);
    console.info("[worker] shutdown complete");
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
};

startWorker().catch((error: unknown) => {
  console.error("[worker] failed to start", error);
  process.exit(1);
});
