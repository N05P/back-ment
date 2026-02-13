import { createTaskSchema } from "@/lib/validators/taskValidator";
import { NextResponse } from "next/server";
import connectDB from "@/database/mongodb";
import Task from "@/database/models/Task";
import UserProfile from "@/database/models/UserProfile";
import { getAuth } from "@/lib/better-auth/auth";


async function getCurrentUserWithRole(request) {
    const auth = await getAuth();
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user) return null;

    await connectDB();

    const profile = await UserProfile.findOne({
        authUserId: session.user.id,
    });

    return {
        id: session.user.id,
        role: profile?.role || "user",
    };
}


export async function POST(request) {
    try {
        const currentUser = await getCurrentUserWithRole(request);

        if (!currentUser) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        await connectDB();

        const body = await request.json();

        const parsedData = createTaskSchema.safeParse(body);

        if (!parsedData.success) {
            return NextResponse.json(
                {
                    message: "Validation failed",
                    errors: parsedData.error.errors,
                },
                { status: 400 }
            );
        }

        const task = await Task.create({
            ...parsedData.data,
            ownerAuthUserId: currentUser.id,
        });

        return NextResponse.json(task, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { message: "Server Error", error: error.message },
            { status: 500 }
        );
    }
}


export async function GET(request) {
    try {
        const currentUser = await getCurrentUserWithRole(request);
        if (!currentUser) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        await connectDB();

        let tasks;

        if (currentUser.role === "admin") {
            tasks = await Task.find().sort({ createdAt: -1 });
        } else {
            tasks = await Task.find({
                ownerAuthUserId: currentUser.id,
            }).sort({ createdAt: -1 });
        }

        return NextResponse.json(tasks);
    } catch (error) {
        return NextResponse.json(
            { message: "Server Error", error: error.message },
            { status: 500 }
        );
    }
}
