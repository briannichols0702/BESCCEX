"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
exports.metadata = {
    summary: "Updates a specific AI Investment Plan",
    operationId: "updateAiInvestmentPlan",
    tags: ["Admin", "AI Investment Plans"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            description: "ID of the AI Investment Plan to update",
            required: true,
            schema: {
                type: "string",
            },
        },
    ],
    requestBody: {
        description: "New data for the AI Investment Plan",
        content: {
            "application/json": {
                schema: utils_1.aiInvestmentPlanUpdateSchema,
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("AI Investment Plan"),
    requiresAuth: true,
    permission: "Access AI Investment Plan Management",
};
exports.default = async (data) => {
    const { body, params } = data;
    const { id } = params;
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
    return await (0, query_1.updateRecord)("aiInvestmentPlan", id, {
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
    }, undefined, relations);
};
