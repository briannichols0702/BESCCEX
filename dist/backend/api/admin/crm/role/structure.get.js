"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleStructure = exports.metadata = void 0;
// /api/admin/roles/structure.get.ts
const db_1 = require("@b/db");
const constants_1 = require("@b/utils/constants");
exports.metadata = {
    summary: "Get form structure for roles",
    operationId: "getRolesStructure",
    tags: ["Admin", "CRM", "Role"],
    responses: {
        200: {
            description: "Form structure for roles",
            content: constants_1.structureSchema,
        },
    },
    permission: "Access Role Management",
};
const roleStructure = async () => {
    const name = { type: "input", label: "Name", name: "name" };
    const permissions = await db_1.models.permission.findAll();
    const permissionIds = {
        type: "tags",
        label: "Permissions",
        name: "permissions",
        key: "name",
        options: permissions.map((permission) => ({
            id: permission.id,
            name: permission.name,
        })),
    };
    return {
        name,
        permissionIds,
    };
};
exports.roleStructure = roleStructure;
exports.default = async () => {
    const { name, permissionIds } = await (0, exports.roleStructure)();
    return {
        get: {
            name,
            permissions: {
                type: "tags",
                label: "Permissions",
                name: "permissions",
                key: "name",
            },
        },
        set: [name, permissionIds],
    };
};
