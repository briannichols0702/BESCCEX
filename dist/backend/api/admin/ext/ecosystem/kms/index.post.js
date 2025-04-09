"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const error_1 = require("@b/utils/error");
const encrypt_1 = require("@b/utils/encrypt");
exports.metadata = {
    summary: "Sets a new passphrase for the Hardware Security Module (HSM)",
    description: "This endpoint allows admin users to set or update the passphrase for HSM operations.",
    operationId: "setPassphrase",
    tags: ["Admin", "Ecosystem", "KMS"],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        passphrase: {
                            type: "string",
                            description: "The passphrase to set for the HSM",
                        },
                    },
                    required: ["passphrase"],
                },
            },
        },
    },
    responses: {
        200: {
            description: "Passphrase set successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            message: { type: "string", description: "Success message" },
                        },
                    },
                },
            },
        },
        400: {
            description: "Invalid request or passphrase not provided",
        },
        401: {
            description: "Unauthorized, only admin users can perform this action",
        },
        500: {
            description: "Internal server error or encryption key setting failed",
        },
    },
    permission: "Access Ecosystem Management",
};
exports.default = async (data) => {
    const { body } = data;
    const { passphrase } = body;
    if (!passphrase) {
        throw (0, error_1.createError)({ statusCode: 400, message: "Passphrase is required" });
    }
    const success = await (0, encrypt_1.setEncryptionKey)(passphrase);
    if (success) {
        return { message: "Encryption key set successfully." };
    }
    else {
        throw new Error("Failed to set encryption key");
    }
};
