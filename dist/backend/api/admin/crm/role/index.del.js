"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const utils_1 = require("./utils");
const query_1 = require("@b/utils/query");
const error_1 = require("@b/utils/error");
exports.metadata = {
    summary: "Bulk deletes roles",
    operationId: "deleteBulkRoles",
    tags: ["Admin", "CRM", "Role"],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        ids: {
                            type: "array",
                            items: {
                                type: "number",
                            },
                            description: "Array of role IDs to delete",
                        },
                    },
                    required: ["ids"],
                },
            },
        },
    },
    permission: "Access Role Management",
    responses: (0, query_1.commonBulkDeleteResponses)("Roles"),
    requiresAuth: true,
};
exports.default = async (data) => {
    const { body, user } = data;
    const { ids } = body;
    if (!(user === null || user === void 0 ? void 0 : user.id)) {
        throw (0, error_1.createError)({
            statusCode: 401,
            message: "Unauthorized",
        });
    }
    // Check if the request is from a Super Admin
    const authenticatedUser = await db_1.models.user.findByPk(user.id, {
        include: [{ model: db_1.models.role, as: "role" }],
    });
    if (!authenticatedUser || authenticatedUser.role.name !== "Super Admin") {
        throw (0, error_1.createError)({
            statusCode: 403,
            message: "Forbidden - Only Super Admins can delete roles",
        });
    }
    // Optionally, prevent deletion of any Super Admin role if you have such a concept.
    // If roles have a special "Super Admin" role that shouldn't be deleted, you can check here.
    const superAdminRole = await db_1.models.role.findOne({
        where: {
            name: "Super Admin",
        },
    });
    if (ids.includes(superAdminRole.id)) {
        throw (0, error_1.createError)({
            statusCode: 403,
            message: "Forbidden - Cannot delete Super Admin role",
        });
    }
    try {
        // Wrap operations in a transaction block
        await db_1.sequelize.transaction(async (transaction) => {
            // Delete role permissions for the specified roles
            await db_1.models.rolePermission.destroy({
                where: {
                    roleId: ids,
                },
                transaction,
            });
            // Delete the roles
            await db_1.models.role.destroy({
                where: {
                    id: ids,
                },
                transaction,
            });
        });
        await (0, utils_1.cacheRoles)(); // Rebuild the roles cache
        return {
            message: "Roles removed successfully",
        };
    }
    catch (error) {
        console.error("Failed to remove roles:", error);
        throw new Error("Failed to remove roles");
    }
};
