"use client";

export default function TaskList({ tasks, onDelete, isAdmin }) {
    if (!tasks?.length) return <p>No tasks yet.</p>;

    return (
        <div style={{ display: "grid", gap: 10 }}>
            {tasks.map((t) => (
                <div
                    key={t._id}
                    style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8 }}
                >
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                        <div>
                            <h3 style={{ margin: 0 }}>{t.title}</h3>
                            <p style={{ margin: "6px 0" }}>{t.description}</p>
                            <small>
                                status: <b>{t.status}</b> | owner: {t.ownerAuthUserId}
                            </small>
                        </div>

                        <div style={{ display: "grid", gap: 8, alignContent: "start" }}>
                            <button onClick={() => onDelete(t._id)}>Delete</button>
                            {isAdmin ? <small>(admin can delete any)</small> : null}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
