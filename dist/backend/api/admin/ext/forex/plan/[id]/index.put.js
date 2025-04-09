"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
exports.metadata = {
    summary: "Updates a specific Forex Plan",
    operationId: "updateForexPlan",
    tags: ["Admin", "Forex Plans"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            description: "ID of the Forex Plan to update",
            required: true,
            schema: {
                type: "string",
            },
        },
    ],
    requestBody: {
        description: "New data for the Forex Plan",
        content: {
            "application/json": {
                schema: utils_1.forexPlanUpdateSchema,
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("Forex Plan"),
    requiresAuth: true,
    permission: "Access Forex Plan Management",
};
exports.default = async (data) => {
    const { body, params } = data;
    const { id } = params;
    const { name, title, description, image, minProfit, maxProfit, minAmount, maxAmount, invested, profitPercentage, status, defaultProfit, defaultResult, trending, durations, currency, walletType, } = body;
    const relations = durations ? [
        {
            model: "forexPlanDuration",
            method: "addDurations",
            data: durations.map((duration) => duration.value),
            fields: {
                source: "planId",
                target: "durationId",
            },
        },
    ] : [];
    return await (0, query_1.updateRecord)("forexPlan", id, {
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
    }, undefined, relations);
};
