"use strict";
// /server/api/admin/users/[id]/update.put.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const error_1 = require("@b/utils/error");
const db_1 = require("@b/db");
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
exports.metadata = {
    summary: "Updates a specific user by UUID",
    operationId: "updateUserByUuid",
    tags: ["Admin", "CRM", "User"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            required: true,
            description: "ID of the user to update",
            schema: { type: "string" },
        },
    ],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: utils_1.userUpdateSchema,
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("User"),
    requiresAuth: true,
    permission: "Access User Management",
};
exports.default = async (data) => {
    const { params, body, user } = data;
    const { id } = params;
    const { firstName, lastName, email, roleId, avatar, phone, emailVerified, twoFactor, status, profile, } = body;
    if (!(user === null || user === void 0 ? void 0 : user.id)) {
        throw (0, error_1.createError)({
            statusCode: 401,
            message: "Unauthorized",
        });
    }
    const userPk = await db_1.models.user.findOne({
        where: { id: user.id },
        include: [{ model: db_1.models.role, as: "role" }],
    });
    const existingUser = await db_1.models.user.findOne({
        where: { id },
        include: [{ model: db_1.models.role, as: "role" }],
    });
    if (!existingUser) {
        throw (0, error_1.createError)({
            statusCode: 404,
            message: "User not found",
        });
    }
    if (existingUser.id === userPk.id && userPk.role.name !== "Super Admin") {
        throw (0, error_1.createError)({
            statusCode: 400,
            message: "You cannot update your own account",
        });
    }
    await db_1.models.user.update({
        firstName,
        lastName,
        email,
        avatar,
        phone,
        emailVerified,
        status,
        profile,
        ...(userPk.role.name === "Super Admin" && { roleId }),
    }, {
        where: { id },
    });
    if (twoFactor) {
        await db_1.models.twoFactor.update({ enabled: false }, { where: { userId: id } });
    }
    return {
        message: "User updated successfully",
    };
};
