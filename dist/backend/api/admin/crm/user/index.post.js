"use strict";
// /server/api/admin/users/index.post.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const error_1 = require("@b/utils/error");
const db_1 = require("@b/db");
const passwords_1 = require("@b/utils/passwords");
const utils_1 = require("./utils");
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Creates a new user",
    operationId: "createUser",
    tags: ["Admin", "CRM", "User"],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: utils_1.userUpdateSchema,
            },
        },
    },
    responses: (0, query_1.storeRecordResponses)(utils_1.userStoreSchema, "Page"),
    requiresAuth: true,
    permission: "Access User Management",
};
exports.default = async (data) => {
    const { body, user } = data;
    const { firstName, lastName, email, roleId, avatar, phone, emailVerified, status = "ACTIVE", profile, } = body;
    if (!(user === null || user === void 0 ? void 0 : user.id))
        throw (0, error_1.createError)({ statusCode: 401, message: "Unauthorized access" });
    const existingUser = await db_1.models.user.findOne({
        where: { email },
        include: [{ model: db_1.models.role, as: "role" }],
    });
    if (existingUser)
        throw (0, error_1.createError)({ statusCode: 400, message: "User already exists" });
    const password = await (0, passwords_1.hashPassword)("12345678");
    const superAdminRole = await db_1.models.role.findOne({
        where: { name: "Super Admin" },
    });
    // prevent making super admin
    if (roleId === (superAdminRole === null || superAdminRole === void 0 ? void 0 : superAdminRole.id))
        throw (0, error_1.createError)({
            statusCode: 400,
            message: "You cannot create a Super Admin",
        });
    await db_1.models.user.create({
        firstName,
        lastName,
        email,
        roleId: Number(roleId),
        password,
        avatar,
        phone,
        emailVerified,
        status,
        profile,
    });
    return {
        message: "User created successfully, Password is 12345678",
    };
};
