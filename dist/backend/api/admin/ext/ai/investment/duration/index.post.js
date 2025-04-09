"use strict";
// /api/admin/ai/investmentDurations/store.post.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("./utils");
exports.metadata = {
    summary: "Stores a new AI Investment Duration",
    operationId: "storeAIInvestmentDuration",
    tags: ["Admin", "AI Investment Durations"],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: utils_1.aiInvestmentDurationUpdateSchema,
            },
        },
    },
    responses: (0, query_1.storeRecordResponses)(utils_1.aiInvestmentDurationStoreSchema, "AI Investment Duration"),
    requiresAuth: true,
    permission: "Access AI Investment Duration Management",
};
exports.default = async (data) => {
    const { body } = data;
    const { duration, timeframe } = body;
    return await (0, query_1.storeRecord)({
        model: "aiInvestmentDuration",
        data: {
            duration,
            timeframe,
        },
    });
};
