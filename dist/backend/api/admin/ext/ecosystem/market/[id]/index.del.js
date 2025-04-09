"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const queries_1 = require("@b/utils/eco/scylla/queries");
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Deletes a specific ecosystem market",
    operationId: "deleteEcosystemMarket",
    tags: ["Admin", "Ecosystem", "Market"],
    parameters: (0, query_1.deleteRecordParams)("Ecosystem Market"),
    responses: (0, query_1.deleteRecordResponses)("Ecosystem Market"),
    permission: "Access Ecosystem Market Management",
    requiresAuth: true,
};
exports.default = async (data) => {
    const { params, query } = data;
    // Fetch the market currency before deletion
    const market = await db_1.models.ecosystemMarket.findOne({
        where: { id: params.id },
        attributes: ["currency"],
    });
    if (!market) {
        throw new Error("Market not found");
    }
    const currency = market.currency;
    const postDelete = async () => {
        await (0, queries_1.deleteAllMarketData)(currency);
    };
    return (0, query_1.handleSingleDelete)({
        model: "ecosystemMarket",
        id: params.id,
        query: { ...query, force: true },
        postDelete,
    });
};
