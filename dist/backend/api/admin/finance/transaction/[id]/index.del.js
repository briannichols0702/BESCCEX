"use strict";
// /server/api/admin/wallets/transactions/index.delete.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Deletes a transaction",
    operationId: "deleteTransaction",
    tags: ["Admin", "Transaction"],
    parameters: (0, query_1.deleteRecordParams)("transaction"),
    responses: (0, query_1.deleteRecordResponses)("Transaction"),
    requiresAuth: true,
    permission: "Access Transaction Management",
};
exports.default = async (data) => {
    const { params, query } = data;
    // Delete associated admin profit if it exists
    await db_1.models.adminProfit.destroy({
        where: {
            transactionId: params.id,
        },
    });
    return (0, query_1.handleSingleDelete)({
        model: "transaction",
        id: params.id,
        query,
    });
};
