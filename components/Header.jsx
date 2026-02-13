"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import  authClient  from "@/lib/auth-client";
import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export default function Header() {
    const router = useRouter();
    const pathname = usePathname();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);

    const loadUser = useCallback(async () => {
        try {
            const res = await apiFetch("/api/v1/me");
            setUser(res?.user || null);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);


    useEffect(() => {
        setLoading(true);
        setOpen(false);
        loadUser();
    }, [pathname, loadUser]);

    const logout = async () => {
        await authClient.signOut();

        setUser(null);
        setOpen(false);

        router.push("/login");
        router.refresh();
    };

    if (loading) return null;

    return (
        <header className="sticky top-0 z-50 border-b border-zinc-200/70 bg-white/70 backdrop-blur-xl">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
                <Link href="/" className="flex items-center gap-2">
                    <div className="grid h-9 w-9 place-items-center rounded-xl bg-zinc-900 text-white shadow-sm">
                        <span className="text-sm font-semibold">M</span>
                    </div>
                    <div className="leading-tight">
                        <p className="text-sm font-semibold text-zinc-900">back-ment</p>
                        <p className="text-xs text-zinc-500">Tasks & Dashboard</p>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden items-center gap-2 md:flex">
                    {user ? (
                        <>
                            <Link
                                href="/dashboard"
                                className="rounded-xl px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-900"
                            >
                                Dashboard
                            </Link>

                            <div className="mx-1 h-6 w-px bg-zinc-200" />

                            <div className="hidden lg:flex items-center gap-2 rounded-xl border border-zinc-200 bg-white/70 px-3 py-2">
                                <span className="text-xs text-zinc-500">Signed in:</span>
                                <span className="text-xs font-medium text-zinc-900">{user?.email}</span>
                            </div>

                            <button
                                onClick={logout}
                                className="ml-2 rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 active:scale-[0.98]"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="rounded-xl px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-900"
                            >
                                Login
                            </Link>

                            <Link
                                href="/register"
                                className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 active:scale-[0.98]"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </nav>

                <button
                    onClick={() => setOpen((v) => !v)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-white/80 text-zinc-900 shadow-sm transition hover:bg-white md:hidden"
                    aria-label="Open menu"
                    aria-expanded={open}
                >
                    {!open ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M4 7H20M4 12H20M4 17H20"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        </svg>
                    ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M6 6L18 18M18 6L6 18"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        </svg>
                    )}
                </button>
            </div>


            {open ? (
                <div className="md:hidden border-t border-zinc-200/70 bg-white/80 backdrop-blur-xl">
                    <div className="mx-auto max-w-6xl space-y-2 px-4 py-4">
                        {user ? (
                            <>
                                <div className="rounded-2xl border border-zinc-200 bg-white/80 p-3">
                                    <p className="text-xs text-zinc-500">Signed in as</p>
                                    <p className="text-sm font-medium text-zinc-900">{user?.email}</p>
                                </div>

                                <Link
                                    href="/dashboard"
                                    onClick={() => setOpen(false)}
                                    className="block rounded-xl px-3 py-2 text-sm font-medium text-zinc-800 transition hover:bg-zinc-100"
                                >
                                    Dashboard
                                </Link>

                                <button
                                    onClick={async () => {
                                        setOpen(false);
                                        await logout();
                                    }}
                                    className="w-full rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 active:scale-[0.98]"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    onClick={() => setOpen(false)}
                                    className="block rounded-xl px-3 py-2 text-sm font-medium text-zinc-800 transition hover:bg-zinc-100"
                                >
                                    Login
                                </Link>

                                <Link
                                    href="/register"
                                    onClick={() => setOpen(false)}
                                    className="block rounded-xl bg-zinc-900 px-4 py-2 text-center text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 active:scale-[0.98]"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            ) : null}
        </header>
    );
}
