"use strict";
// /api/admin/investment/durations/store.post.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("./utils");
exports.metadata = {
    summary: "Stores a new Investment Duration",
    operationId: "storeInvestmentDuration",
    tags: ["Admin", "Investment Durations"],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: utils_1.investmentDurationUpdateSchema,
            },
        },
    },
    responses: (0, query_1.storeRecordResponses)(utils_1.investmentDurationStoreSchema, "Investment Duration"),
    requiresAuth: true,
    permission: "Access Investment Duration Management",
};
exports.default = async (data) => {
    const { body } = data;
    const { duration, timeframe } = body;
    return await (0, query_1.storeRecord)({
        model: "investmentDuration",
        data: {
            duration,
            timeframe,
        },
    });
};
