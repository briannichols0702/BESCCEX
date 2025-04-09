"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
exports.metadata = {
    summary: "Updates a specific Investment",
    operationId: "updateInvestment",
    tags: ["Admin", "Investments"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            description: "ID of the Investment to update",
            required: true,
            schema: {
                type: "string",
            },
        },
    ],
    requestBody: {
        description: "New data for the Investment",
        content: {
            "application/json": {
                schema: utils_1.investmentUpdateSchema,
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("Investment"),
    requiresAuth: true,
    permission: "Access Investment Management",
};
exports.default = async (data) => {
    const { body, params } = data;
    const { id } = params;
    const { userId, planId, durationId, amount, profit, result, status, endDate, } = body;
    return await (0, query_1.updateRecord)("investment", id, {
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
