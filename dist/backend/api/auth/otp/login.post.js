"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const error_1 = require("@b/utils/error");
const otplib_1 = require("otplib");
const utils_1 = require("../utils");
const utils_2 = require("./utils");
exports.metadata = {
    summary: "Verifies the OTP for login",
    operationId: "verifyLoginOTP",
    tags: ["Auth"],
    description: "Verifies the OTP for login and returns a session token",
    requiresAuth: false,
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string",
                            format: "uuid",
                            description: "ID of the user",
                        },
                        otp: {
                            type: "string",
                            description: "OTP to verify",
                        },
                    },
                    required: ["id", "otp"],
                },
            },
        },
    },
    responses: {
        200: {
            description: "OTP verified successfully, user logged in",
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
            description: "Invalid request (e.g., missing parameters, invalid OTP)",
        },
        401: {
            description: "Unauthorized (incorrect or expired OTP)",
        },
    },
};
exports.default = async (data) => {
    const { body } = data;
    const { id, otp } = body;
    validateRequestBody(id, otp);
    const user = await (0, utils_2.getUserWith2FA)(id);
    const isValid = verifyOtp(user.twoFactor.secret, otp);
    if (!isValid) {
        throw (0, error_1.createError)({
            statusCode: 401,
            message: "Invalid OTP",
        });
    }
    return await (0, utils_1.returnUserWithTokens)({
        user,
        message: "You have been logged in successfully",
    });
};
// Validate request body
function validateRequestBody(id, otp) {
    if (!id || !otp) {
        throw (0, error_1.createError)({
            statusCode: 400,
            message: "Missing required parameters: 'id' and 'otp'",
        });
    }
}
// Verify the OTP
function verifyOtp(secret, token) {
    return otplib_1.authenticator.verify({
        token,
        secret,
    });
}
