import http from "http";
import { app } from "./app";
import { env } from "./config/env";
import { connectMongo, disconnectMongo } from "./config/mongodb";
import { closeQueue } from "./config/queue";
import { closeRedis } from "./config/redis";
import { closePublisher } from "./services/realtime.service";
import { createAssignmentWorker } from "./workers/assignment.worker";
import { closeSocket, initializeSocket } from "./websocket/socket";
const startServer = async (): Promise<void> => {
    await connectMongo();
    const assignmentWorker = createAssignmentWorker();
    console.info("[worker] assignment worker started (in-process), waiting for jobs...");
    const httpServer = http.createServer(app);
    initializeSocket(httpServer);
    httpServer.listen(env.PORT, () => {
        console.info(`[server] running on port ${env.PORT} with prefix ${env.API_PREFIX}`);
    });
    const shutdown = async (): Promise<void> => {
        console.info("[server] graceful shutdown started");
        httpServer.close(async () => {
            await assignmentWorker.close();
            await Promise.all([
                closeSocket(),
                closeQueue(),
                closePublisher(),
                closeRedis(),
                disconnectMongo()
            ]);
            console.info("[server] shutdown complete");
            process.exit(0);
        });
    };
    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
};
startServer().catch((error: unknown) => {
    console.error("[server] failed to start", error);
    process.exit(1);
});
