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
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: { title: "", description: "", status: "todo" },
        mode: "onBlur",
    });

    const submit = async (values) => {
        await onCreate({
            title: values.title,
            description: values.description || "",
            status: values.status || "todo",
        });
        reset({ title: "", description: "", status: "todo" });
    };

    return (
        <form onSubmit={handleSubmit(submit)} className="space-y-4">
            <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-800">Title</label>
                <input
                    placeholder="e.g., Follow up with client"
                    {...register("title")}
                    className={`h-11 w-full rounded-xl border bg-white px-3 text-sm text-zinc-900 outline-none transition
            placeholder:text-zinc-400
            focus:ring-2 focus:ring-zinc-900/10
            ${
                        errors.title
                            ? "border-red-500 focus:ring-red-500/20"
                            : "border-zinc-300 focus:border-zinc-500"
                    }`}
                />
                {errors.title ? (
                    <p className="text-sm text-red-600">{errors.title.message}</p>
                ) : (
                    <p className="text-xs text-zinc-500">Max 120 characters.</p>
                )}
            </div>

            <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-800">
                    Description <span className="text-zinc-500">(optional)</span>
                </label>
                <textarea
                    placeholder="Add more details…"
                    rows={4}
                    {...register("description")}
                    className={`w-full rounded-xl border bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition
            placeholder:text-zinc-400
            focus:ring-2 focus:ring-zinc-900/10
            ${
                        errors.description
                            ? "border-red-500 focus:ring-red-500/20"
                            : "border-zinc-300 focus:border-zinc-500"
                    }`}
                />
                {errors.description ? (
                    <p className="text-sm text-red-600">{errors.description.message}</p>
                ) : (
                    <p className="text-xs text-zinc-500">Max 2000 characters.</p>
                )}
            </div>

            <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-800">Status</label>

                <div className="relative">
                    <select
                        {...register("status")}
                        className="h-11 w-full appearance-none rounded-xl border border-zinc-300 bg-white px-3 pr-10 text-sm text-zinc-900 outline-none transition
                       focus:border-zinc-500 focus:ring-2 focus:ring-zinc-900/10"
                    >
                        <option value="todo">To do</option>
                        <option value="in_progress">In progress</option>
                        <option value="done">Done</option>
                    </select>

                    <svg
                        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            fillRule="evenodd"
                            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                            clipRule="evenodd"
                        />
                    </svg>
                </div>
            </div>

            <button
                disabled={isSubmitting}
                type="submit"
                className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-zinc-900 px-4 text-sm font-medium text-white shadow-sm transition
                   hover:bg-zinc-800 active:scale-[0.99]
                   disabled:cursor-not-allowed disabled:opacity-60"
            >
                {isSubmitting ? "Creating..." : "Add Task"}
            </button>

            <p className="text-xs text-zinc-500">
                Tip: Keep tasks short and actionable.
            </p>
        </form>
    );
}
