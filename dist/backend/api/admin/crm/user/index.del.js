"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const error_1 = require("@b/utils/error");
const db_1 = require("@b/db");
exports.metadata = {
    summary: "Bulk deletes users by UUIDs",
    operationId: "bulkDeleteUsers",
    tags: ["Admin", "CRM", "User"],
    parameters: (0, query_1.commonBulkDeleteParams)("Users"),
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        ids: {
                            type: "array",
                            items: { type: "string" },
                            description: "Array of user UUIDs to delete",
                        },
                    },
                    required: ["ids"],
                },
            },
        },
    },
    responses: (0, query_1.commonBulkDeleteResponses)("Users"),
    requiresAuth: true,
    permission: "Access User Management",
};
exports.default = async (data) => {
    const { body, query, user } = data;
    const { ids } = body;
    if (!(user === null || user === void 0 ? void 0 : user.id)) {
        throw (0, error_1.createError)({
            statusCode: 401,
            message: "Unauthorized",
        });
    }
    // Check if the request is from a Super Admin
    const userPk = await db_1.models.user.findByPk(user.id, {
        include: [{ model: db_1.models.role, as: "role" }],
    });
    if (!userPk || !userPk.role || userPk.role.name !== "Super Admin") {
        throw (0, error_1.createError)({
            statusCode: 403,
            message: "Forbidden - Only Super Admins can bulk delete users",
        });
    }
    // If desired, you can also verify that none of the target users
    // is a super admin to add further restrictions:
    const targetUsers = await db_1.models.user.findAll({
        where: { id: ids },
        include: [{ model: db_1.models.role, as: "role" }],
    });
    for (const targetUser of targetUsers) {
        if (targetUser.role && targetUser.role.name === "Super Admin") {
            throw (0, error_1.createError)({
                statusCode: 403,
                message: "Forbidden - You cannot delete Super Admin accounts",
            });
        }
    }
    return (0, query_1.handleBulkDelete)({
        model: "user",
        ids,
        query,
    });
};
