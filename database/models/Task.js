import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true, maxlength: 120 },
        description: { type: String, default: "", trim: true, maxlength: 2000 },

        status: {
            type: String,
            enum: ["todo", "in_progress", "done"],
            default: "todo",
            index: true,
        },

        ownerAuthUserId: {
            type: String,
            required: true,
            index: true,
        },
    },
    { timestamps: true }
);


TaskSchema.index({ ownerAuthUserId: 1, createdAt: -1 });

export default mongoose.models.Task || mongoose.model("Task", TaskSchema);
