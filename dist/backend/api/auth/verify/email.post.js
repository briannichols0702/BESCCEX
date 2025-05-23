"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyEmailTokenQuery = exports.metadata = void 0;
const error_1 = require("@b/utils/error");
const db_1 = require("@b/db");
const token_1 = require("@b/utils/token");
const utils_1 = require("../utils");
exports.metadata = {
    summary: "Verifies the email with the provided token",
    operationId: "verifyEmailToken",
    tags: ["Auth"],
    description: "Verifies the email with the provided token",
    requiresAuth: false,
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        token: {
                            type: "string",
                            description: "The email verification token",
                        },
                    },
                    required: ["token"],
                },
            },
        },
    },
    responses: {
        200: {
            description: "Email verified successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            message: {
                                type: "string",
                                description: "Success message",
                            },
                        },
                    },
                },
            },
        },
        400: {
            description: "Invalid request (e.g., missing or invalid token)",
        },
        404: {
            description: "Token not found or expired",
        },
    },
};
exports.default = async (data) => {
    const { body } = data;
    const { token } = body;
    return (0, exports.verifyEmailTokenQuery)(token);
};
const verifyEmailTokenQuery = async (token) => {
    // Use verifyEmailCode to check if the code is valid and get the associated userId
    const userId = await (0, token_1.verifyEmailCode)(token);
    if (!userId) {
        throw (0, error_1.createError)({
            statusCode: 404,
            message: "Token not found or expired",
        });
    }
    // Find the user by userId
    const user = await db_1.models.user.findByPk(userId);
    if (!user) {
        throw (0, error_1.createError)({
            statusCode: 404,
            message: "User not found",
        });
    }
    // Update user's emailVerified status
    await user.update({
        emailVerified: true,
    });
    // Return the user with success message
    return await (0, utils_1.returnUserWithTokens)({
        user,
        message: "Email verified successfully",
    });
};
exports.verifyEmailTokenQuery = verifyEmailTokenQuery;
