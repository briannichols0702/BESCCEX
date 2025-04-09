"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const emails_1 = require("@b/utils/emails");
const error_1 = require("@b/utils/error");
exports.metadata = {
    summary: "Update a Forex transaction",
    description: "Updates the status of a specific Forex transaction.",
    operationId: "updateForexTransaction",
    tags: ["Admin", "Forex"],
    parameters: [
        {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", description: "Transaction UUID" },
        },
    ],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        status: {
                            type: "string",
                            description: "New status of the transaction",
                        },
                        message: {
                            type: "string",
                            description: "Optional message regarding the status update",
                        },
                    },
                    required: ["status"],
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
                            message: { type: "string", description: "Success message" },
                        },
                    },
                },
            },
        },
        404: {
            description: "Transaction not found",
        },
        500: {
            description: "Internal server error",
        },
    },
    permission: "Access Forex Signal Management",
};
exports.default = async (data) => {
    var _a, _b;
    const { params, body } = data;
    const { id } = params;
    const { status, message } = body;
    try {
        const transaction = await db_1.models.transaction.findByPk(id);
        if (!transaction) {
            throw new Error("Transaction not found");
        }
        const updateData = {
            status,
            metadata: JSON.parse(transaction.metadata),
        };
        // Fetch the forex account
        const account = await db_1.models.forexAccount.findOne({
            where: { userId: transaction.userId, type: "LIVE" },
        });
        if (!account)
            throw new Error("Account not found");
        if (!((_a = updateData.metadata) === null || _a === void 0 ? void 0 : _a.price))
            throw new Error("Price not found");
        let balance = Number(account.balance);
        const cost = Number(transaction.amount) * Number((_b = updateData.metadata) === null || _b === void 0 ? void 0 : _b.price);
        // Fetch the wallet
        const wallet = await db_1.models.wallet.findByPk(transaction.walletId);
        if (!wallet)
            throw new Error("Wallet not found");
        let walletBalance = Number(wallet.balance);
        if (status === "REJECTED") {
            if (message) {
                updateData.metadata.note = message;
            }
            // Reverse the transaction
            if (transaction.type === "FOREX_WITHDRAW") {
                balance += cost;
            }
            else if (transaction.type === "FOREX_DEPOSIT") {
                walletBalance += cost;
            }
        }
        else if (status === "COMPLETED") {
            // Complete the transaction
            if (transaction.type === "FOREX_DEPOSIT") {
                balance += cost;
            }
            else if (transaction.type === "FOREX_WITHDRAW") {
                walletBalance += cost;
            }
        }
        // Update wallet if necessary
        if (walletBalance !== wallet.balance) {
            await db_1.models.wallet.update({ balance: walletBalance }, {
                where: { id: wallet.id },
            });
        }
        // Update forex account if necessary
        if (balance !== account.balance) {
            await db_1.models.forexAccount.update({ balance }, {
                where: { id: account.id },
            });
        }
        const updatedTransaction = await db_1.models.transaction.update(updateData, {
            where: { id },
        });
        // Fetch user information for email
        const user = await db_1.models.user.findByPk(transaction.userId);
        if (user) {
            // Send an email notification about the transaction status update
            await (0, emails_1.sendForexTransactionEmail)(user, updatedTransaction, account, wallet.currency, transaction.type);
        }
        return { message: "Transaction status updated successfully" };
    }
    catch (error) {
        throw (0, error_1.createError)({
            statusCode: 500,
            message: `Failed to update transaction: ${error.message}`,
        });
    }
};
