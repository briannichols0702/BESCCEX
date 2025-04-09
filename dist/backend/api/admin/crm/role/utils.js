"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleStoreSchema = exports.roleUpdateSchema = exports.baseRoleSchema = exports.getRole = exports.getRoles = exports.cacheRoles = void 0;
const db_1 = require("@b/db");
const redis_1 = require("@b/utils/redis");
const redis = redis_1.RedisSingleton.getInstance();
// Function to cache the roles
async function cacheRoles() {
    try {
        const roles = await getRoles();
        await redis.set("roles", JSON.stringify(roles), "EX", 3600);
    }
    catch (error) { }
}
exports.cacheRoles = cacheRoles;
// Initialize the cache when the file is loaded
cacheRoles();
async function getRoles() {
    const roles = await db_1.models.role.findAll({
        include: [
            {
                model: db_1.models.rolePermission,
                as: "permissions",
                include: [
                    {
                        model: db_1.models.permission, // Correct model name for the association
                        as: "permission",
                    },
                ],
            },
        ],
    });
    // Convert each Sequelize model instance to a plain object
    return roles.map((role) => role.get({ plain: true }));
}
exports.getRoles = getRoles;
async function getRole(id) {
    const role = await db_1.models.role.findOne({
        where: {
            id,
        },
        include: [
            {
                model: db_1.models.rolePermission,
                as: "permissions",
                include: [
                    {
                        model: db_1.models.permission,
                        as: "permission",
                    },
                ],
            },
        ],
    });
    if (!role) {
        return null;
    }
    // Convert the Sequelize model instance to a plain object if the role was found
    return role.get({ plain: true });
}
exports.getRole = getRole;
const schema_1 = require("@b/utils/schema"); // Adjust the import path as necessary
// Define base components for the role schema
const id = (0, schema_1.baseStringSchema)("ID of the role");
const name = (0, schema_1.baseStringSchema)("Name of the role");
const permissions = {
    type: "array",
    items: {
        type: "object",
        properties: {
            value: (0, schema_1.baseStringSchema)("ID of the permission"),
            label: (0, schema_1.baseStringSchema)("Name of the permission"),
        },
    },
};
// Base schema definition for roles
exports.baseRoleSchema = {
    id,
    name,
    permissions,
};
// Schema for updating a role
exports.roleUpdateSchema = {
    type: "object",
    properties: {
        name,
        permissions,
    },
    required: ["name", "permissions"], // Ensure that name and permissions are mandatory for updates
};
// Schema for defining a new role
exports.roleStoreSchema = {
    description: `Role created or updated successfully`,
    content: {
        "application/json": {
            schema: {
                type: "object",
                properties: exports.baseRoleSchema,
            },
        },
    },
};
