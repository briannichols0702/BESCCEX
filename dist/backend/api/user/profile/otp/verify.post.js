"use strict";
// /server/api/profile/verifyOTP.post.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.savePhoneQuery = exports.metadata = void 0;
const error_1 = require("@b/utils/error");
const db_1 = require("@b/db");
const otplib_1 = require("otplib");
const query_1 = require("@b/utils/query");
const index_post_1 = require("./index.post");
exports.metadata = {
    summary: "Verifies an OTP with the provided secret and type, and saves it if valid",
    operationId: "verifyOTP",
    description: "Verifies an OTP with the provided secret and type, and saves it if valid",
    tags: ["Profile"],
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
                            description: "OTP secret",
                        },
                        type: {
                            type: "string",
                            description: "Type of OTP",
                            enum: ["SMS", "APP"],
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
                                        description: "Message indicating the status of the OTP verification",
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("User"),
        500: query_1.serverErrorResponse,
    },
};
exports.default = async (data) => {
    var _a;
    if (!((_a = data.user) === null || _a === void 0 ? void 0 : _a.id))
        throw (0, error_1.createError)({ statusCode: 401, message: "Unauthorized" });
    const { otp, secret, type } = data.body;
    const isValid = otplib_1.authenticator.verify({ token: otp, secret });
    if (!isValid) {
        throw (0, error_1.createError)({ statusCode: 401, message: "Invalid OTP" });
    }
    await (0, index_post_1.saveOTPQuery)(data.user.id, secret, type);
    return { message: "OTP verified and saved successfully" };
};
async function savePhoneQuery(userId, phone) {
    await db_1.models.user.update({
        phone: phone,
    }, {
        where: { id: userId },
    });
    const user = await db_1.models.user.findOne({
        where: {
            id: userId,
        },
    });
    if (!user) {
        throw new Error("User not found");
    }
    return user.get({ plain: true });
}
exports.savePhoneQuery = savePhoneQuery;
