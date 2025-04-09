"use strict";
// /api/admin/investment/investments/store.post.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("./utils");
exports.metadata = {
    summary: "Stores a new Investment",
    operationId: "storeInvestment",
    tags: ["Admin", "Investments"],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: utils_1.investmentUpdateSchema,
            },
        },
    },
    responses: (0, query_1.storeRecordResponses)(utils_1.investmentStoreSchema, "Investment"),
    requiresAuth: true,
    permission: "Access Investment Management",
};
exports.default = async (data) => {
    const { body } = data;
    const { userId, planId, durationId, amount, profit, result, status, endDate, } = body;
    return await (0, query_1.storeRecord)({
        model: "investment",
        data: {
            userId,
            planId,
            durationId,
            amount,
            profit,
            result,
            status,
            endDate,
        },
    });
};
