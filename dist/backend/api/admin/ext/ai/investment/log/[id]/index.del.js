"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Deletes a specific AI Investment",
    operationId: "deleteAIInvestment",
    tags: ["Admin", "AI Investment"],
    parameters: (0, query_1.deleteRecordParams)("AI Investment"),
    responses: (0, query_1.deleteRecordResponses)("AI Investment"),
    permission: "Access AI Investment Management",
    requiresAuth: true,
};
exports.default = async (data) => {
    const { params, query } = data;
    const externalData = {};
    const preDelete = async () => {
        const transaction = await db_1.models.transaction.findOne({
            where: { referenceId: params.id },
            include: [{ model: db_1.models.wallet }],
        });
        if (!transaction) {
            throw new Error("Transaction not found");
        }
        const { wallet } = transaction;
        if (!wallet) {
            throw new Error("Wallet not found");
        }
        // Calculate new balance, assuming transaction.amount needs to be added back to the wallet.
        const newBalance = wallet.balance + transaction.amount;
        // Update wallet balance
        await db_1.models.wallet.update({ balance: newBalance }, { where: { id: wallet.id } });
        // Store transaction ID for later use in postDelete
        externalData.transactionId = transaction.id;
    };
    const postDelete = async () => {
        // Delete transaction record after updating the wallet
        if (externalData.transactionId) {
            await db_1.models.transaction.destroy({
                where: { id: externalData.transactionId },
            });
        }
    };
    return await (0, query_1.handleSingleDelete)({
        model: "aiInvestment",
        id: params.id,
        query,
        preDelete,
        postDelete,
    });
};
