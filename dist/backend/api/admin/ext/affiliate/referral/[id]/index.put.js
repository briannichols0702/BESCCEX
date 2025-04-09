"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
const db_1 = require("@b/db");
exports.metadata = {
    summary: "Updates a specific MLM Referral",
    operationId: "updateMlmReferral",
    tags: ["Admin", "MLM Referrals"],
    parameters: [
        {
            name: "id",
            in: "path",
            description: "ID of the MLM Referral to update",
            required: true,
            schema: {
                type: "string",
            },
        },
    ],
    requestBody: {
        description: "New data for the MLM Referral",
        content: {
            "application/json": {
                schema: utils_1.mlmReferralUpdateSchema,
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("MLM Referral"),
    requiresAuth: true,
    permission: "Access MLM Referral Management",
};
exports.default = async (data) => {
    const { body, params } = data;
    const { id } = params;
    const { status, referrerId, referredId } = body;
    if (referrerId === referredId)
        throw new Error("Referrer and referred user cannot be the same");
    const referrer = await db_1.models.user.findOne({ where: { id: referrerId } });
    if (!referrer)
        throw new Error("Referrer not found");
    const referred = await db_1.models.user.findOne({ where: { id: referredId } });
    if (!referred)
        throw new Error("Referred user not found");
    return await (0, query_1.updateRecord)("mlmReferral", id, {
        status,
        referrerId,
        referredId,
    });
};
