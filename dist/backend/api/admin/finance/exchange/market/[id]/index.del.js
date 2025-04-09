"use strict";
// /server/api/exchange/markets/delete/[id].del.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Deletes an exchange market",
    operationId: "deleteExchangeMarket",
    tags: ["Admin", "Exchange", "Markets"],
    parameters: (0, query_1.deleteRecordParams)("exchange market"),
    responses: (0, query_1.deleteRecordResponses)("Exchange market"),
    requiresAuth: true,
    permission: "Access Exchange Market Management",
};
exports.default = async (data) => {
    const { params, query } = data;
    return (0, query_1.handleSingleDelete)({
        model: "exchangeMarket",
        id: params.id,
        query,
    });
};
