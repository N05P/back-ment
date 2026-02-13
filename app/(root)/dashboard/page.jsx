"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";

export default function DashboardPage() {
    const router = useRouter();

    const [me, setMe] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [msg, setMsg] = useState("");

    const load = async () => {
        setMsg("");
        setLoading(true);

        try {
            const meRes = await apiFetch("/api/v1/me");
            setMe(meRes?.user || null);

            const tasksRes = await apiFetch("/api/v1/tasks");
            setTasks(Array.isArray(tasksRes) ? tasksRes : []);
        } catch (e) {
            if (e?.status === 401) {
                router.push("/login"); // change to "/auth/login" if needed
                return;
            }
            setMsg(e?.data?.message || e?.message || "Failed to load");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const createTask = async (payload) => {
        setMsg("");
        try {
            await apiFetch("/api/v1/tasks", {
                method: "POST",
                body: JSON.stringify(payload),
            });
            await load();
        } catch (e) {
            setMsg(e?.data?.message || e?.message || "Create failed");
        }
    };

    const deleteTask = async (id) => {
        setMsg("");
        try {
            await apiFetch(`/api/v1/tasks/${id}`, { method: "DELETE" });
            setTasks((prev) => prev.filter((t) => t?._id !== id));
        } catch (e) {
            setMsg(e?.data?.message || e?.message || "Delete failed");
        }
    };

    // ✅ ADD THIS: update/edit task
    const updateTask = async (id, payload) => {
        setMsg("");
        try {
            // If your API uses PUT instead of PATCH, switch method to "PUT"
            const updated = await apiFetch(`/api/v1/tasks/${id}`, {
                method: "PATCH",
                body: JSON.stringify(payload),
            });

            // Update UI without full reload:
            setTasks((prev) =>
                prev.map((t) => (t?._id === id ? (updated?.task ?? updated ?? { ...t, ...payload }) : t))
            );
        } catch (e) {
            // TaskList shows localMsg from the thrown error, so rethrow
            throw e;
        }
    };

    const logout = async () => {
        try {
            await authClient.signOut();
        } finally {
            router.push("/login"); // change if needed
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-zinc-100 via-white to-zinc-200 px-4 py-10">
                <div className="mx-auto max-w-5xl">
                    <div className="rounded-3xl border border-white/40 bg-white/70 p-8 shadow-xl backdrop-blur-xl">
                        <div className="h-7 w-48 animate-pulse rounded-lg bg-zinc-200" />
                        <div className="mt-3 h-4 w-72 animate-pulse rounded bg-zinc-200" />
                        <div className="mt-10 grid gap-6 md:grid-cols-2">
                            <div className="h-64 animate-pulse rounded-2xl bg-zinc-200" />
                            <div className="h-64 animate-pulse rounded-2xl bg-zinc-200" />
                        </div>
                    </div>
                    <p className="mt-4 text-center text-sm text-zinc-600">
                        Loading your dashboard…
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-100 via-white to-zinc-200 px-4 py-10">
            <div className="mx-auto max-w-5xl">
                <div className="rounded-3xl border border-white/40 bg-white/70 p-6 shadow-xl backdrop-blur-xl md:p-8">
                    {/* Header */}
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div>
                            <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
                                Dashboard
                            </h1>

                            {me ? (
                                <p className="mt-2 text-sm text-zinc-600">
                                    Logged in as{" "}
                                    <span className="font-medium text-zinc-900">{me.email}</span>{" "}
                                    <span className="mx-2 text-zinc-400">•</span>
                                    Role:{" "}
                                    <span className="inline-flex items-center rounded-full border border-zinc-200 bg-white/90 px-2 py-0.5 text-xs font-medium text-zinc-800">
                    {me.role}
                  </span>
                                </p>
                            ) : null}
                        </div>

                        {/* Only Logout button */}
                        <button
                            onClick={logout}
                            className="h-10 rounded-xl bg-zinc-900 px-4 text-sm font-medium text-white shadow-sm transition
                         hover:bg-zinc-800 active:scale-[0.98]"
                        >
                            Logout
                        </button>
                    </div>

                    {/* Message */}
                    {msg ? (
                        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {msg}
                        </div>
                    ) : null}

                    {/* Content */}
                    <div className="mt-8 grid gap-6 md:grid-cols-2">
                        {/* Add Task */}
                        <div className="rounded-2xl border border-zinc-200 bg-white/80 p-5 shadow-sm">
                            <div className="mb-4">
                                <h2 className="text-lg font-semibold text-zinc-900">Add Task</h2>
                                <p className="mt-1 text-sm text-zinc-600">
                                    Create a task and it will appear on the right.
                                </p>
                            </div>
                            <TaskForm onCreate={createTask} />
                        </div>

                        {/* Tasks */}
                        <div className="rounded-2xl border border-zinc-200 bg-white/80 p-5 shadow-sm">
                            <div className="mb-4">
                                <div className="flex items-center justify-between gap-3">
                                    <h2 className="text-lg font-semibold text-zinc-900">Tasks</h2>
                                    <span className="rounded-full border border-zinc-200 bg-white px-2 py-0.5 text-xs font-medium text-zinc-700">
                    {tasks.length} total
                  </span>
                                </div>
                                <p className="mt-1 text-sm text-zinc-600">
                                    You can delete tasks{me?.role === "admin" ? " (admin enabled)." : "."}
                                </p>
                            </div>

                            <TaskList
                                tasks={tasks}
                                onDelete={deleteTask}
                                onUpdate={updateTask}   // ✅ PASS THIS
                                isAdmin={me?.role === "admin"}
                            />
                        </div>
                    </div>
                </div>

                <p className="mt-6 text-center text-xs text-zinc-500">
                    Tip: Keep tasks short and actionable.
                </p>
            </div>
        </div>
    );
}
