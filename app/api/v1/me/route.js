import { NextResponse } from "next/server";
import { getCurrentUserWithRole } from "@/lib/helper";

export async function GET(request) {
    const user = await getCurrentUserWithRole(request);

    if (!user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ user });
}
