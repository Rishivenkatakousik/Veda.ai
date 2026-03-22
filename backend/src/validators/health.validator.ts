import { z } from "zod";
export const healthQuerySchema = z.object({
    query: z.object({
        verbose: z.enum(["true", "false"]).optional()
    }),
    params: z.object({}),
    body: z.object({})
});
