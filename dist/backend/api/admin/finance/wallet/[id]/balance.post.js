"use strict";
// /server/api/admin/wallets/updateBalance.post.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateWalletBalance = exports.metadata = void 0;
const emails_1 = require("@b/utils/emails");
const db_1 = require("@b/db");
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Updates the balance of a wallet",
    operationId: "updateWalletBalance",
    tags: ["Admin", "Wallets"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            required: true,
            description: "ID of the wallet to update",
            schema: { type: "string" },
        },
    ],
    requestBody: {
        required: true,
        description: "Data needed to update the wallet balance",
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        type: {
                            type: "string",
                            description: "Type of balance update (ADD or SUBTRACT)",
                            enum: ["ADD", "SUBTRACT"],
                        },
                        amount: {
                            type: "number",
                            description: "Amount by which to update the wallet balance",
                        },
                    },
                    required: ["id", "type", "amount"],
                },
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("Wallet"),
    requiresAuth: true,
    permission: "Access Wallet Management",
};
exports.default = async (data) => {
    const { id } = data.params;
    const { type, amount } = data.body;
    await updateWalletBalance(id, type, amount);
    return {
        message: "Wallet balance updated successfully",
    };
};
async function updateWalletBalance(id, type, amount) {
    const wallet = await db_1.models.wallet.findOne({
        where: { id },
    });
    if (!wallet)
        throw new Error("Wallet not found");
    // Fetch the user information to pass to the email function
    const user = await db_1.models.user.findOne({
        where: { id: wallet.userId },
    });
    if (!user)
        throw new Error("User not found");
    const newBalance = type === "ADD" ? wallet.balance + amount : wallet.balance - amount;
    if (newBalance < 0)
        throw new Error("Insufficient funds in wallet");
    await db_1.models.wallet.update({ balance: newBalance }, {
        where: { id },
    });
    const updatedWallet = await db_1.models.wallet.findOne({
        where: { id },
    });
    if (!updatedWallet)
        throw new Error("Wallet not found");
    await db_1.models.transaction.create({
        userId: wallet.userId,
        walletId: wallet.id,
        amount: amount,
        type: type === "ADD" ? "INCOMING_TRANSFER" : "OUTGOING_TRANSFER",
        status: "COMPLETED",
        metadata: {
            method: "ADMIN",
        },
        description: `Admin ${type === "ADD" ? "added" : "subtracted"} ${amount} ${wallet.currency} to wallet`,
    });
    await (0, emails_1.sendWalletBalanceUpdateEmail)(user, updatedWallet, type === "ADD" ? "added" : "subtracted", amount, newBalance);
}
exports.updateWalletBalance = updateWalletBalance;
