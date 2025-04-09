"use strict";
// /server/api/profile/saveOTP.post.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveOTPQuery = exports.metadata = void 0;
const error_1 = require("@b/utils/error");
const db_1 = require("@b/db");
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Saves the OTP configuration for the user",
    operationId: "saveOTP",
    description: "Saves the OTP configuration for the user",
    tags: ["Profile"],
    requiresAuth: true,
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
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
                    required: ["secret", "type"],
                },
            },
        },
    },
    responses: {
        200: {
            description: "OTP configuration saved successfully",
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
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("User"),
        500: query_1.serverErrorResponse,
    },
};
exports.default = async (data) => {
    var _a;
    if (!((_a = data.user) === null || _a === void 0 ? void 0 : _a.id))
        throw (0, error_1.createError)({ statusCode: 401, message: "Unauthorized" });
    const { secret, type } = data.body;
    await saveOTPQuery(data.user.id, secret, type);
    return { message: "OTP configuration saved successfully" };
};
async function saveOTPQuery(userId, secret, type) {
    let otpDetails = {};
    let saveOTPError = null;
    if (!secret || !type)
        throw (0, error_1.createError)({
            statusCode: 400,
            message: "Missing required parameters",
        });
    const existingTwoFactor = await db_1.models.twoFactor.findOne({
        where: { userId: userId },
    });
    if (existingTwoFactor) {
        // If a 2FA record already exists for the user, update it
        await db_1.models.twoFactor
            .update({
            secret,
            type,
            enabled: true,
        }, {
            where: { id: existingTwoFactor.id },
        })
            .then((response) => {
            otpDetails = response;
        })
            .catch((e) => {
            console.error(e);
            saveOTPError = e;
        });
    }
    else {
        // If no 2FA record exists for the user, create one
        await db_1.models.twoFactor
            .create({
            userId: userId,
            secret: secret,
            type: type,
            enabled: true,
        })
            .then((response) => {
            otpDetails = response;
        })
            .catch((e) => {
            console.error(e);
            saveOTPError = e;
        });
    }
    if (saveOTPError)
        throw (0, error_1.createError)({
            statusCode: 500,
            message: "Server error",
        });
    // Create api result
    return otpDetails;
}
exports.saveOTPQuery = saveOTPQuery;
