"use strict";
// /server/api/auth/reset.post.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const token_1 = require("@b/utils/token");
const db_1 = require("@b/db");
const error_1 = require("@b/utils/error");
const emails_1 = require("@b/utils/emails");
exports.metadata = {
    summary: "Initiates a password reset process for a user",
    operationId: "resetPassword",
    tags: ["Auth"],
    description: "Initiates a password reset process for a user and sends an email with a reset link",
    requiresAuth: false,
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        email: {
                            type: "string",
                            format: "email",
                            description: "Email of the user",
                        },
                    },
                    required: ["email"],
                },
            },
        },
    },
    responses: {
        200: {
            description: "Password reset process initiated successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            status: {
                                type: "boolean",
                                description: "Indicates if the request was successful",
                            },
                            statusCode: {
                                type: "number",
                                description: "HTTP status code",
                                example: 200,
                            },
                            data: {
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
            },
        },
        400: {
            description: "Invalid request (e.g., missing email)",
        },
        404: {
            description: "User not found with the provided email",
        },
    },
};
exports.default = (data) => {
    const { body } = data;
    const { email } = body;
    return resetPasswordQuery(email);
};
const resetPasswordQuery = async (email) => {
    const user = await db_1.models.user.findOne({ where: { email } });
    if (!user) {
        throw new Error("User not found");
    }
    const resetToken = await (0, token_1.generateResetToken)({
        user: {
            id: user.id,
        },
    });
    try {
        await emails_1.emailQueue.add({
            emailData: {
                TO: user.email,
                FIRSTNAME: user.firstName,
                LAST_LOGIN: user.lastLogin,
                TOKEN: resetToken,
            },
            emailType: "PasswordReset",
        });
        return {
            message: "Email with reset instructions sent successfully",
        };
    }
    catch (error) {
        throw (0, error_1.createError)({
            message: error.message,
            statusCode: 500,
        });
    }
};
