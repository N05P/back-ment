"use client";

import { useMemo, useState } from "react";

export default function TaskList({ tasks, onDelete, onUpdate, isAdmin }) {
    const [editingId, setEditingId] = useState(null);
    const [draft, setDraft] = useState({ title: "", description: "", status: "todo" });
    const [saving, setSaving] = useState(false);
    const [localMsg, setLocalMsg] = useState("");

    const startEdit = (t) => {
        setLocalMsg("");
        setEditingId(t._id);
        setDraft({
            title: t.title || "",
            description: t.description || "",
            status: t.status || "todo",
        });
    };

    const cancelEdit = () => {
        setLocalMsg("");
        setEditingId(null);
        setDraft({ title: "", description: "", status: "todo" });
    };

    const saveEdit = async (id) => {
        if (!onUpdate) {
            setLocalMsg("onUpdate prop missing (edit API not connected).");
            return;
        }

        const cleanTitle = draft.title.trim();
        if (!cleanTitle) {
            setLocalMsg("Title is required.");
            return;
        }

        setSaving(true);
        setLocalMsg("");
        try {
            await onUpdate(id, {
                title: cleanTitle,
                description: draft.description || "",
                status: draft.status || "todo",
            });
            setEditingId(null);
        } catch (e) {
            setLocalMsg(e?.data?.message || e?.message || "Update failed");
        } finally {
            setSaving(false);
        }
    };

    const statusBadge = (status) => {
        const base =
            "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium";
        if (status === "done") return `${base} border-emerald-200 bg-emerald-50 text-emerald-800`;
        if (status === "in_progress") return `${base} border-amber-200 bg-amber-50 text-amber-800`;
        return `${base} border-zinc-200 bg-zinc-50 text-zinc-700`; // todo
    };

    if (!tasks?.length) {
        return (
            <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-6 text-center">
                <p className="text-sm font-medium text-zinc-900">No tasks yet</p>
                <p className="mt-1 text-sm text-zinc-600">
                    Create a task from the left panel to see it here.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {tasks.map((t) => {
                const isEditing = editingId === t._id;

                return (
                    <div
                        key={t._id}
                        className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:shadow-md"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0 flex-1">
                                {/* Title + Status */}
                                <div className="flex flex-wrap items-center gap-2">
                                    {!isEditing ? (
                                        <>
                                            <h3 className="truncate text-sm font-semibold text-zinc-900">
                                                {t.title || "Untitled Task"}
                                            </h3>
                                            <span className={statusBadge(t.status)}>{t.status || "todo"}</span>
                                        </>
                                    ) : (
                                        <>
                                            <input
                                                value={draft.title}
                                                onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                                                placeholder="Title"
                                                className="h-10 w-full max-w-[420px] rounded-xl border border-zinc-300 bg-white px-3 text-sm text-zinc-900 outline-none transition
                                   placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-900/10"
                                            />

                                            <div className="relative">
                                                <select
                                                    value={draft.status}
                                                    onChange={(e) => setDraft((d) => ({ ...d, status: e.target.value }))}
                                                    className="h-10 appearance-none rounded-xl border border-zinc-300 bg-white px-3 pr-9 text-sm text-zinc-900 outline-none transition
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
                                        </>
                                    )}
                                </div>

                                {!isEditing ? (
                                    t.description ? (
                                        <p className="mt-1 line-clamp-2 text-sm text-zinc-600">{t.description}</p>
                                    ) : (
                                        <p className="mt-1 text-sm text-zinc-500">No description</p>
                                    )
                                ) : (
                                    <textarea
                                        value={draft.description}
                                        onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
                                        rows={3}
                                        placeholder="Description (optional)"
                                        className="mt-3 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition
                               placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-900/10"
                                    />
                                )}

                                {isEditing && localMsg ? (
                                    <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                                        {localMsg}
                                    </div>
                                ) : null}

                                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[11px] font-medium text-zinc-700">
                    Owner: {t.ownerAuthUserId || "—"}
                  </span>

                                    <span className="rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[11px] font-medium text-zinc-700">
                    ID: {String(t._id).slice(0, 6)}…
                  </span>

                                    {isAdmin ? (
                                        <span className="rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-800">
                      Admin can delete any
                    </span>
                                    ) : null}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="shrink-0 flex flex-col gap-2">
                                {!isEditing ? (
                                    <>
                                        <button
                                            onClick={() => startEdit(t)}
                                            className="inline-flex h-9 items-center justify-center rounded-xl border border-zinc-200 bg-white px-3 text-xs font-medium text-zinc-700 transition
                                 hover:bg-zinc-50 active:scale-[0.99]"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() => onDelete(t._id)}
                                            className="inline-flex h-9 items-center justify-center rounded-xl border border-red-200 bg-red-50 px-3 text-xs font-medium text-red-700 transition
                                 hover:bg-red-100 active:scale-[0.99]"
                                        >
                                            Delete
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => saveEdit(t._id)}
                                            disabled={saving}
                                            className="inline-flex h-9 items-center justify-center rounded-xl bg-zinc-900 px-3 text-xs font-medium text-white shadow-sm transition
                                 hover:bg-zinc-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            {saving ? "Saving..." : "Save"}
                                        </button>

                                        <button
                                            onClick={cancelEdit}
                                            disabled={saving}
                                            className="inline-flex h-9 items-center justify-center rounded-xl border border-zinc-200 bg-white px-3 text-xs font-medium text-zinc-700 transition
                                 hover:bg-zinc-50 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            Cancel
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
