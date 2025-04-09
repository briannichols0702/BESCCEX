"use strict";
// /server/api/mlm/referral-conditions/index.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const query_1 = require("@b/utils/query");
const cache_1 = require("@b/utils/cache");
exports.metadata = {
    summary: "Lists all MLM Referral Conditions with pagination and optional filtering",
    operationId: "listMlmReferralConditions",
    tags: ["MLM", "Referral Conditions"],
    responses: {
        200: {
            description: "List of MLM Referral Conditions with pagination information",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            data: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        id: { type: "number" },
                                        title: { type: "string" },
                                        description: { type: "string" },
                                        reward: { type: "number" },
                                        reward_type: { type: "string" },
                                        reward_currency: { type: "string" },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("MLM Referral Conditions"),
        500: query_1.serverErrorResponse,
    },
};
exports.default = async (data) => {
    const conditions = await db_1.models.mlmReferralCondition.findAll({
        where: { status: true },
    });
    // Create a map of condition names and their presence in extensions
    const conditionExtensionMap = new Map();
    const cacheManager = cache_1.CacheManager.getInstance();
    const extensions = await cacheManager.getExtensions();
    conditions.forEach((condition) => {
        const conditionMapping = {
            STAKING_LOYALTY: "staking",
            P2P_TRADE: "p2p",
            AI_INVESTMENT: "ai_investment",
            ICO_CONTRIBUTION: "ico",
            FOREX_INVESTMENT: "forex",
            ECOMMERCE_PURCHASE: "ecommerce",
        };
        if (conditionMapping[condition.name]) {
            conditionExtensionMap.set(condition.name, extensions.has(conditionMapping[condition.name]));
        }
        else {
            conditionExtensionMap.set(condition.name, true);
        }
    });
    const filteredConditions = conditions.filter((condition) => {
        return conditionExtensionMap.get(condition.name);
    });
    return filteredConditions;
};
