"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
exports.metadata = {
    summary: "Updates a specific MLM Referral Condition",
    operationId: "updateMlmReferralCondition",
    tags: ["Admin", "MLM Referral Conditions"],
    parameters: [
        {
            name: "id",
            in: "path",
            description: "ID of the MLM Referral Condition to update",
            required: true,
            schema: {
                type: "string",
            },
        },
    ],
    requestBody: {
        description: "New data for the MLM Referral Condition",
        content: {
            "application/json": {
                schema: utils_1.mlmReferralConditionUpdateSchema,
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("MLM Referral Condition"),
    requiresAuth: true,
    permission: "Access MLM Referral Condition Management",
};
exports.default = async (data) => {
    const { body, params } = data;
    const { id } = params;
    const updatedFields = {
        status: body.status,
        type: body.type,
        reward: body.reward,
        rewardType: body.rewardType,
        rewardWalletType: body.rewardWalletType,
        rewardCurrency: body.rewardCurrency,
        rewardChain: body.rewardChain,
        image: body.image,
    };
    return await (0, query_1.updateRecord)("mlmReferralCondition", id, updatedFields);
};
