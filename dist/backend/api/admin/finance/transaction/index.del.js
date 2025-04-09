"use strict";
// /server/api/admin/wallets/transactions/delete.del.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Bulk deletes transactions by IDs",
    operationId: "bulkDeleteTransactions",
    tags: ["Admin", "Transaction"],
    parameters: (0, query_1.commonBulkDeleteParams)("Transactions"),
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
                            description: "Array of transaction IDs to delete",
                        },
                    },
                    required: ["ids"],
                },
            },
        },
    },
    responses: (0, query_1.commonBulkDeleteResponses)("Transactions"),
    requiresAuth: true,
    permission: "Access Transaction Management",
};
exports.default = async (data) => {
    const { body, query } = data;
    const { ids } = body;
    // Delete associated admin profits if they exist
    await db_1.models.adminProfit.destroy({
        where: {
            transactionId: ids,
        },
    });
    return (0, query_1.handleBulkDelete)({
        model: "transaction",
        ids,
        query,
    });
};
