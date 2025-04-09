"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const error_1 = require("@b/utils/error");
const otplib_1 = require("otplib");
const save_post_1 = require("./save.post");
exports.metadata = {
    summary: "Verifies the OTP",
    operationId: "verifyOTP",
    tags: ["Auth"],
    description: "Verifies the OTP and saves it",
    requiresAuth: true,
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        otp: {
                            type: "string",
                            description: "OTP to verify",
                        },
                        secret: {
                            type: "string",
                            description: "Generated OTP secret",
                        },
                        type: {
                            type: "string",
                            enum: ["EMAIL", "SMS", "APP"],
                            description: "Type of 2FA",
                        },
                    },
                    required: ["otp", "secret", "type"],
                },
            },
        },
    },
    responses: {
        200: {
            description: "OTP verified and saved successfully",
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
        },
        401: {
            description: "Unauthorized",
        },
    },
};
exports.default = async (data) => {
    const { body, user } = data;
    if (!user)
        throw (0, error_1.createError)({ statusCode: 401, message: "unauthorized" });
    const isValid = otplib_1.authenticator.verify({
        token: body.otp,
        secret: body.secret,
    });
    if (!isValid) {
        throw (0, error_1.createError)({
            statusCode: 401,
            message: "Invalid OTP",
        });
    }
    return await (0, save_post_1.saveOrUpdateOTP)(user.id, body.secret, body.type);
};
