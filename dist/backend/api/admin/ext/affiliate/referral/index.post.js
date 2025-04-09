"use strict";
// /api/mlm/referrals/store.post.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("./utils");
const db_1 = require("@b/db");
exports.metadata = {
    summary: "Stores a new MLM Referral",
    operationId: "storeMlmReferral",
    tags: ["Admin", "MLM", "Referrals"],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: utils_1.mlmReferralUpdateSchema,
            },
        },
    },
    responses: (0, query_1.storeRecordResponses)(utils_1.mlmReferralStoreSchema, "MLM Referral"),
    requiresAuth: true,
    permission: "Access MLM Referral Management",
};
exports.default = async (data) => {
    const { body } = data;
    const { status, referrerId, referredId } = body;
    if (referrerId === referredId)
        throw new Error("Referrer and referred user cannot be the same");
    const referrer = await db_1.models.user.findOne({ where: { id: referrerId } });
    if (!referrer)
        throw new Error("Referrer not found");
    const referred = await db_1.models.user.findOne({ where: { id: referredId } });
    if (!referred)
        throw new Error("Referred user not found");
    return await (0, query_1.storeRecord)({
        model: "mlmReferral",
        data: {
            status,
            referrerId,
            referredId,
        },
    });
};
