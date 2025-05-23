"use strict";
// /server/api/auth/profile.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserById = exports.metadata = void 0;
const db_1 = require("@b/db");
const query_1 = require("@b/utils/query");
const error_1 = require("@b/utils/error");
exports.metadata = {
    summary: "Retrieves the profile of the current user",
    description: "Fetches the profile of the currently authenticated user",
    operationId: "getProfile",
    tags: ["Auth"],
    requiresAuth: true,
    responses: {
        200: {
            description: "User profile retrieved successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            id: { type: "string", description: "ID of the user" },
                            email: { type: "string", description: "Email of the user" },
                            firstName: {
                                type: "string",
                                description: "First name of the user",
                            },
                            lastName: {
                                type: "string",
                                description: "Last name of the user",
                            },
                            role: { type: "string", description: "Role of the user" },
                            createdAt: {
                                type: "string",
                                format: "date-time",
                                description: "Date and time when the user was created",
                            },
                            updatedAt: {
                                type: "string",
                                format: "date-time",
                                description: "Date and time when the user was last updated",
                            },
                        },
                        required: [
                            "id",
                            "email",
                            "firstName",
                            "lastName",
                            "role",
                            "createdAt",
                            "updatedAt",
                        ],
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("User"),
        500: query_1.serverErrorResponse,
    },
};
exports.default = (data) => {
    const { user } = data;
    if (!(user === null || user === void 0 ? void 0 : user.id)) {
        throw (0, error_1.createError)({
            statusCode: 401,
            message: "Authentication required, Please log in.",
        });
    }
    return (0, exports.getUserById)(user.id);
};
// Get user by ID
const getUserById = async (id) => {
    const user = await db_1.models.user.findOne({
        where: { id },
        include: [
            {
                model: db_1.models.role,
                as: "role",
                attributes: ["id", "name"],
                include: [
                    {
                        model: db_1.models.permission,
                        as: "permissions",
                        through: { attributes: [] },
                        attributes: ["id", "name"],
                    },
                ],
            },
            {
                model: db_1.models.twoFactor,
                as: "twoFactor",
                attributes: ["type", "enabled"],
            },
            {
                model: db_1.models.kyc,
                as: "kyc",
                attributes: ["status", "level"],
            },
            {
                model: db_1.models.author,
                as: "author",
                attributes: ["id", "status"],
            },
            {
                model: db_1.models.providerUser,
                as: "providerUsers",
                attributes: ["provider"],
            },
        ],
        attributes: { exclude: ["password"] },
    });
    if (!user) {
        throw new Error("User not found");
    }
    return user.get({ plain: true });
};
exports.getUserById = getUserById;
