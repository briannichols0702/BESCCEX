"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
exports.metadata = {
    summary: "Updates a specific AI Investment Duration",
    operationId: "updateAiInvestmentDuration",
    tags: ["Admin", "AI Investment Durations"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            description: "ID of the AI Investment Duration to update",
            required: true,
            schema: {
                type: "string",
            },
        },
    ],
    requestBody: {
        description: "New data for the AI Investment Duration",
        content: {
            "application/json": {
                schema: utils_1.aiInvestmentDurationUpdateSchema,
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("AI Investment Duration"),
    requiresAuth: true,
    permission: "Access AI Investment Duration Management",
};
exports.default = async (data) => {
    const { body, params } = data;
    const { id } = params;
    const { duration, timeframe } = body;
    return await (0, query_1.updateRecord)("aiInvestmentDuration", id, {
        duration,
        timeframe,
    });
};
