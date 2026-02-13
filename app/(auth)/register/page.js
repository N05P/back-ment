"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {authClient} from '@/lib/auth-client'

const schema = z.object({
    name: z.string().min(1, "Name required").max(60),
    email: z.string().email("Valid email required"),
    password: z.string().min(8, "Min 8 chars").max(128),
});

export default function RegisterPage() {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({ resolver: zodResolver(schema) });

    const onSubmit = async (values) => {
        const { error } = await authClient.signUp.email({
            name: values.name,
            email: values.email,
            password: values.password,
        });

        if (error) {
            alert(error.message || "Sign up failed");
            return;
        }

        // tumhare config me autoSignIn: true hai, so direct dashboard
        router.push("/dashboard");
    };

    return (
        <div style={{ maxWidth: 420, margin: "40px auto" }}>
            <h1>Register</h1>

            <form onSubmit={handleSubmit(onSubmit)} style={{ display: "grid", gap: 12 }}>
                <div>
                    <input placeholder="Name" {...register("name")} />
                    {errors.name ? (
                        <p style={{ color: "crimson" }}>{errors.name.message}</p>
                    ) : null}
                </div>

                <div>
                    <input placeholder="Email" type="email" {...register("email")} />
                    {errors.email ? (
                        <p style={{ color: "crimson" }}>{errors.email.message}</p>
                    ) : null}
                </div>

                <div>
                    <input placeholder="Password" type="password" {...register("password")} />
                    {errors.password ? (
                        <p style={{ color: "crimson" }}>{errors.password.message}</p>
                    ) : null}
                </div>

                <button disabled={isSubmitting} type="submit">
                    {isSubmitting ? "Creating..." : "Create account"}
                </button>
            </form>

            <p style={{ marginTop: 12 }}>
                Already have an account? <Link href="/auth/login">Login</Link>
            </p>
        </div>
    );
}
