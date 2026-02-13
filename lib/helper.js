import connectDB from "@/database/mongodb";
import UserProfile from "@/database/models/UserProfile";
import { getAuth } from "@/lib/better-auth/auth";

export async function getCurrentUserWithRole(request) {
    const auth = await getAuth();
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user) return null;

    await connectDB();

    const profile = await UserProfile.findOneAndUpdate(
        { authUserId: session.user.id },
        { $setOnInsert: { role: "user" } },
        { new: true, upsert: true }
    );

    return {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: profile.role,
    };
}
