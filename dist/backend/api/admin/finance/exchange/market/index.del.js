"use strict";
// /server/api/exchange/markets/delete.del.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Bulk deletes exchange markets by IDs",
    operationId: "bulkDeleteExchangeMarkets",
    tags: ["Admin", "Exchange", "Markets"],
    parameters: (0, query_1.commonBulkDeleteParams)("Exchange Markets"),
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        ids: {
                            type: "array",
                            items: { type: "string" },
                            description: "Array of exchange market IDs to delete",
                        },
                    },
                    required: ["ids"],
                },
            },
        },
    },
    responses: (0, query_1.commonBulkDeleteResponses)("Exchange Markets"),
    requiresAuth: true,
    permission: "Access Exchange Market Management",
};
exports.default = async (data) => {
    const { body, query } = data;
    const { ids } = body;
    return (0, query_1.handleBulkDelete)({
        model: "exchangeMarket",
        ids,
        query,
    });
};
