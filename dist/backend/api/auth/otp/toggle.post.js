"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const error_1 = require("@b/utils/error");
const db_1 = require("@b/db");
exports.metadata = {
    summary: "Toggles OTP status",
    operationId: "toggleOtp",
    tags: ["Auth"],
    description: "Enables or disables OTP for the user",
    requiresAuth: true,
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        status: {
                            type: "boolean",
                            description: "Status to set for OTP (enabled or disabled)",
                        },
                    },
                    required: ["status"],
                },
            },
        },
    },
    responses: {
        200: {
            description: "OTP status updated successfully",
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
    return await toggleOTPQuery(user.id, body.status);
};
async function toggleOTPQuery(userId, status) {
    return await db_1.models.twoFactor.update({ enabled: status }, { where: { userId }, returning: true });
}
