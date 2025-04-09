"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("@b/api/admin/finance/exchange/market/utils");
exports.metadata = {
    summary: "Updates a specific market",
    operationId: "updateEcosystemMarket",
    tags: ["Admin", "Ecosystem", "Markets"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            description: "ID of the market to update",
            required: true,
            schema: {
                type: "string",
            },
        },
    ],
    requestBody: {
        description: "New data for the market",
        content: {
            "application/json": {
                schema: utils_1.MarketUpdateSchema,
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("Market"),
    requiresAuth: true,
    permission: "Access Ecosystem Market Management",
};
exports.default = async (data) => {
    const { body, params } = data;
    const { id } = params;
    const { metadata } = body;
    return await (0, query_1.updateRecord)("ecosystemMarket", id, {
        metadata,
    });
};
