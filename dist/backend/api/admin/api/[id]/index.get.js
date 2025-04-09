"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const db_1 = require("@b/db");
const utils_1 = require("../utils");
exports.metadata = {
    summary: "Retrieves detailed information of a specific API key by ID",
    operationId: "getApiKeyById",
    tags: ["Admin", "API Keys"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            required: true,
            description: "ID of the API key to retrieve",
            schema: { type: "string" },
        },
    ],
    responses: {
        200: {
            description: "API Key details",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: utils_1.apiKeySchema,
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("API Key"),
        500: query_1.serverErrorResponse,
    },
    requiresAuth: true,
    permission: "Access API Key Management",
};
exports.default = async (data) => {
    const { params } = data;
    return await (0, query_1.getRecord)("apiKey", params.id, [
        {
            model: db_1.models.user,
            as: "user",
            attributes: ["firstName", "lastName", "email", "avatar"],
            required: false,
        },
    ], ["createdAt", "updatedAt"]);
};
