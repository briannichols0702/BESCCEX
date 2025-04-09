"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const token_1 = require("@b/utils/token");
const db_1 = require("@b/db");
const error_1 = require("@b/utils/error");
const emails_1 = require("@b/utils/emails");
exports.metadata = {
    summary: "Generate account deletion confirmation code",
    operationId: "generateAccountDeletionCode",
    tags: ["Account"],
    description: "Generates a code for confirming account deletion and sends it to the user's email.",
    requiresAuth: true,
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
                            description: "Email of the user requesting account deletion",
                        },
                    },
                    required: ["email"],
                },
            },
        },
    },
    responses: {
        200: {
            description: "Deletion confirmation code generated successfully",
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
            description: "Invalid request",
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
    const { email } = data.body;
    const user = await db_1.models.user.findOne({ where: { email } });
    if (!user) {
        throw (0, error_1.createError)({ message: "User not found", statusCode: 404 });
    }
    const token = await (0, token_1.generateEmailToken)({ user: { id: user.id } });
    try {
        await emails_1.emailQueue.add({
            emailData: {
                TO: user.email,
                FIRSTNAME: user.firstName,
                TOKEN: token,
            },
            emailType: "AccountDeletionConfirmation",
        });
        return {
            message: "Deletion confirmation code sent successfully",
        };
    }
    catch (error) {
        throw (0, error_1.createError)({ message: error.message, statusCode: 500 });
    }
};
