"use strict";
// /server/api/mlm/referral-rewards/index.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const constants_1 = require("@b/utils/constants");
const query_1 = require("@b/utils/query");
const utils_1 = require("./utils");
exports.metadata = {
    summary: "Lists all MLM Referral Rewards with pagination and optional filtering",
    operationId: "listMlmReferralRewards",
    tags: ["Admin", "MLM", "Referral Rewards"],
    parameters: constants_1.crudParameters,
    responses: {
        200: {
            description: "List of MLM Referral Rewards with pagination information",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            data: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: utils_1.mlmReferralRewardSchema,
                                },
                            },
                            pagination: constants_1.paginationSchema,
                        },
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("MLM Referral Rewards"),
        500: query_1.serverErrorResponse,
    },
    requiresAuth: true,
    permission: "Access MLM Referral Reward Management",
};
exports.default = async (data) => {
    const { query } = data;
    // Call the generic fetch function
    return (0, query_1.getFiltered)({
        model: db_1.models.mlmReferralReward,
        query,
        sortField: query.sortField || "createdAt",
        includeModels: [
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
        ],
    });
};
