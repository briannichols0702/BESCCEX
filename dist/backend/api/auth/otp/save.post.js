"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveOrUpdateOTP = exports.metadata = void 0;
const db_1 = require("@b/db");
const error_1 = require("@b/utils/error");
exports.metadata = {
    summary: "Saves the OTP",
    operationId: "saveOTP",
    tags: ["Auth"],
    description: "Saves the OTP secret and type for the user",
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
                            description: "Generated OTP secret",
                        },
                        type: {
                            type: "string",
                            enum: ["EMAIL", "SMS", "APP"],
                            description: "Type of 2FA",
                        },
                    },
                    required: ["secret", "type"],
                },
            },
        },
    },
    responses: {
        200: {
            description: "OTP saved successfully",
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
        throw (0, error_1.createError)({ statusCode: 401, message: "Unauthorized" });
    validateRequestBody(body);
    const otpDetails = await saveOrUpdateOTP(user.id, body.secret, body.type);
    return {
        message: "OTP saved successfully",
        otpDetails,
    };
};
// Validate the request body
function validateRequestBody(body) {
    const { secret, type } = body;
    if (!secret || !type) {
        throw (0, error_1.createError)({
            statusCode: 400,
            message: "Missing required parameters: 'secret' and 'type'",
        });
    }
    const validTypes = ["EMAIL", "SMS", "APP"];
    if (!validTypes.includes(type)) {
        throw (0, error_1.createError)({
            statusCode: 400,
            message: `Invalid type. Must be one of: ${validTypes.join(", ")}`,
        });
    }
}
// Save or update OTP in the database
async function saveOrUpdateOTP(userId, secret, type) {
    const existingTwoFactor = await db_1.models.twoFactor.findOne({
        where: { userId },
    });
    if (existingTwoFactor) {
        // Update existing record
        return await updateTwoFactor(existingTwoFactor.id, secret, type);
    }
    else {
        // Create new record
        return await createTwoFactor(userId, secret, type);
    }
}
exports.saveOrUpdateOTP = saveOrUpdateOTP;
// Update existing 2FA record
async function updateTwoFactor(recordId, secret, type) {
    try {
        const [_, [updatedRecord]] = await db_1.models.twoFactor.update({ secret, type, enabled: true }, { where: { id: recordId }, returning: true });
        return updatedRecord;
    }
    catch (error) {
        throw (0, error_1.createError)({
            statusCode: 500,
            message: `Error updating 2FA record: ${error.message}`,
        });
    }
}
// Create new 2FA record
async function createTwoFactor(userId, secret, type) {
    try {
        return await db_1.models.twoFactor.create({
            userId,
            secret,
            type,
            enabled: true,
        });
    }
    catch (error) {
        throw (0, error_1.createError)({
            statusCode: 500,
            message: `Error creating 2FA record: ${error.message}`,
        });
    }
}
