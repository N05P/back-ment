"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import authClient  from "@/lib/auth-client";
import {toast} from "sonner";

const schema = z.object({
    email: z.string().email("Valid email required"),
    password: z.string().min(1, "Password required"),
});

export default function LoginPage() {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({ resolver: zodResolver(schema) });

    const onSubmit = async (values) => {
        const { error } = await authClient.signIn.email({
            email: values.email,
            password: values.password,
        });

        if (error) {
            toast.error('Login failed');
            return;
        }
        toast.success("Login Successful!");
        router.push("/dashboard");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-100 via-white to-zinc-200 px-4">
            <div className="w-full max-w-md rounded-3xl bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl p-8">

                {/* Heading */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-semibold text-zinc-900">Welcome Back</h1>
                    <p className="text-sm text-zinc-600 mt-2">
                        Sign in to continue to your account
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            {...register("email")}
                            className={`w-full h-12 rounded-xl border px-4 text-sm outline-none transition
          placeholder:text-zinc-400 bg-white/80 text-black
          focus:ring-2 focus:ring-black/10
          ${errors.email
                                ? "border-red-500 focus:ring-red-500/20"
                                : "border-zinc-300 focus:border-zinc-500"
                            }`}
                        />
                        {errors.email && (
                            <p className="text-sm text-red-600 mt-1">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="text-sm font-medium text-zinc-700">
                                Password
                            </label>
                        </div>

                        <input
                            type="password"
                            placeholder="••••••••"
                            {...register("password")}
                            className={`w-full h-12 rounded-xl border px-4 text-sm outline-none transition
          placeholder:text-zinc-400 bg-white/80 text-black
          focus:ring-2 focus:ring-black/10
          ${errors.password
                                ? "border-red-500 focus:ring-red-500/20"
                                : "border-zinc-300 focus:border-zinc-500"
                            }`}
                        />
                        {errors.password && (
                            <p className="text-sm text-red-600 mt-1">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    <button
                        disabled={isSubmitting}
                        type="submit"
                        className="w-full h-12 rounded-xl bg-black text-white text-sm font-medium transition
        hover:bg-zinc-800 active:scale-[0.98]
        disabled:opacity-60 disabled:cursor-not-allowed shadow-md"
                    >
                        {isSubmitting ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                <p className="text-center text-sm text-zinc-600 mt-6">
                    New here?{" "}
                    <Link
                        href="/register"
                        className="font-medium text-black hover:underline"
                    >
                        Create an account
                    </Link>
                </p>
            </div>
        </div>


    );
}
