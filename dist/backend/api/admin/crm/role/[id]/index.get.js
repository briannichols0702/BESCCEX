"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const utils_1 = require("../utils");
exports.metadata = {
    summary: "Retrieves a specific role by ID",
    operationId: "getRole",
    tags: ["Admin", "CRM", "Role"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            description: "ID of the role to retrieve",
            required: true,
            schema: {
                type: "number",
            },
        },
    ],
    permission: "Access Role Management",
    responses: {
        200: {
            description: "Role retrieved successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: utils_1.baseRoleSchema,
                    },
                },
            },
        },
        404: {
            description: "Role not found",
        },
        500: {
            description: "Internal server error",
        },
    },
    requiresAuth: true,
};
exports.default = async (data) => {
    const role = await db_1.models.role.findOne({
        where: {
            id: data.params.id,
        },
        include: [
            {
                model: db_1.models.permission,
                as: "permissions",
                through: { attributes: [] },
                attributes: ["id", "name"],
            },
        ],
    });
    // Check if a role was found
    if (!role) {
        throw new Error("Role not found");
    }
    // Convert the Sequelize model instance to a plain object
    return role.get({ plain: true });
};
