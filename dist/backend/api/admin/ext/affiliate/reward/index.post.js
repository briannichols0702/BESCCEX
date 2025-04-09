"use strict";
// /api/mlm/referralRewards/store.post.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("./utils");
const db_1 = require("@b/db");
exports.metadata = {
    summary: "Stores a new MLM Referral Reward",
    operationId: "storeMlmReferralReward",
    tags: ["Admin", "MLM", "Referral Rewards"],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: utils_1.mlmReferralRewardUpdateSchema,
            },
        },
    },
    responses: (0, query_1.storeRecordResponses)(utils_1.mlmReferralRewardStoreSchema, "MLM Referral Reward"),
    requiresAuth: true,
    permission: "Access MLM Referral Reward Management",
};
exports.default = async (data) => {
    const { body } = data;
    const { reward, isClaimed, conditionId, referrerId } = body;
    const referrer = await db_1.models.user.findOne({ where: { id: referrerId } });
    if (!referrer)
        throw new Error("Referrer not found");
    return await (0, query_1.storeRecord)({
        model: "mlmReferralReward",
        data: {
            reward,
            isClaimed,
            conditionId,
            referrerId,
        },
    });
};
