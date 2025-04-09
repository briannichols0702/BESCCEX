"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
const db_1 = require("@b/db");
const error_1 = require("@b/utils/error");
exports.metadata = {
    summary: "Updates an existing role",
    operationId: "updateRole",
    tags: ["Admin", "CRM", "Role"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            required: true,
            description: "ID of the role to update",
            schema: {
                type: "string",
            },
        },
    ],
    requestBody: {
        required: true,
        description: "Updated data for the role",
        content: {
            "application/json": {
                schema: utils_1.roleUpdateSchema,
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("Role"),
    requiresAuth: true,
    permission: "Access Role Management",
};
exports.default = async (data) => {
    const { body, params, user } = data;
    const { id } = params;
    const { name, permissions } = body;
    // Ensure the request is made by a Super Admin
    if (!(user === null || user === void 0 ? void 0 : user.id)) {
        throw (0, error_1.createError)({
            statusCode: 401,
            message: "Unauthorized",
        });
    }
    const authenticatedUser = await db_1.models.user.findByPk(user.id, {
        include: [{ model: db_1.models.role, as: "role" }],
    });
    if (!authenticatedUser ||
        !authenticatedUser.role ||
        authenticatedUser.role.name !== "Super Admin") {
        throw (0, error_1.createError)({
            statusCode: 403,
            message: "Forbidden - Only Super Admins can update roles",
        });
    }
    try {
        // Fetch the role by id, including current permissions
        const role = await db_1.models.role.findByPk(id, {
            include: [{ model: db_1.models.permission, as: "permissions" }],
        });
        if (!role) {
            throw new Error("Role not found");
        }
        // Update role name if provided
        if (name && role.name !== name) {
            await role.update({ name });
        }
        // Update permissions if provided
        if (permissions) {
            const permissionIds = permissions.map((permission) => permission.id);
            // Update role's permissions
            await role.setPermissions(permissionIds);
        }
        // Refetch the updated role with its permissions
        const updatedRole = await db_1.models.role.findByPk(id, {
            include: [{ model: db_1.models.permission, as: "permissions" }],
        });
        return { message: "Role updated successfully", role: updatedRole };
    }
    catch (error) {
        throw new Error(error.message);
    }
};
