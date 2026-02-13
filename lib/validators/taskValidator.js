import { z } from "zod";

export const createTaskSchema = z.object({
    title: z.string().min(1, "Title is required").max(120),
    description: z.string().max(2000).optional(),
    status: z
        .enum(["todo", "in_progress", "done"])
        .optional(),
});

export const updateTaskSchema = createTaskSchema.partial();
