"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPermissions = exports.cachePermissions = void 0;
const db_1 = require("@b/db");
const redis_1 = require("@b/utils/redis");
const redis = redis_1.RedisSingleton.getInstance();
// Function to cache the permissions
async function cachePermissions() {
    try {
        const permissions = await getPermissions();
        await redis.set("permissions", JSON.stringify(permissions), "EX", 3600);
    }
    catch (error) { }
}
exports.cachePermissions = cachePermissions;
// Initialize the cache when the file is loaded
cachePermissions();
async function getPermissions() {
    return (await db_1.models.permission.findAll({
        include: [
            {
                model: db_1.models.rolePermission,
                as: "rolePermissions", // Ensure this matches the alias used in the association definition
            },
        ],
    })).map((permission) => permission.get({ plain: true }));
}
exports.getPermissions = getPermissions;
