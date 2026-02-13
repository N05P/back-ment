import { NextResponse } from "next/server";

export async function GET() {
    const spec = {
        openapi: "3.0.3",
        info: {
            title: "Task Manager API",
            version: "1.0.0",
            description: "API documentation for your Task Manager backend",
        },
        servers: [
            { url: "http://localhost:3000", description: "Local" },
        ],
        components: {
            securitySchemes: {
                cookieAuth: {
                    type: "apiKey",
                    in: "cookie",
                    name: "better-auth.session",
                    description:
                        "Better Auth session cookie. Login in browser to set cookie automatically.",
                },
            },
            schemas: {
                Task: {
                    type: "object",
                    properties: {
                        _id: { type: "string", example: "65b123abc123def456789012" },
                        title: { type: "string", example: "Finish dashboard" },
                        description: { type: "string", example: "Add edit + delete features" },
                        status: {
                            type: "string",
                            enum: ["todo", "in_progress", "done"],
                            example: "todo",
                        },
                        ownerAuthUserId: { type: "string", example: "user_123" },
                        createdAt: { type: "string", example: "2026-02-13T10:00:00.000Z" },
                        updatedAt: { type: "string", example: "2026-02-13T10:00:00.000Z" },
                    },
                },
                CreateTaskBody: {
                    type: "object",
                    required: ["title"],
                    properties: {
                        title: { type: "string", example: "New Task" },
                        description: { type: "string", example: "Optional description" },
                        status: {
                            type: "string",
                            enum: ["todo", "in_progress", "done"],
                            example: "todo",
                        },
                    },
                },
                UpdateTaskBody: {
                    type: "object",
                    properties: {
                        title: { type: "string", example: "Updated title" },
                        description: { type: "string", example: "Updated description" },
                        status: {
                            type: "string",
                            enum: ["todo", "in_progress", "done"],
                            example: "in_progress",
                        },
                    },
                },
                MeResponse: {
                    type: "object",
                    properties: {
                        user: {
                            type: "object",
                            properties: {
                                email: { type: "string", example: "user@gmail.com" },
                                role: { type: "string", example: "admin" },
                            },
                        },
                    },
                },
                ErrorResponse: {
                    type: "object",
                    properties: {
                        message: { type: "string", example: "Something went wrong" },
                    },
                },
            },
        },

        // If your API requires login for these endpoints:
        security: [{ cookieAuth: [] }],

        paths: {
            "/api/v1/me": {
                get: {
                    summary: "Get current logged-in user",
                    tags: ["Auth"],
                    responses: {
                        200: {
                            description: "Current user",
                            content: {
                                "application/json": { schema: { $ref: "#/components/schemas/MeResponse" } },
                            },
                        },
                        401: {
                            description: "Unauthorized",
                            content: {
                                "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } },
                            },
                        },
                    },
                },
            },

            "/api/v1/tasks": {
                get: {
                    summary: "List tasks",
                    tags: ["Tasks"],
                    responses: {
                        200: {
                            description: "Array of tasks",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "array",
                                        items: { $ref: "#/components/schemas/Task" },
                                    },
                                },
                            },
                        },
                        401: {
                            description: "Unauthorized",
                            content: {
                                "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } },
                            },
                        },
                    },
                },
                post: {
                    summary: "Create a task",
                    tags: ["Tasks"],
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": { schema: { $ref: "#/components/schemas/CreateTaskBody" } },
                        },
                    },
                    responses: {
                        201: {
                            description: "Created",
                            content: {
                                "application/json": { schema: { $ref: "#/components/schemas/Task" } },
                            },
                        },
                        400: {
                            description: "Validation error",
                            content: {
                                "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } },
                            },
                        },
                        401: {
                            description: "Unauthorized",
                            content: {
                                "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } },
                            },
                        },
                    },
                },
            },

            "/api/v1/tasks/{id}": {
                patch: {
                    summary: "Update a task",
                    tags: ["Tasks"],
                    parameters: [
                        {
                            name: "id",
                            in: "path",
                            required: true,
                            schema: { type: "string" },
                            example: "65b123abc123def456789012",
                        },
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": { schema: { $ref: "#/components/schemas/UpdateTaskBody" } },
                        },
                    },
                    responses: {
                        200: {
                            description: "Updated task (shape may vary based on your backend response)",
                            content: {
                                "application/json": { schema: { $ref: "#/components/schemas/Task" } },
                            },
                        },
                        401: {
                            description: "Unauthorized",
                            content: {
                                "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } },
                            },
                        },
                        404: {
                            description: "Not found",
                            content: {
                                "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } },
                            },
                        },
                    },
                },
                delete: {
                    summary: "Delete a task",
                    tags: ["Tasks"],
                    parameters: [
                        {
                            name: "id",
                            in: "path",
                            required: true,
                            schema: { type: "string" },
                            example: "65b123abc123def456789012",
                        },
                    ],
                    responses: {
                        200: { description: "Deleted" },
                        401: {
                            description: "Unauthorized",
                            content: {
                                "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } },
                            },
                        },
                        404: {
                            description: "Not found",
                            content: {
                                "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } },
                            },
                        },
                    },
                },
            },
        },
    };

    return NextResponse.json(spec);
}
