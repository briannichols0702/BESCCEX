"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKyc = exports.metadata = void 0;
// /server/api/kyc/index.get.ts
const db_1 = require("@b/db");
const error_1 = require("@b/utils/error");
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Retrieves KYC data for the logged-in user",
    description: "Fetches the Know Your Customer (KYC) data for the currently authenticated user. This endpoint requires user authentication and returns the user’s KYC information, including the status of the KYC verification process.",
    operationId: "getUserKycData",
    tags: ["KYC"],
    responses: {
        200: {
            description: "KYC data retrieved successfully",
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
                                    id: { type: "number", description: "KYC ID" },
                                    userId: {
                                        type: "number",
                                        description: "User ID associated with the KYC record",
                                    },
                                    templateId: {
                                        type: "number",
                                        description: "ID of the KYC template used",
                                    },
                                    data: {
                                        type: "object",
                                        description: "KYC data as a JSON object",
                                        nullable: true,
                                    },
                                    status: {
                                        type: "string",
                                        description: "Current status of the KYC verification",
                                        enum: ["PENDING", "APPROVED", "REJECTED"],
                                    },
                                    level: { type: "number", description: "Verification level" },
                                    notes: {
                                        type: "string",
                                        description: "Administrative notes, if any",
                                        nullable: true,
                                    },
                                    createdAt: {
                                        type: "string",
                                        format: "date-time",
                                        description: "Timestamp when the KYC record was created",
                                    },
                                    updatedAt: {
                                        type: "string",
                                        format: "date-time",
                                        description: "Timestamp when the KYC record was last updated",
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("Kyc"),
        500: query_1.serverErrorResponse,
    },
    requiresAuth: true,
};
exports.default = async (data) => {
    var _a;
    if (!((_a = data.user) === null || _a === void 0 ? void 0 : _a.id))
        throw (0, error_1.createError)({ statusCode: 401, message: "Unauthorized" });
    return getKyc(data.user.id);
};
async function getKyc(userId) {
    const response = await db_1.models.kyc.findOne({
        where: {
            userId: userId,
        },
    });
    if (!response) {
        throw new Error("KYC record not found");
    }
    return response.get({ plain: true });
}
exports.getKyc = getKyc;
