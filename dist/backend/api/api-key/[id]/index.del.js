"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
// /server/api/api-key/[id].delete.ts
const error_1 = require("@b/utils/error");
const db_1 = require("@b/db");
exports.metadata = {
    summary: "Deletes an API key",
    description: "Deletes an API key by its ID.",
    operationId: "deleteApiKey",
    tags: ["API Key Management"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            required: true,
            description: "The ID of the API key to delete",
            schema: { type: "string" },
        },
    ],
    responses: {
        200: {
            description: "API key deleted successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            message: { type: "string" },
                        },
                    },
                },
            },
        },
        401: { description: "Unauthorized" },
        404: { description: "API key not found" },
        500: { description: "Server error" },
    },
    requiresAuth: true,
};
exports.default = async (data) => {
    const { user, params } = data;
    if (!user)
        throw (0, error_1.createError)({ statusCode: 401, message: "Unauthorized" });
    const { id } = params;
    const apiKey = await db_1.models.apiKey.findOne({
        where: { id, userId: user.id },
    });
    if (!apiKey)
        throw (0, error_1.createError)({ statusCode: 404, message: "API Key not found" });
    await apiKey.destroy({ force: true });
    return { message: "API Key deleted successfully" };
};
