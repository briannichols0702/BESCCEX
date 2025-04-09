"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserWith2FA = exports.getUserById = void 0;
const db_1 = require("@b/db");
const error_1 = require("@b/utils/error");
// Helper function to get user by ID
async function getUserById(userId) {
    const user = await db_1.models.user.findByPk(userId);
    if (!user) {
        throw (0, error_1.createError)({ statusCode: 400, message: "User not found" });
    }
    return user;
}
exports.getUserById = getUserById;
async function getUserWith2FA(userId) {
    var _a;
    const user = await db_1.models.user.findOne({
        where: { id: userId },
        include: {
            model: db_1.models.twoFactor,
            as: "twoFactor",
        },
    });
    if (!user || !((_a = user.twoFactor) === null || _a === void 0 ? void 0 : _a.secret)) {
        throw (0, error_1.createError)({
            statusCode: 400,
            message: "User not found or 2FA not enabled",
        });
    }
    return user;
}
exports.getUserWith2FA = getUserWith2FA;
