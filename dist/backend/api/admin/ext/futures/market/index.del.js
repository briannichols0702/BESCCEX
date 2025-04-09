"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const order_1 = require("@b/utils/futures/queries/order");
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Bulk deletes futures markets by IDs",
    operationId: "bulkDeleteFuturesMarkets",
    tags: ["Admin", "Futures", "Market"],
    parameters: (0, query_1.commonBulkDeleteParams)("Futures Markets"),
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
                            description: "Array of futures market IDs to delete",
                        },
                    },
                    required: ["ids"],
                },
            },
        },
    },
    responses: (0, query_1.commonBulkDeleteResponses)("Futures Markets"),
    requiresAuth: true,
    permission: "Access Futures Market Management",
};
exports.default = async (data) => {
    const { body, query } = data;
    const { ids } = body;
    const markets = await db_1.models.futuresMarket.findAll({
        where: { id: ids },
        attributes: ["currency"],
    });
    if (!markets.length) {
        throw new Error("Markets not found");
    }
    const postDelete = async () => {
        for (const market of markets) {
            await (0, order_1.deleteAllMarketData)(market.currency);
        }
    };
    return (0, query_1.handleBulkDelete)({
        model: "futuresMarket",
        ids: ids,
        query: { ...query, force: true },
        postDelete,
    });
};
