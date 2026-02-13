"use client";

import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";

const SwaggerUI = dynamic(() => import("swagger-ui-react"), { ssr: false });

export default function Page() {
    return (
        <div className="min-h-screen bg-white">
            <div className="mx-auto max-w-6xl px-4 py-8">
                <h1 className="text-2xl font-semibold text-zinc-900">API Docs</h1>
                <p className="mt-2 text-sm text-zinc-600">
                    Swagger UI powered docs. Login in your app so cookie auth works automatically.
                </p>

                <div className="mt-6 overflow-hidden rounded-2xl border border-zinc-200">
                    <SwaggerUI url="/api/openapi" />
                </div>
            </div>
        </div>
    );
}
