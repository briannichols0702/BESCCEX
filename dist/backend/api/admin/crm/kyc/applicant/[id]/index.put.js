"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
// /api/admin/kyc/[id]/update.put.ts
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
const db_1 = require("@b/db");
const error_1 = require("@b/utils/error");
const emails_1 = require("@b/utils/emails");
exports.metadata = {
    summary: "Updates an existing KYC application",
    operationId: "updateKycApplication",
    tags: ["Admin", "CRM", "KYC"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            description: "ID of the KYC application to update",
            required: true,
            schema: {
                type: "string",
            },
        },
    ],
    requestBody: {
        required: true,
        description: "Updated data for the KYC application",
        content: {
            "application/json": {
                schema: utils_1.kycUpdateSchema,
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("KYC Application"),
    requiresAuth: true,
    permission: "Access KYC Application Management",
};
exports.default = async (req) => {
    const { body, params } = req;
    const { id } = params;
    const { status, level, notes } = body;
    const kycApplication = await db_1.models.kyc.findByPk(id, {
        include: [
            {
                model: db_1.models.user,
                as: "user",
            },
        ],
    });
    if (!kycApplication)
        throw (0, error_1.createError)(404, "KYC application not found");
    if (status)
        kycApplication.status = status;
    if (level)
        kycApplication.level = level;
    if (notes)
        kycApplication.notes = notes;
    await kycApplication.save();
    let emailType;
    switch (status) {
        case "APPROVED":
            emailType = "KycApproved";
            break;
        case "REJECTED":
            emailType = "KycRejected";
            break;
        default:
            throw new Error(`Unknown status: ${status}`);
    }
    try {
        await (0, emails_1.sendKycEmail)(kycApplication.user, kycApplication, emailType);
    }
    catch (error) {
        console.error(error);
    }
    return {
        message: "KYC application updated successfully",
    };
};
