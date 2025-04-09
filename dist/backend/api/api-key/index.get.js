"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
// /server/api/api-key/index.get.ts
const db_1 = require("@b/db");
const error_1 = require("@b/utils/error");
exports.metadata = {
    summary: "Lists all API keys",
    description: "Retrieves all API keys associated with the authenticated user.",
    operationId: "listApiKeys",
    tags: ["API Key Management"],
    responses: {
        200: {
            description: "API keys retrieved successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                id: { type: "string" },
                                name: { type: "string" },
                                key: { type: "string" },
                                permissions: { type: "array", items: { type: "string" } },
                                ipWhitelist: { type: "array", items: { type: "string" } },
                            },
                        },
                    },
                },
            },
        },
        401: { description: "Unauthorized" },
        500: { description: "Server error" },
    },
    requiresAuth: true,
};
exports.default = async (data) => {
    const { user } = data;
    if (!user)
        throw (0, error_1.createError)({ statusCode: 401, message: "Unauthorized" });
    const apiKeys = await db_1.models.apiKey.findAll({
        where: { userId: user.id },
        attributes: ["id", "name", "key", "permissions", "ipWhitelist"],
    });
    return apiKeys;
};
