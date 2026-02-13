
import mongoose from "mongoose";

const UserProfileSchema = new mongoose.Schema(
    {
        authUserId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },

        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
            required: true,
            index: true,
        },
    },
    { timestamps: true }
);

export default mongoose.models.UserProfile ||
mongoose.model("UserProfile", UserProfileSchema);
