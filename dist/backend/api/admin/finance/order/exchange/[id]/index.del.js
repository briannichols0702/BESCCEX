"use strict";
// /server/api/admin/exchange/orders/index.delete.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Deletes an exchange order",
    operationId: "deleteExchangeOrder",
    tags: ["Admin", "Exchange Order"],
    parameters: (0, query_1.deleteRecordParams)("exchange order"),
    responses: (0, query_1.deleteRecordResponses)("Exchange Order"),
    requiresAuth: true,
    permission: "Access Exchange Order Management",
};
exports.default = async (data) => {
    const { params, query } = data;
    return (0, query_1.handleSingleDelete)({
        model: "exchangeOrder",
        id: params.id,
        query,
    });
};
