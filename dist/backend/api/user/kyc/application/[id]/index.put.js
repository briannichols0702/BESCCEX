"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateKyc = exports.metadata = void 0;
const db_1 = require("@b/db");
const error_1 = require("@b/utils/error");
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Updates KYC data for a given ID",
    description: "This endpoint allows for the updating of Know Your Customer (KYC) data associated with a specific record. It requires authentication and appropriate permissions to perform the update.",
    operationId: "updateKYCData",
    tags: ["KYC"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            description: "The ID of the KYC record to update",
            required: true,
            schema: { type: "string" },
        },
    ],
    requestBody: {
        description: "Data to update the KYC record with",
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        fields: {
                            type: "object",
                            description: "Detailed data following the KYC template structure",
                        },
                        level: {
                            type: "number",
                            description: "Verification level intended with this KYC submission",
                        },
                    },
                    required: ["fields", "level"],
                },
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("KYC"),
    requiresAuth: true,
};
exports.default = async (data) => {
    const { user, params, body } = data;
    if (!(user === null || user === void 0 ? void 0 : user.id)) {
        throw (0, error_1.createError)({ statusCode: 401, message: "Unauthorized" });
    }
    const { id } = params;
    const { fields, level } = body;
    // Check if the KYC record exists
    const kycRecord = await db_1.models.kyc.findByPk(id);
    if (!kycRecord) {
        throw (0, error_1.createError)({ statusCode: 404, message: "KYC record not found" });
    }
    // Check if the user is authorized to update this KYC record
    if (kycRecord.userId !== user.id) {
        throw (0, error_1.createError)({ statusCode: 403, message: "Forbidden" });
    }
    return updateKyc(id, fields, level);
};
async function updateKyc(id, fields, level) {
    const kycRecord = await db_1.models.kyc.findByPk(id);
    if (!kycRecord) {
        throw new Error("KYC record not found");
    }
    // Merge the existing KYC data with the new fields
    const kycData = JSON.parse(kycRecord.data || "{}");
    const updatedData = {
        ...kycData,
        ...fields,
        level, // Update the level if provided
    };
    await db_1.models.kyc.update({ data: updatedData, level: level }, {
        where: { id },
    });
    const updatedKyc = await db_1.models.kyc.findByPk(id);
    if (!updatedKyc) {
        throw new Error("KYC record not found");
    }
    return updatedKyc.get({ plain: true });
}
exports.updateKyc = updateKyc;
