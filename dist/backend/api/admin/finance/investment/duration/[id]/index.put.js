"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
exports.metadata = {
    summary: "Updates a specific Investment Duration",
    operationId: "updateInvestmentDuration",
    tags: ["Admin", "Investment Durations"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            description: "ID of the Investment Duration to update",
            required: true,
            schema: {
                type: "string",
            },
        },
    ],
    requestBody: {
        description: "New data for the Investment Duration",
        content: {
            "application/json": {
                schema: utils_1.investmentDurationUpdateSchema,
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("Investment Duration"),
    requiresAuth: true,
    permission: "Access Investment Duration Management",
};
exports.default = async (data) => {
    const { body, params } = data;
    const { id } = params;
    const { duration, timeframe } = body;
    return await (0, query_1.updateRecord)("investmentDuration", id, {
        duration,
        timeframe,
    });
};
