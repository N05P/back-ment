"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
    title: z.string().min(1, "Title required").max(120),
    description: z.string().max(2000).optional().or(z.literal("")),
    status: z.enum(["todo", "in_progress", "done"]).optional(),
});

export default function TaskForm({ onCreate }) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({ resolver: zodResolver(schema), defaultValues: { status: "todo" } });

    const submit = async (values) => {
        await onCreate({
            title: values.title,
            description: values.description || "",
            status: values.status || "todo",
        });
        reset({ title: "", description: "", status: "todo" });
    };

    return (
        <form onSubmit={handleSubmit(submit)} style={{ display: "grid", gap: 10 }}>
            <div>
                <input placeholder="Title" {...register("title")} />
                {errors.title ? <p style={{ color: "crimson" }}>{errors.title.message}</p> : null}
            </div>

            <div>
                <textarea placeholder="Description (optional)" rows={3} {...register("description")} />
                {errors.description ? (
                    <p style={{ color: "crimson" }}>{errors.description.message}</p>
                ) : null}
            </div>

            <div>
                <select {...register("status")}>
                    <option value="todo">todo</option>
                    <option value="in_progress">in_progress</option>
                    <option value="done">done</option>
                </select>
            </div>

            <button disabled={isSubmitting} type="submit">
                {isSubmitting ? "Creating..." : "Add Task"}
            </button>
        </form>
    );
}
