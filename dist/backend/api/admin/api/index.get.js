"use strict";
// /server/api/admin/apiKeys/index.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const constants_1 = require("@b/utils/constants");
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Lists all API keys with pagination and optional user filtering",
    operationId: "listAPIKeys",
    tags: ["Admin", "API Keys"],
    parameters: constants_1.crudParameters,
    responses: {
        200: {
            description: "List of API keys with user details and pagination information",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            data: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        id: { type: "string" },
                                        userId: { type: "string" },
                                        name: { type: "string" },
                                        key: { type: "string" },
                                        permissions: {
                                            type: "array",
                                            items: { type: "string" },
                                        },
                                        ipWhitelist: {
                                            type: "array",
                                            items: { type: "string" },
                                        },
                                        createdAt: { type: "string", format: "date-time" },
                                        updatedAt: { type: "string", format: "date-time" },
                                        user: {
                                            type: "object",
                                            properties: {
                                                firstName: { type: "string" },
                                                lastName: { type: "string" },
                                                email: { type: "string" },
                                                avatar: { type: "string" },
                                            },
                                        },
                                    },
                                },
                            },
                            pagination: constants_1.paginationSchema,
                        },
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("API Keys"),
        500: query_1.serverErrorResponse,
    },
    requiresAuth: true,
    permission: "Access API Key Management",
};
exports.default = async (data) => {
    const { query } = data;
    return (0, query_1.getFiltered)({
        model: db_1.models.apiKey,
        query,
        sortField: query.sortField || "createdAt",
        includeModels: [
            {
                model: db_1.models.user,
                as: "user",
                attributes: ["firstName", "lastName", "email", "avatar"],
                required: false,
            },
        ],
    });
};
