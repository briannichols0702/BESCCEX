"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
exports.metadata = {
    summary: "Updates a specific MLM Referral Reward",
    operationId: "updateMlmReferralReward",
    tags: ["Admin", "MLM Referral Rewards"],
    parameters: [
        {
            name: "id",
            in: "path",
            description: "ID of the MLM Referral Reward to update",
            required: true,
            schema: {
                type: "string",
            },
        },
    ],
    requestBody: {
        description: "New data for the MLM Referral Reward",
        content: {
            "application/json": {
                schema: utils_1.mlmReferralRewardUpdateSchema,
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("MLM Referral Reward"),
    requiresAuth: true,
    permission: "Access MLM Referral Reward Management",
};
exports.default = async (data) => {
    const { body, params } = data;
    const { id } = params;
    const updatedFields = {
        reward: body.reward,
        isClaimed: body.isClaimed,
    };
    return await (0, query_1.updateRecord)("mlmReferralReward", id, updatedFields);
};
