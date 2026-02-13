import { updateTaskSchema } from "@/lib/validators/taskValidator";
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



export async function PATCH(request, { params }) {
    try {

        const {id} = await params;
        const currentUser = await getCurrentUserWithRole(request);

        if (!currentUser) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        await connectDB();

        const task = await Task.findById(id);

        if (!task) {
            return NextResponse.json(
                { message: "Task not found" },
                { status: 404 }
            );
        }

        if (
            currentUser.role !== "admin" &&
            task.ownerAuthUserId !== currentUser.id
        ) {
            return NextResponse.json(
                { message: "Forbidden" },
                { status: 403 }
            );
        }

        const body = await request.json();

        const parsedData = updateTaskSchema.safeParse(body);

        if (!parsedData.success) {
            return NextResponse.json(
                {
                    message: "Validation failed",
                    errors: parsedData.error.errors,
                },
                { status: 400 }
            );
        }

        Object.assign(task, parsedData.data);

        await task.save();

        return NextResponse.json(task);
    } catch (error) {
        return NextResponse.json(
            { message: "Server Error", error: error.message },
            { status: 500 }
        );
    }
}


export async function DELETE(request, { params }) {
    try {
        const { id } = await params;

        const currentUser = await getCurrentUserWithRole(request);
        if (!currentUser) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        const task = await Task.findById(id);
        if (!task) {
            return NextResponse.json({ message: "Task not found" }, { status: 404 });
        }

        if (currentUser.role !== "admin" && task.ownerAuthUserId !== currentUser.id) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        await task.deleteOne();
        return NextResponse.json({ message: "Task deleted successfully" });
    } catch (error) {
        return NextResponse.json(
            { message: "Server Error", error: error.message },
            { status: 500 }
        );
    }
}
