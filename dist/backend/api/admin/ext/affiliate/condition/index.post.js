"use strict";
// /api/mlm/referralConditions/store.post.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("./utils");
exports.metadata = {
    summary: "Stores a new MLM Referral Condition",
    operationId: "storeMlmReferralCondition",
    tags: ["Admin", "MLM", "Referral Conditions"],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: utils_1.mlmReferralConditionUpdateSchema,
            },
        },
    },
    responses: (0, query_1.storeRecordResponses)(utils_1.mlmReferralConditionStoreSchema, "MLM Referral Condition"),
    requiresAuth: true,
    permission: "Access MLM Referral Condition Management",
};
exports.default = async (data) => {
    const { body } = data;
    const { name, title, description, type, reward, rewardType, rewardWalletType, rewardCurrency, rewardChain, status, image, } = body;
    return await (0, query_1.storeRecord)({
        model: "mlmReferralCondition",
        data: {
            name,
            title,
            description,
            type,
            reward,
            rewardType,
            rewardWalletType,
            rewardCurrency,
            rewardChain,
            status,
            image,
        },
    });
};
