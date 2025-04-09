"use strict";
// /api/admin/ai/investments/store.post.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("./utils");
exports.metadata = {
    summary: "Stores a new AI Investment",
    operationId: "storeAIInvestment",
    tags: ["Admin", "AI Investments"],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: utils_1.aiInvestmentUpdateSchema,
            },
        },
    },
    responses: (0, query_1.storeRecordResponses)(utils_1.aiInvestmentStoreSchema, "AI Investment"),
    requiresAuth: true,
    permission: "Access AI Investment Management",
};
exports.default = async (data) => {
    const { body } = data;
    const { userId, planId, durationId, symbol, amount, profit, result, status } = body;
    return await (0, query_1.storeRecord)({
        model: "aiInvestment",
        data: {
            userId,
            planId,
            durationId,
            symbol,
            amount,
            profit,
            result,
            status,
        },
    });
};
