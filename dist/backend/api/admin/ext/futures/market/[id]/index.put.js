"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
exports.metadata = {
    summary: "Updates a specific futures market",
    operationId: "updateFuturesMarket",
    tags: ["Admin", "Futures", "Markets"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            description: "ID of the futures market to update",
            required: true,
            schema: {
                type: "string",
            },
        },
    ],
    requestBody: {
        description: "New data for the futures market",
        content: {
            "application/json": {
                schema: utils_1.FuturesMarketUpdateSchema,
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("Futures Market"),
    requiresAuth: true,
    permission: "Access Futures Market Management",
};
exports.default = async (data) => {
    const { body, params } = data;
    const { id } = params;
    const { metadata } = body;
    return await (0, query_1.updateRecord)("futuresMarket", id, {
        metadata,
    });
};
