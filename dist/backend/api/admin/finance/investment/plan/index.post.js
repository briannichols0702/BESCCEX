"use strict";
// /api/admin/investment/plans/store.post.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("./utils");
exports.metadata = {
    summary: "Stores a new Investment Plan",
    operationId: "storeInvestmentPlan",
    tags: ["Admin", "Investment Plans"],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: utils_1.investmentPlanUpdateSchema,
            },
        },
    },
    responses: (0, query_1.storeRecordResponses)(utils_1.investmentPlanStoreSchema, "Investment Plan"),
    requiresAuth: true,
    permission: "Access Investment Plan Management",
};
exports.default = async (data) => {
    const { body } = data;
    const { name, title, description, image, minProfit, maxProfit, minAmount, maxAmount, invested, profitPercentage, status, defaultProfit, defaultResult, trending, durations, currency, walletType, } = body;
    const relations = durations
        ? [
            {
                model: "investmentPlanDuration",
                method: "addDurations",
                data: durations.map((duration) => duration.value),
                fields: {
                    source: "planId",
                    target: "durationId",
                },
            },
        ]
        : [];
    return await (0, query_1.storeRecord)({
        model: "investmentPlan",
        data: {
            name,
            title,
            description,
            image,
            minProfit,
            maxProfit,
            minAmount,
            maxAmount,
            invested,
            profitPercentage,
            status,
            defaultProfit,
            defaultResult,
            trending,
            currency,
            walletType,
        },
        relations,
    });
};
