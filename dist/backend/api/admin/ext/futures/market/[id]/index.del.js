"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const order_1 = require("@b/utils/futures/queries/order");
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Deletes a specific futures market",
    operationId: "deleteFuturesMarket",
    tags: ["Admin", "Futures", "Market"],
    parameters: (0, query_1.deleteRecordParams)("Futures Market"),
    responses: (0, query_1.deleteRecordResponses)("Futures Market"),
    permission: "Access Futures Market Management",
    requiresAuth: true,
};
exports.default = async (data) => {
    const { params, query } = data;
    // Fetch the market currency before deletion
    const market = await db_1.models.futuresMarket.findOne({
        where: { id: params.id },
        attributes: ["currency"],
    });
    if (!market) {
        throw new Error("Market not found");
    }
    const currency = market.currency;
    const postDelete = async () => {
        await (0, order_1.deleteAllMarketData)(currency);
    };
    return (0, query_1.handleSingleDelete)({
        model: "futuresMarket",
        id: params.id,
        query: { ...query, force: true },
        postDelete,
    });
};
