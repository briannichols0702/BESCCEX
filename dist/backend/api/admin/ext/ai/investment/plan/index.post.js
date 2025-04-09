"use strict";
// /api/admin/ai/investmentPlans/store.post.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("./utils");
exports.metadata = {
    summary: "Stores a new AI Investment Plan",
    operationId: "storeAIInvestmentPlan",
    tags: ["Admin", "AI Investment Plans"],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: utils_1.aiInvestmentPlanUpdateSchema,
            },
        },
    },
    responses: (0, query_1.storeRecordResponses)(utils_1.aiInvestmentPlanStoreSchema, "AI Investment Plan"),
    requiresAuth: true,
    permission: "Access AI Investment Plan Management",
};
exports.default = async (data) => {
    const { body } = data;
    const { name, title, description, image, minProfit, maxProfit, minAmount, maxAmount, invested, profitPercentage, status, defaultProfit, defaultResult, trending, durations, } = body;
    const relations = durations ? [
        {
            model: "aiInvestmentPlanDuration",
            method: "addDurations",
            data: durations.map((duration) => duration.value),
            fields: {
                source: "planId",
                target: "durationId",
            },
        },
    ] : [];
    return await (0, query_1.storeRecord)({
        model: "aiInvestmentPlan",
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
        },
        relations,
    });
};
