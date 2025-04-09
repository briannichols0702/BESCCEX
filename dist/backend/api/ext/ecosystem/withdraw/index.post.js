"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const wallet_1 = require("@b/utils/eco/wallet");
const error_1 = require("@b/utils/error");
const tokens_1 = require("@b/utils/eco/tokens");
const query_1 = require("@b/utils/query");
const index_post_1 = require("@b/api/finance/transfer/index.post");
const withdrawalQueue_1 = __importDefault(require("../../../../utils/eco/withdrawalQueue"));
const tron_1 = __importDefault(require("@b/blockchains/tron"));
const xmr_1 = __importDefault(require("@b/blockchains/xmr"));
exports.metadata = {
    summary: "Withdraws funds to an external address",
    description: "Processes a withdrawal from the user's wallet to an external address.",
    operationId: "withdrawFunds",
    tags: ["Wallet", "Withdrawal"],
    requiresAuth: true,
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        currency: {
                            type: "string",
                            description: "Currency to withdraw",
                        },
                        chain: {
                            type: "string",
                            description: "Withdraw method ID",
                        },
                        amount: {
                            type: "number",
                            description: "Amount to withdraw",
                        },
                        toAddress: {
                            type: "string",
                            description: "Withdraw toAddress",
                        },
                    },
                    required: ["currency", "chain", "amount", "toAddress"],
                },
            },
        },
    },
    responses: {
        200: {
            description: "Withdrawal processed successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            message: {
                                type: "string",
                                description: "Success message indicating the withdrawal has been processed.",
                            },
                        },
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("Wallet"),
        500: query_1.serverErrorResponse,
    },
};
exports.default = async (data) => {
    const { body, user } = data;
    if (!(user === null || user === void 0 ? void 0 : user.id)) {
        throw (0, error_1.createError)({ statusCode: 401, message: "Unauthorized" });
    }
    try {
        const { currency, chain, amount, toAddress } = body;
        if (!chain) {
            throw (0, error_1.createError)({
                statusCode: 400,
                message: "Chain parameter is required",
            });
        }
        const parsedAmount = Math.abs(parseFloat(amount));
        // Check if the toAddress belongs to an internal user
        const recipientWallet = await findWalletByAddress(toAddress);
        if (recipientWallet) {
            // Process as internal transfer
            return await (0, index_post_1.processInternalTransfer)(user.id, recipientWallet.userId, currency, chain, parsedAmount);
        }
        else {
            // Proceed with the regular withdrawal process
            return await storeWithdrawal(user.id, currency, chain, parsedAmount, toAddress);
        }
    }
    catch (error) {
        if (error.message === "INSUFFICIENT_FUNDS") {
            console.log("You do not have enough Ether to perform this transaction.");
            throw (0, error_1.createError)({ statusCode: 400, message: "Insufficient funds" });
        }
        throw (0, error_1.createError)({
            statusCode: 500,
            message: `Failed to withdraw: ${error}`,
        });
    }
};
const storeWithdrawal = async (userId, currency, chain, amount, toAddress) => {
    var _a, _b;
    if (!chain || typeof chain !== "string") {
        throw new Error("Invalid or missing chain parameter");
    }
    // Validate address for non-BTC, LTC, DOGE, and DASH chains
    if (!["BTC", "LTC", "DOGE", "DASH"].includes(chain)) {
        (0, wallet_1.validateAddress)(toAddress, chain);
    }
    // Find the user's wallet
    const userWallet = await db_1.models.wallet.findOne({
        where: { userId, currency, type: "ECO" },
    });
    if (!userWallet) {
        throw new Error("User wallet not found");
    }
    // Fetch token settings (like withdrawal fees)
    const token = await (0, tokens_1.getEcosystemToken)(chain, currency);
    if (!token) {
        throw new Error("Token not found");
    }
    // Calculate the withdrawal fee based on token settings
    let withdrawalFee = 0;
    if (token.fee) {
        const tokenFee = JSON.parse(token.fee);
        const currencyWithdrawalFee = (_a = tokenFee.percentage) !== null && _a !== void 0 ? _a : 0;
        const minimumWithdrawalFee = (_b = tokenFee.min) !== null && _b !== void 0 ? _b : 0;
        withdrawalFee = calculateWithdrawalFee(amount, currencyWithdrawalFee, minimumWithdrawalFee);
    }
    // Initialize fees and logic for different chains
    let activationFee = 0;
    let estimatedFee = 0;
    if (chain === "TRON") {
        // Handle Tron-specific logic
        const tronService = await tron_1.default.getInstance();
        // Check if the recipient address is activated
        const isActivated = await tronService.isAddressActivated(toAddress);
        if (!isActivated) {
            activationFee = 1; // 1 TRX required to activate a new account
        }
        // Get wallet data (private key, etc.)
        const walletData = await (0, wallet_1.getWalletData)(userWallet.id, chain);
        if (!walletData) {
            throw new Error("Wallet data not found");
        }
        // Fetch the user's Tron address
        const addresses = typeof userWallet.address === "string"
            ? JSON.parse(userWallet.address)
            : userWallet.address;
        const fromAddress = addresses[chain].address;
        // Convert amount to Sun (TRX's smaller unit)
        const amountSun = Math.round(amount * 1e6);
        // Estimate the transaction fee
        const estimatedFeeSun = await tronService.estimateTransactionFee(fromAddress, toAddress, amountSun);
        estimatedFee = estimatedFeeSun / 1e6; // Convert Sun to TRX
    }
    else if (chain === "XMR") {
        // Handle Monero-specific logic
        const moneroService = await xmr_1.default.getInstance();
        estimatedFee = await moneroService.estimateMoneroFee();
    }
    // Calculate the total fee for the transaction
    const totalFee = withdrawalFee + activationFee + estimatedFee;
    // Calculate the total amount to deduct from the wallet (including fees)
    const totalAmount = amount + totalFee;
    if (userWallet.balance < totalAmount) {
        throw new Error("Insufficient funds");
    }
    // Deduct the total amount from the user's wallet balance
    await (0, wallet_1.decrementWalletBalance)(userWallet, chain, totalAmount);
    // Create the pending transaction
    const transaction = await (0, wallet_1.createPendingTransaction)(userId, userWallet.id, currency, chain, amount, toAddress, totalFee, token);
    // Add the transaction to the withdrawal queue
    const withdrawalQueue = withdrawalQueue_1.default.getInstance();
    withdrawalQueue.addTransaction(transaction.id);
    return {
        transaction: transaction.get({ plain: true }),
        balance: userWallet.balance - totalAmount,
        method: chain,
        currency,
    };
};
const calculateWithdrawalFee = (amount, currencyWithdrawalFee, minimumWithdrawalFee) => {
    const calculatedFee = (amount * currencyWithdrawalFee) / 100;
    return Math.max(calculatedFee, minimumWithdrawalFee);
};
async function findWalletByAddress(toAddress) {
    const wallets = await db_1.models.wallet.findAll({
        where: {
            type: "ECO",
        },
    });
    for (const wallet of wallets) {
        const addresses = (0, index_post_1.parseAddresses)(wallet.address);
        for (const chain in addresses) {
            if (addresses[chain].address === toAddress) {
                return wallet;
            }
        }
    }
    return null;
}
