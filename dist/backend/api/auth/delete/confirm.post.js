"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const error_1 = require("@b/utils/error");
const db_1 = require("@b/db");
const token_1 = require("@b/utils/token");
const utils_1 = require("../utils");
const emails_1 = require("@b/utils/emails");
exports.metadata = {
    summary: "Check account deletion code and delete user",
    operationId: "checkAccountDeletionCode",
    tags: ["Account"],
    description: "Checks the deletion code, deletes the user's account if valid, and sends a confirmation email.",
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
                            description: "Email of the user confirming account deletion",
                        },
                        token: {
                            type: "string",
                            description: "Account deletion confirmation token",
                        },
                    },
                    required: ["email", "token"],
                },
            },
        },
    },
    responses: {
        200: {
            description: "User account deleted successfully",
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
            description: "Invalid request or token",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            message: {
                                type: "string",
                                description: "Error message",
                            },
                        },
                    },
                },
            },
        },
    },
};
exports.default = async (data) => {
    const { email, token } = data.body;
    const user = await db_1.models.user.findOne({ where: { email } });
    if (!user) {
        throw (0, error_1.createError)({ message: "User not found", statusCode: 404 });
    }
    const decodedToken = await (0, token_1.verifyResetToken)(token);
    if (!decodedToken) {
        throw (0, error_1.createError)({ message: "Invalid or expired token", statusCode: 400 });
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
            message: "Token has already been used",
        });
    }
    await db_1.models.user.destroy({ where: { id: user.id } });
    try {
        await emails_1.emailQueue.add({
            emailData: {
                TO: user.email,
                FIRSTNAME: user.firstName,
            },
            emailType: "AccountDeletionConfirmed",
        });
        return {
            message: "User account deleted successfully",
        };
    }
    catch (error) {
        throw (0, error_1.createError)({ message: error.message, statusCode: 500 });
    }
};
