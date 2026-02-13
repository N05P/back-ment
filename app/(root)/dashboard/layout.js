import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getAuth } from "@/lib/better-auth/auth";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function RootLayout({ children }) {
    const auth = await getAuth();

    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) redirect("/login");

    return <>{children}</>;
}
