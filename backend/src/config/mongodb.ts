import mongoose from "mongoose";
import { env } from "./env";
export const connectMongo = async (): Promise<void> => {
    await mongoose.connect(env.MONGODB_URI);
};
export const getMongoHealth = async (): Promise<{
    status: "up" | "down";
    readyState: number;
}> => {
    const readyState = mongoose.connection.readyState;
    return {
        status: readyState === 1 ? "up" : "down",
        readyState
    };
};
export const disconnectMongo = async (): Promise<void> => {
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
    }
};
