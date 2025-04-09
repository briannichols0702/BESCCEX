"use strict";
// /server/api/ecosystem/markets/delete.del.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const queries_1 = require("@b/utils/eco/scylla/queries");
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Bulk deletes ecosystem markets by IDs",
    operationId: "bulkDeleteEcosystemMarkets",
    tags: ["Admin", "Ecosystem", "Market"],
    parameters: (0, query_1.commonBulkDeleteParams)("Ecosystem Markets"),
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
                            description: "Array of ecosystem market IDs to delete",
                        },
                    },
                    required: ["ids"],
                },
            },
        },
    },
    responses: (0, query_1.commonBulkDeleteResponses)("Ecosystem Markets"),
    requiresAuth: true,
    permission: "Access Ecosystem Market Management",
};
exports.default = async (data) => {
    const { body, query } = data;
    const { ids } = body;
    const markets = await db_1.models.ecosystemMarket.findAll({
        where: { id: ids },
        attributes: ["currency"],
    });
    if (!markets.length) {
        throw new Error("Markets not found");
    }
    const postDelete = async () => {
        for (const market of markets) {
            await (0, queries_1.deleteAllMarketData)(market.currency);
        }
    };
    return (0, query_1.handleBulkDelete)({
        model: "ecosystemMarket",
        ids: ids,
        query: { ...query, force: true },
        postDelete,
    });
};
