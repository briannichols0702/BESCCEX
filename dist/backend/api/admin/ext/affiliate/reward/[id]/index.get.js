"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
const db_1 = require("@b/db");
exports.metadata = {
    summary: "Retrieves detailed information of a specific MLM Referral Reward by ID",
    operationId: "getMlmReferralRewardById",
    tags: ["Admin", "MLM", "Referral Rewards"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            required: true,
            description: "ID of the MLM Referral Reward to retrieve",
            schema: { type: "string" },
        },
    ],
    responses: {
        200: {
            description: "MLM Referral Reward details",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: utils_1.baseMlmReferralRewardSchema, // Define this schema in your utils if it's not already defined
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("MLM Referral Reward"),
        500: query_1.serverErrorResponse,
    },
    permission: "Access MLM Referral Reward Management",
    requiresAuth: true,
};
exports.default = async (data) => {
    const { params } = data;
    return await (0, query_1.getRecord)("mlmReferralReward", params.id, [
        {
            model: db_1.models.user,
            as: "referrer",
            attributes: ["firstName", "lastName", "email", "avatar"],
        },
        {
            model: db_1.models.mlmReferralCondition,
            as: "condition",
            attributes: [
                "title",
                "rewardType",
                "rewardWalletType",
                "rewardCurrency",
                "rewardChain",
            ],
        },
    ]);
};
