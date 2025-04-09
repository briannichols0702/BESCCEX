"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const utils_1 = require("./utils");
const db_1 = require("@b/db");
const query_1 = require("@b/utils/query");
const error_1 = require("@b/utils/error");
exports.metadata = {
    summary: "Stores or updates a role",
    operationId: "storeRole",
    tags: ["Admin", "CRM", "Role"],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: utils_1.baseRoleSchema,
                    required: ["name", "permissions"],
                },
            },
        },
    },
    responses: (0, query_1.storeRecordResponses)(utils_1.roleStoreSchema, "Role"),
    requiresAuth: true,
    permission: "Access Role Management",
};
exports.default = async (data) => {
    const { body, user } = data;
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
            message: "Forbidden - Only Super Admins can create new roles",
        });
    }
    try {
        // Create a new role
        const role = await db_1.models.role.create({ name });
        // Set permissions for the role
        const permissionIds = permissions.map((permission) => permission.id);
        await role.setPermissions(permissionIds);
        // Refetch the created role with its permissions
        const newRole = await db_1.models.role.findByPk(role.id, {
            include: [{ model: db_1.models.permission, as: "permissions" }],
        });
        // Update the cache for roles
        await (0, utils_1.cacheRoles)();
        return { message: "Role created successfully", role: newRole };
    }
    catch (error) {
        throw new Error(error.message);
    }
};
