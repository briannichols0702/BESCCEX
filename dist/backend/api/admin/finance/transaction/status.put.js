"use strict";
// /server/api/admin/wallets/transactions/updateTransactionStatus.put.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTransactionStatusQuery = exports.metadata = void 0;
const emails_1 = require("@b/utils/emails");
const error_1 = require("@b/utils/error");
const db_1 = require("@b/db");
exports.metadata = {
    summary: "Updates the status of a transaction",
    operationId: "updateTransactionStatus",
    tags: ["Admin", "Wallets"],
    requestBody: {
        required: true,
        description: "Payload to update the transaction status",
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        referenceId: {
                            type: "string",
                            description: "Reference ID of the transaction",
                        },
                        status: {
                            type: "string",
                            description: "New status for the transaction",
                            enum: [
                                "PENDING",
                                "COMPLETED",
                                "FAILED",
                                "CANCELLED",
                                "EXPIRED",
                                "REJECTED",
                                "REFUNDED",
                                "FROZEN",
                                "PROCESSING",
                                "TIMEOUT",
                            ],
                        },
                        message: {
                            type: "string",
                            nullable: true,
                            description: "Optional message explaining the status update",
                        },
                    },
                    required: ["referenceId", "status"],
                },
            },
        },
    },
    responses: {
        200: {
            description: "Transaction status updated successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            id: {
                                type: "string",
                                description: "Unique identifier of the transaction",
                            },
                            status: {
                                type: "string",
                                description: "New status of the transaction",
                            },
                            message: {
                                type: "string",
                                nullable: true,
                                description: "Optional message explaining the status update",
                            },
                            balance: {
                                type: "number",
                                description: "New balance of the wallet after the transaction status update",
                            },
                        },
                    },
                },
            },
        },
        401: {
            description: "Unauthorized, admin permission required",
        },
        404: {
            description: "Transaction not found",
        },
        500: {
            description: "Internal server error",
        },
    },
    requiresAuth: true,
    permission: "Access Transaction Management",
};
exports.default = async (data) => {
    try {
        const { referenceId, status, message } = data.body;
        const response = await updateTransactionStatusQuery(referenceId, status, message);
        return {
            ...response,
            message: "Transaction status updated successfully",
        };
    }
    catch (error) {
        throw new Error(error.message);
    }
};
async function updateTransactionStatusQuery(referenceId, status, message) {
    var _a;
    const transaction = await db_1.models.transaction.findOne({
        where: { id: referenceId },
    });
    if (!transaction) {
        throw new Error("Transaction not found");
    }
    const updateData = {
        status: status,
        metadata: transaction.metadata,
    };
    const wallet = await db_1.models.wallet.findOne({
        where: { id: transaction.walletId },
    });
    if (!wallet) {
        throw new Error("Wallet not found");
    }
    let balance = Number(wallet.balance);
    if (status === "REJECTED") {
        if (message) {
            updateData.metadata.note = message;
        }
        if (transaction.type === "WITHDRAW") {
            balance += Number(transaction.amount);
        }
    }
    else if (status === "COMPLETED" && transaction.type === "DEPOSIT") {
        balance += Number(transaction.amount) - Number(transaction.fee);
    }
    if (wallet.balance !== balance) {
        await db_1.models.wallet.update({ balance: balance }, {
            where: { id: wallet.id },
        });
    }
    await db_1.models.transaction.update(updateData, {
        where: { id: referenceId },
    });
    const updatedTransaction = await db_1.models.transaction.findOne({
        where: { id: referenceId },
    });
    if (!updatedTransaction) {
        throw (0, error_1.createError)(500, "Failed to update transaction status");
    }
    const trx = updatedTransaction.get({ plain: true });
    try {
        const user = await db_1.models.user.findOne({
            where: { id: transaction.userId },
        });
        await (0, emails_1.sendTransactionStatusUpdateEmail)(user, trx, wallet, balance, ((_a = updateData.metadata) === null || _a === void 0 ? void 0 : _a.note) || null);
    }
    catch (error) {
        console.error(error);
    }
    return trx;
}
exports.updateTransactionStatusQuery = updateTransactionStatusQuery;
