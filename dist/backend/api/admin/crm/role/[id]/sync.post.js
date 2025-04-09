"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncPermissions = exports.metadata = void 0;
const db_1 = require("@b/db");
const utils_1 = require("../utils");
exports.metadata = {
    summary: "Syncs roles with the database",
    operationId: "syncRoles",
    tags: ["Admin", "CRM", "Role"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            description: "ID of the role to update",
            required: true,
            schema: {
                type: "number",
            },
        },
    ],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        id: {
                            type: "number",
                            description: "ID of the role to sync",
                        },
                        permissionIds: {
                            type: "array",
                            items: {
                                type: "number",
                            },
                            description: "Array of permission IDs to sync with the role",
                        },
                    },
                },
            },
        },
    },
    permission: "Access Role Management",
    responses: {
        200: {
            description: "Role permissions synced successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            id: {
                                type: "number",
                                description: "ID of the role",
                            },
                            name: {
                                type: "string",
                                description: "Name of the role",
                            },
                            rolePermission: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        id: {
                                            type: "number",
                                            description: "ID of the role permission",
                                        },
                                        roleId: {
                                            type: "number",
                                            description: "ID of the role",
                                        },
                                        permissionId: {
                                            type: "number",
                                            description: "ID of the permission",
                                        },
                                        permission: {
                                            type: "object",
                                            properties: {
                                                id: {
                                                    type: "number",
                                                    description: "ID of the permission",
                                                },
                                                name: {
                                                    type: "string",
                                                    description: "Name of the permission",
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        401: {
            description: "Unauthorized, admin permission required",
        },
        500: {
            description: "Internal server error",
        },
    },
    requiresAuth: true,
};
exports.default = async (data) => {
    const response = await syncPermissions(data.params.id, data.body.permissionIds);
    await (0, utils_1.cacheRoles)(); // Assuming this function is implemented correctly elsewhere
    return {
        ...response.get({ plain: true }),
        message: "Role permissions synced successfully",
    };
};
async function syncPermissions(roleId, permissionIds) {
    return db_1.sequelize
        .transaction(async (transaction) => {
        const role = await db_1.models.role.findByPk(roleId, { transaction });
        if (!role) {
            throw new Error("Role not found");
        }
        // Retrieve current permissions associated with the role
        const currentPermissions = await role.getRolepermissions({ transaction });
        // Calculate which permissions to add and which to remove
        const currentPermissionIds = currentPermissions.map((rp) => rp.id);
        const toAdd = permissionIds.filter((id) => !currentPermissionIds.includes(id));
        const toRemove = currentPermissions.filter((rp) => !permissionIds.includes(rp.id));
        // Add new permissions
        for (const permId of toAdd) {
            // Assuming you have a method or way to get or create a permission instance by its ID
            // This part might need adjustment based on how your permissions are structured
            await role.addRolepermission(permId, { transaction });
        }
        // Remove obsolete permissions
        for (const rp of toRemove) {
            await role.removeRolepermission(rp, { transaction });
        }
        // Optional: Fetch and return the updated role, including its current permissions
        // This step is not strictly necessary for the sync operation itself
        const updatedRole = await db_1.models.role.findByPk(roleId, {
            include: {
                model: db_1.models.rolePermission,
                as: "rolePermissions",
                include: [
                    {
                        model: db_1.models.permission,
                        as: "permission",
                    },
                ],
            },
            transaction,
        });
        return updatedRole ? updatedRole.get({ plain: true }) : null;
    })
        .catch((error) => {
        console.error("Transaction failed:", error);
        throw new Error("Failed to sync role permissions");
    });
}
exports.syncPermissions = syncPermissions;
