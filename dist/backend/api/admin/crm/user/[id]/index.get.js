"use strict";
// /server/api/admin/users/[id].get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
const db_1 = require("@b/db");
exports.metadata = {
    summary: "Retrieves detailed information of a specific user by UUID",
    operationId: "getUserByUuid",
    tags: ["Admin", "CRM", "User"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            required: true,
            description: "ID of the user to retrieve",
            schema: { type: "string" },
        },
    ],
    responses: {
        200: {
            description: "User details",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: utils_1.userSchema,
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("User"),
        500: query_1.serverErrorResponse,
    },
    requiresAuth: true,
    permission: "Access User Management",
};
exports.default = async (data) => {
    const { params } = data;
    return await (0, query_1.getRecord)("user", params.id, [
        {
            model: db_1.models.role,
            as: "role",
            attributes: ["id", "name"],
        },
    ], [
        "password",
        "lastLogin",
        "lastFailedLogin",
        "failedLoginAttempts",
        "walletAddress",
        "walletProvider",
        "metadata",
        "updatedAt",
    ]);
};
