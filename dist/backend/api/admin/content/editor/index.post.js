"use strict";
// /server/api/editor/save.post.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const utils_1 = require("@b/api/content/page/utils");
const db_1 = require("@b/db");
const error_1 = require("@b/utils/error");
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Save editor state",
    operationId: "saveEditorState",
    tags: ["Admin", "Editor"],
    description: "Saves the current state of the editor.",
    requestBody: {
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        content: {
                            type: "string",
                            description: "The current state of the editor",
                        },
                        path: {
                            type: "string",
                            description: "The path to save the file",
                        },
                    },
                    required: ["content", "path"],
                },
            },
        },
    },
    responses: {
        200: {
            description: "State saved successfully",
        },
        500: query_1.serverErrorResponse,
    },
    requiresAuth: true,
    permission: "Access Frontend Builder",
};
exports.default = async (data) => {
    const { user, body } = data;
    if (!(user === null || user === void 0 ? void 0 : user.id))
        throw (0, error_1.createError)({ statusCode: 401, message: "Unauthorized" });
    try {
        const { content, path } = body;
        const existingState = await db_1.models.page.findOne({
            where: { slug: path === "/" ? "frontend" : path },
        });
        if (existingState) {
            await existingState.update({
                content,
            });
        }
        else {
            await db_1.models.page.create({
                title: "Frontend",
                slug: "frontend",
                content,
                status: "PUBLISHED",
                order: 0,
            });
        }
        await (0, utils_1.cachePages)();
        return { message: "State saved successfully" };
    }
    catch (error) {
        console.error("Failed to save editor state:", error);
        throw (0, error_1.createError)({
            statusCode: 500,
            message: "Failed to save editor state",
        });
    }
};
