"use strict";
// /server/api/admin/crm/users/index.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const constants_1 = require("@b/utils/constants");
const query_1 = require("@b/utils/query");
const utils_1 = require("./utils");
const sequelize_1 = require("sequelize");
exports.metadata = {
    summary: "Lists users with pagination and optional filtering",
    operationId: "listUsers",
    tags: ["Admin", "CRM", "User"],
    parameters: constants_1.crudParameters,
    responses: {
        200: {
            description: "List of users with pagination information",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            data: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: utils_1.userSchema,
                                },
                            },
                            pagination: constants_1.paginationSchema,
                        },
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("Users"),
        500: query_1.serverErrorResponse,
    },
    requiresAuth: true,
    permission: "Access User Management",
};
exports.default = async (data) => {
    const { query } = data;
    if (query.all === "true") {
        const users = await db_1.models.user.findAll({
            attributes: {
                exclude: [
                    "password",
                    "failedLoginAttempts",
                    "metadata",
                    "lastFailedLogin",
                    "walletAddress",
                    "walletProvider",
                    "updatedAt",
                ],
            },
            include: [
                {
                    model: db_1.models.role,
                    as: "role",
                    attributes: ["id", "name"],
                },
            ],
            where: {
                "$role.name$": { [sequelize_1.Op.ne]: "Super Admin" },
            },
        });
        return {
            data: users,
            pagination: null, // No pagination for `all=true`
        };
    }
    // Default behavior: fetch with pagination
    return (0, query_1.getFiltered)({
        model: db_1.models.user,
        query,
        sortField: query.sortField || "createdAt",
        includeModels: [
            {
                model: db_1.models.role,
                as: "role",
                attributes: ["id", "name"],
            },
        ],
        excludeFields: [
            "password",
            "failedLoginAttempts",
            "metadata",
            "lastFailedLogin",
            "walletAddress",
            "walletProvider",
            "updatedAt",
        ],
        excludeRecords: [
            {
                model: db_1.models.role,
                key: "name",
                value: "Super Admin",
            },
        ],
    });
};
