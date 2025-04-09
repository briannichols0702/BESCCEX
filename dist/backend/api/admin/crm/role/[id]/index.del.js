"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const utils_1 = require("../utils");
const query_1 = require("@b/utils/query");
const error_1 = require("@b/utils/error");
exports.metadata = {
    summary: "Deletes a role",
    operationId: "deleteRole",
    tags: ["Admin", "CRM", "Role"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            description: "ID of the role to delete",
            required: true,
            schema: {
                type: "number",
            },
        },
    ],
    permission: "Access Role Management",
    responses: (0, query_1.deleteRecordResponses)("Role"),
    requiresAuth: true,
};
exports.default = async (data) => {
    const { params, user } = data;
    const { id } = params;
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
    // Optionally, prevent deleting a "Super Admin" role if such a special role exists.
    // For example, if the "Super Admin" role has an ID or name that should never be deleted:
    const roleToDelete = await db_1.models.role.findByPk(id);
    if (!roleToDelete) {
        throw (0, error_1.createError)({ statusCode: 404, message: "Role not found" });
    }
    if (roleToDelete.name === "Super Admin") {
        throw (0, error_1.createError)({
            statusCode: 403,
            message: "Forbidden - Cannot delete the Super Admin role",
        });
    }
    try {
        await db_1.sequelize.transaction(async (transaction) => {
            await db_1.models.rolePermission.destroy({
                where: {
                    roleId: id,
                },
                transaction,
            });
            await db_1.models.role.destroy({
                where: {
                    id,
                },
                transaction,
            });
        });
        await (0, utils_1.cacheRoles)();
        return {
            message: "Role removed successfully",
        };
    }
    catch (error) {
        console.error("Transaction failed:", error);
        throw new Error("Failed to remove the role");
    }
};
