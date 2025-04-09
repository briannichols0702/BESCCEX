"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const error_1 = require("@b/utils/error");
const token_1 = require("@b/utils/token");
const db_1 = require("@b/db");
const passwords_1 = require("@b/utils/passwords");
const utils_1 = require("../utils");
exports.metadata = {
    summary: "Verifies a password reset token and sets the new password",
    operationId: "verifyPasswordReset",
    tags: ["Auth"],
    description: "Verifies a password reset token and sets the new password",
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
                            description: "The password reset token",
                        },
                        newPassword: {
                            type: "string",
                            description: "The new password",
                        },
                    },
                    required: ["token", "newPassword"],
                },
            },
        },
    },
    responses: {
        200: {
            description: "Password reset successfully, new password set",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            message: {
                                type: "string",
                                description: "Success message",
                            },
                            cookies: {
                                type: "object",
                                properties: {
                                    accessToken: {
                                        type: "string",
                                        description: "The new access token",
                                    },
                                    refreshToken: {
                                        type: "string",
                                        description: "The new refresh token",
                                    },
                                    sessionId: {
                                        type: "string",
                                        description: "The new session ID",
                                    },
                                    csrfToken: {
                                        type: "string",
                                        description: "The new CSRF token",
                                    },
                                },
                                required: ["accessToken", "refreshToken", "csrfToken"],
                            },
                        },
                    },
                },
            },
        },
        400: {
            description: "Invalid request (e.g., missing token or newPassword)",
        },
        401: {
            description: "Unauthorized or invalid token",
        },
    },
};
exports.default = async (data) => {
    const { body } = data;
    const { token, newPassword } = body;
    const decodedToken = await (0, token_1.verifyResetToken)(token);
    if (!decodedToken) {
        throw new Error("Invalid token");
    }
    try {
        if (decodedToken.jti !== (await (0, utils_1.addOneTimeToken)(decodedToken.jti, new Date()))) {
            throw (0, error_1.createError)({
                statusCode: 500,
                message: "Token has already been used",
            });
        }
    }
    catch (error) {
        throw (0, error_1.createError)({
            statusCode: 500,
            message: error.message,
        });
    }
    const errorOrHashedPassword = await (0, passwords_1.hashPassword)(newPassword);
    const hashedPassword = errorOrHashedPassword;
    const user = await db_1.models.user.findByPk(decodedToken.sub.user.id);
    if (!user) {
        throw (0, error_1.createError)({
            statusCode: 404,
            message: "User not found",
        });
    }
    await user.update({ password: hashedPassword });
    return await (0, utils_1.returnUserWithTokens)({
        user,
        message: "Password reset successfully",
    });
};
