"use strict";
// /server/api/mlm/referral-rewards/index.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const utils_1 = require("@b/api/admin/ext/affiliate/reward/utils");
const db_1 = require("@b/db");
const constants_1 = require("@b/utils/constants");
const error_1 = require("@b/utils/error");
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Lists all MLM Referral Rewards with pagination and optional filtering",
    operationId: "listMlmReferralRewards",
    tags: ["MLM", "Referral Rewards"],
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
};
exports.default = async (data) => {
    const { user, query } = data;
    if (!(user === null || user === void 0 ? void 0 : user.id))
        throw (0, error_1.createError)({ statusCode: 401, message: "Unauthorized" });
    // Call the generic fetch function
    return (0, query_1.getFiltered)({
        model: db_1.models.mlmReferralReward,
        query,
        where: { referrerId: user.id },
        sortField: query.sortField || "createdAt",
        includeModels: [
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
