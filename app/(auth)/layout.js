import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getAuth } from "@/lib/better-auth/auth";

export default async function AuthLayout({ children }) {
    const auth = await getAuth();

    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (session?.user) {
        redirect("/dashboard");
    }

    return <>{children}</>;
}
