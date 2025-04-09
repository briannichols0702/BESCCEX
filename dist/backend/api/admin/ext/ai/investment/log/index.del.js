"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Bulk deletes AI Investments by IDs",
    operationId: "bulkDeleteAIInvestments",
    tags: ["Admin", "AI Investment"],
    parameters: (0, query_1.commonBulkDeleteParams)("AI Investments"),
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
                            description: "Array of AI Investment IDs to delete",
                        },
                    },
                    required: ["ids"],
                },
            },
        },
    },
    responses: (0, query_1.commonBulkDeleteResponses)("AI Investments"),
    requiresAuth: true,
    permission: "Access AI Investment Management",
};
exports.default = async (data) => {
    const { body, query } = data;
    const { ids } = body;
    // You can define preDelete and postDelete to handle each ID similarly
    const preDelete = async () => {
        // Perform all pre-deletion logic for each ID
        for (const id of ids) {
            const transaction = await db_1.models.transaction.findOne({
                where: { referenceId: id },
                include: [{ model: db_1.models.wallet }],
            });
            if (transaction && transaction.wallet) {
                const newBalance = transaction.wallet.balance + transaction.amount;
                // Update wallet balance
                await db_1.models.wallet.update({ balance: newBalance }, { where: { id: transaction.wallet.id } });
            }
        }
    };
    const postDelete = async () => {
        // Delete transaction records after wallets have been updated
        for (const id of ids) {
            await db_1.models.transaction.destroy({
                where: { referenceId: id },
            });
        }
    };
    return (0, query_1.handleBulkDelete)({
        model: "aiInvestment",
        ids,
        query,
        preDelete,
        postDelete,
    });
};
