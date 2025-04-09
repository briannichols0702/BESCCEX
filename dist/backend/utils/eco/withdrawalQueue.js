"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEcoWithdrawalFailedEmail = exports.sendEcoWithdrawalConfirmationEmail = void 0;
const db_1 = require("@b/db");
const utxo_1 = require("@b/utils/eco/utxo");
const notifications_1 = require("@b/utils/notifications");
const sol_1 = __importDefault(require("@b/blockchains/sol"));
const wallet_1 = require("@b/utils/eco/wallet");
const emails_1 = require("@b/utils/emails");
const withdraw_1 = require("./withdraw");
const tron_1 = __importDefault(require("@b/blockchains/tron"));
const xmr_1 = __importDefault(require("@b/blockchains/xmr"));
const ton_1 = __importDefault(require("@b/blockchains/ton"));
class WithdrawalQueue {
    constructor() {
        this.queue = [];
        this.isProcessing = false;
        this.processingTransactions = new Set();
    }
    static getInstance() {
        if (!WithdrawalQueue.instance) {
            WithdrawalQueue.instance = new WithdrawalQueue();
        }
        return WithdrawalQueue.instance;
    }
    addTransaction(transactionId) {
        if (this.processingTransactions.has(transactionId)) {
            // Transaction is already being processed
            return;
        }
        if (!this.queue.includes(transactionId)) {
            this.queue.push(transactionId);
            this.processNext();
        }
    }
    async processNext() {
        if (this.isProcessing || this.queue.length === 0) {
            return;
        }
        this.isProcessing = true;
        const transactionId = this.queue.shift();
        if (transactionId) {
            try {
                this.processingTransactions.add(transactionId);
                // Fetch the transaction from the database
                const transaction = await db_1.models.transaction.findOne({
                    where: { id: transactionId },
                    include: [
                        {
                            model: db_1.models.wallet,
                            as: "wallet",
                            where: { type: "ECO" },
                        },
                    ],
                });
                if (!transaction) {
                    console.error(`Transaction ${transactionId} not found.`);
                    throw new Error("Transaction not found");
                }
                if (!transaction.wallet) {
                    console.error(`Wallet not found for transaction ${transactionId}`);
                    throw new Error("Wallet not found for transaction");
                }
                // Update transaction status to 'PROCESSING' to prevent duplicate processing
                const [updatedCount] = await db_1.models.transaction.update({ status: "PROCESSING" }, { where: { id: transactionId, status: "PENDING" } });
                if (updatedCount === 0) {
                    throw new Error("Transaction already processed or in process");
                }
                const metadata = typeof transaction.metadata === "string"
                    ? JSON.parse(transaction.metadata)
                    : transaction.metadata;
                if (!metadata || !metadata.chain) {
                    throw new Error("Invalid or missing chain in transaction metadata");
                }
                // Process withdrawal based on the blockchain chain type
                await this.processWithdrawal(transaction, metadata);
                // Send email to the user
                await this.sendWithdrawalConfirmationEmail(transaction, metadata);
                // Record admin profit if a fee is associated with the transaction
                await this.recordAdminProfit(transaction, metadata);
            }
            catch (error) {
                console.error(`Failed to process transaction ${transactionId}: ${error.message}`);
                // Mark transaction as 'FAILED' and attempt to refund the user
                await this.markTransactionFailed(transactionId, error.message);
                await new Promise((resolve) => setTimeout(resolve, 1000));
            }
            finally {
                this.processingTransactions.delete(transactionId);
                this.isProcessing = false;
                setImmediate(() => this.processNext()); // Process the next transaction
            }
        }
        else {
            this.isProcessing = false;
        }
    }
    async processWithdrawal(transaction, metadata) {
        if (["BTC", "LTC", "DOGE", "DASH"].includes(metadata.chain)) {
            await (0, utxo_1.handleUTXOWithdrawal)(transaction);
        }
        else if (metadata.chain === "SOL") {
            const solanaService = await sol_1.default.getInstance();
            if (metadata.contractType === "PERMIT") {
                await solanaService.handleSplTokenWithdrawal(transaction.id, transaction.walletId, metadata.contract, transaction.amount, metadata.toAddress, metadata.decimals);
            }
            else {
                await solanaService.handleSolanaWithdrawal(transaction.id, transaction.walletId, transaction.amount, metadata.toAddress);
            }
        }
        else if (metadata.chain === "TRON") {
            const tronService = await tron_1.default.getInstance();
            await tronService.handleTronWithdrawal(transaction.id, transaction.walletId, transaction.amount, metadata.toAddress);
        }
        else if (metadata.chain === "XMR") {
            const moneroService = await xmr_1.default.getInstance();
            await moneroService.handleMoneroWithdrawal(transaction.id, transaction.walletId, transaction.amount, metadata.toAddress);
        }
        else if (metadata.chain === "TON") {
            const tonService = await ton_1.default.getInstance();
            await tonService.handleTonWithdrawal(transaction.id, transaction.walletId, transaction.amount, metadata.toAddress);
        }
        else {
            await (0, withdraw_1.handleEvmWithdrawal)(transaction.id, transaction.walletId, metadata.chain, transaction.amount, metadata.toAddress);
        }
        // Mark the transaction as completed after successful processing
        await db_1.models.transaction.update({ status: "COMPLETED" }, { where: { id: transaction.id } });
    }
    async sendWithdrawalConfirmationEmail(transaction, metadata) {
        const user = await db_1.models.user.findOne({
            where: { id: transaction.userId },
        });
        if (user) {
            const wallet = await db_1.models.wallet.findOne({
                where: {
                    userId: user.id,
                    currency: transaction.wallet.currency,
                    type: "ECO",
                },
            });
            if (wallet) {
                await sendEcoWithdrawalConfirmationEmail(user, transaction, wallet, metadata.toAddress, metadata.chain);
            }
        }
    }
    async recordAdminProfit(transaction, metadata) {
        if (transaction &&
            typeof transaction.fee === "number" &&
            transaction.fee > 0) {
            await db_1.models.adminProfit.create({
                amount: transaction.fee,
                currency: transaction.wallet.currency,
                chain: metadata.chain,
                type: "WITHDRAW",
                transactionId: transaction.id,
                description: `Admin profit from withdrawal fee of ${transaction.fee} ${transaction.wallet.currency} for transaction (${transaction.id})`,
            });
        }
    }
    async markTransactionFailed(transactionId, errorMessage) {
        await db_1.models.transaction.update({
            status: "FAILED",
            description: `Transaction failed: ${errorMessage}`,
        }, { where: { id: transactionId } });
        const transaction = await db_1.models.transaction.findByPk(transactionId, {
            include: [{ model: db_1.models.wallet, as: "wallet", where: { type: "ECO" } }],
        });
        if (transaction && transaction.wallet) {
            await (0, wallet_1.refundUser)(transaction);
            const user = await db_1.models.user.findOne({
                where: { id: transaction.userId },
            });
            if (user) {
                const metadata = typeof transaction.metadata === "string"
                    ? JSON.parse(transaction.metadata)
                    : transaction.metadata;
                await sendEcoWithdrawalFailedEmail(user, transaction, transaction.wallet, metadata.toAddress, errorMessage);
            }
            // Optionally, notify the user about the failed withdrawal
            await (0, notifications_1.handleNotification)({
                userId: transaction.userId,
                title: "Withdrawal Failed",
                message: `Your withdrawal of ${transaction.amount} ${transaction.wallet.currency} has failed.`,
                type: "ACTIVITY",
            });
        }
    }
}
// Email sending functions
async function sendEcoWithdrawalConfirmationEmail(user, transaction, wallet, toAddress, chain) {
    const emailType = "EcoWithdrawalConfirmation";
    const emailData = {
        TO: user.email,
        FIRSTNAME: user.firstName,
        AMOUNT: transaction.amount.toString(),
        CURRENCY: wallet.currency,
        TO_ADDRESS: toAddress,
        TRANSACTION_ID: transaction.referenceId || transaction.id,
        CHAIN: chain,
    };
    await emails_1.emailQueue.add({ emailData, emailType });
}
exports.sendEcoWithdrawalConfirmationEmail = sendEcoWithdrawalConfirmationEmail;
async function sendEcoWithdrawalFailedEmail(user, transaction, wallet, toAddress, reason) {
    const emailType = "EcoWithdrawalFailed";
    const emailData = {
        TO: user.email,
        FIRSTNAME: user.firstName,
        AMOUNT: transaction.amount.toString(),
        CURRENCY: wallet.currency,
        TO_ADDRESS: toAddress,
        REASON: reason,
    };
    await emails_1.emailQueue.add({ emailData, emailType });
}
exports.sendEcoWithdrawalFailedEmail = sendEcoWithdrawalFailedEmail;
exports.default = WithdrawalQueue;
