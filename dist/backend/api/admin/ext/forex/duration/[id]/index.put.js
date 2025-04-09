"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
exports.metadata = {
    summary: "Updates a specific Forex Duration",
    operationId: "updateForexDuration",
    tags: ["Admin", "Forex Durations"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            description: "ID of the Forex Duration to update",
            required: true,
            schema: {
                type: "string",
            },
        },
    ],
    requestBody: {
        description: "New data for the Forex Duration",
        content: {
            "application/json": {
                schema: utils_1.forexDurationUpdateSchema,
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("Forex Duration"),
    requiresAuth: true,
    permission: "Access Forex Duration Management",
};
exports.default = async (data) => {
    const { body, params } = data;
    const { id } = params;
    const { duration, timeframe } = body;
    return await (0, query_1.updateRecord)("forexDuration", id, {
        duration,
        timeframe,
    });
};
