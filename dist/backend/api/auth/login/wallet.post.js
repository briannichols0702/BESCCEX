"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const error_1 = require("@b/utils/error");
const db_1 = require("@b/db");
const utils_1 = require("../utils");
exports.metadata = {
    summary: "Logs in a user with SIWE",
    description: "Logs in a user using Sign-In With Ethereum (SIWE)",
    operationId: "siweLogin",
    tags: ["Auth"],
    requiresAuth: false,
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        message: {
                            type: "string",
                            description: "SIWE message",
                        },
                        signature: {
                            type: "string",
                            description: "Signature of the SIWE message",
                        },
                    },
                    required: ["message", "signature"],
                },
            },
        },
    },
    responses: {
        200: {
            description: "User logged in successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            message: {
                                type: "string",
                                description: "Success message",
                            },
                            id: {
                                type: "string",
                                description: "User ID",
                            },
                        },
                    },
                },
            },
        },
        400: {
            description: "Invalid request (e.g., invalid message or signature)",
        },
        401: {
            description: "Unauthorized (e.g., signature verification failed)",
        },
    },
};
const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;
exports.default = async (data) => {
    const { body } = data;
    const { message, signature } = body;
    if (!projectId) {
        throw (0, error_1.createError)({
            statusCode: 500,
            message: "Wallet connect project ID is not defined",
        });
    }
    const address = (0, utils_1.getAddressFromMessage)(message);
    const chainId = (0, utils_1.getChainIdFromMessage)(message);
    const isValid = await (0, utils_1.verifySignature)({
        address,
        message,
        signature,
        chainId,
        projectId,
    });
    if (!isValid) {
        throw (0, error_1.createError)({
            statusCode: 401,
            message: "Signature verification failed",
        });
    }
    const provider = await db_1.models.providerUser.findOne({
        where: { providerUserId: address },
        include: [
            {
                model: db_1.models.user,
                as: "user",
                include: [
                    {
                        model: db_1.models.twoFactor,
                        as: "twoFactor",
                    },
                ],
            },
        ],
    });
    if (!provider) {
        throw (0, error_1.createError)({
            statusCode: 401,
            message: "Wallet address not recognized",
        });
    }
    const user = provider.user;
    // Validate user status
    if (!user) {
        throw (0, error_1.createError)({
            statusCode: 404,
            message: "User not found",
        });
    }
    if (user.status === "BANNED") {
        throw (0, error_1.createError)({
            statusCode: 403,
            message: "Your account has been banned. Please contact support.",
        });
    }
    if (user.status === "SUSPENDED") {
        throw (0, error_1.createError)({
            statusCode: 403,
            message: "Your account is suspended. Please contact support.",
        });
    }
    if (user.status === "INACTIVE") {
        throw (0, error_1.createError)({
            statusCode: 403,
            message: "Your account is inactive. Please verify your email or contact support.",
        });
    }
    return await (0, utils_1.returnUserWithTokens)({
        user,
        message: "You have been logged in successfully",
    });
};
