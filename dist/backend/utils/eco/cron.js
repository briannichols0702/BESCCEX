"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processPendingEcoWithdrawals = void 0;
const db_1 = require("@b/db");
const withdrawalQueue_1 = __importDefault(require("./withdrawalQueue"));
async function processPendingEcoWithdrawals() {
    try {
        // Fetch all pending withdrawal transactions for ECO wallets
        const pendingTransactions = await db_1.models.transaction.findAll({
            where: {
                type: "WITHDRAW",
                status: "PENDING",
            },
            include: [
                {
                    model: db_1.models.wallet,
                    as: "wallet",
                    where: {
                        type: "ECO",
                    },
                },
            ],
        });
        if (pendingTransactions.length === 0) {
            return;
        }
        const withdrawalQueue = withdrawalQueue_1.default.getInstance();
        for (const transaction of pendingTransactions) {
            withdrawalQueue.addTransaction(transaction.id);
        }
    }
    catch (error) {
        console.error(`processPendingEcoWithdrawals failed: ${error.message}`);
        // Handle the error appropriately
    }
}
exports.processPendingEcoWithdrawals = processPendingEcoWithdrawals;
