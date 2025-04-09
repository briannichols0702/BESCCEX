"use strict";
// rolesManager.js
Object.defineProperty(exports, "__esModule", { value: true });
exports.rolesManager = void 0;
const db_1 = require("@b/db");
const sequelize_1 = require("sequelize");
const logger_1 = require("@b/utils/logger");
class RolesManager {
    constructor() {
        this.roles = new Map();
        if (!RolesManager.instance) {
            RolesManager.instance = this;
        }
        return RolesManager.instance;
    }
    async initialize() {
        await this.loadRoles();
    }
    async loadRoles() {
        try {
            // Access Sequelize models from your singleton
            // Perform a query to get roles along with their permissions
            const rolesWithPermissions = (await db_1.models.role.findAll({
                include: {
                    model: db_1.models.permission,
                    as: "permissions",
                    through: { attributes: [] },
                },
            }));
            rolesWithPermissions.forEach((role) => {
                this.roles.set(role.id, {
                    name: role.name,
                    permissions: role.permissions.map((rp) => rp.name),
                });
            });
        }
        catch (error) {
            if (error instanceof sequelize_1.DatabaseError) {
                (0, logger_1.logError)("rolesManager", error, __filename);
                console.error("Failed to load roles and permissions. Table not found:", error.message);
            }
            else {
                (0, logger_1.logError)("rolesManager", error, __filename);
                console.error("Failed to load roles and permissions:", error);
            }
        }
    }
}
exports.rolesManager = new RolesManager();
