"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
exports.metadata = {
    summary: "Updates a specific Forex Investment",
    operationId: "updateForexInvestment",
    tags: ["Admin", "Forex Investments"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            description: "ID of the Forex Investment to update",
            required: true,
            schema: {
                type: "string",
            },
        },
    ],
    requestBody: {
        description: "New data for the Forex Investment",
        content: {
            "application/json": {
                schema: utils_1.forexInvestmentUpdateSchema,
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("Forex Investment"),
    requiresAuth: true,
    permission: "Access Forex Investment Management",
};
exports.default = async (data) => {
    const { body, params } = data;
    const { id } = params;
    const { userId, planId, durationId, amount, profit, result, status, endDate, } = body;
    return await (0, query_1.updateRecord)("forexInvestment", id, {
        userId,
        planId,
        durationId,
        amount,
        profit,
        result,
        status,
        endDate,
    });
};
