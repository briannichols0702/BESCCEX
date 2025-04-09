"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserById = exports.mapChainNameToChainId = exports.getCurrency = exports.getWalletQuery = exports.metadata = void 0;
const utils_1 = require("@b/api/auth/utils");
const emails_1 = require("@b/utils/emails");
const error_1 = require("@b/utils/error");
const exchange_1 = __importDefault(require("@b/utils/exchange"));
const db_1 = require("@b/db");
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Approves a spot wallet withdrawal request",
    operationId: "approveSpotWalletWithdrawal",
    tags: ["Admin", "Wallets"],
    parameters: [
        {
            name: "id",
            in: "path",
            required: true,
            description: "The ID of the wallet withdrawal to approve",
            schema: { type: "string", format: "uuid" },
        },
    ],
    responses: {
        200: {
            description: "Withdrawal request approved successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            message: { type: "string" },
                        },
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("Wallet"),
        500: query_1.serverErrorResponse,
    },
    permission: "Access Wallet Management",
    requiresAuth: true,
};
exports.default = async (data) => {
    var _a, _b, _c;
    const { params } = data;
    const { id } = params;
    try {
        const transaction = await db_1.models.transaction.findOne({
            where: { id },
        });
        if (!transaction) {
            throw new Error("Transaction not found");
        }
        if (transaction.status !== "PENDING") {
            throw new Error("Transaction is not pending");
        }
        const { amount, userId } = transaction;
        const { currency, chain, address, memo } = transaction.metadata;
        // Fetch the user's wallet
        const wallet = (await getWalletQuery(userId, currency));
        if (!wallet) {
            throw new Error("Wallet not found");
        }
        const currencyData = await getCurrency(currency);
        if (!currencyData) {
            throw new Error("Currency not found");
        }
        const fee = ((_b = (_a = currencyData.chains) === null || _a === void 0 ? void 0 : _a.find((c) => c.network === chain)) === null || _b === void 0 ? void 0 : _b.withdrawFee) || 0;
        const withdrawAmount = Number(amount) + Number(fee);
        if (withdrawAmount > wallet.balance) {
            throw new Error("Your withdraw amount including fee is higher than your balance");
        }
        // Initialize exchange
        const exchange = await exchange_1.default.startExchange();
        const provider = await exchange_1.default.provider;
        // Implement your third-party API logic here
        let withdrawResponse, withdrawStatus;
        switch (provider) {
            case "kucoin":
                try {
                    const chainId = mapChainNameToChainId(chain);
                    const transferProcess = await exchange.transfer(currency, withdrawAmount, "main", "trade");
                    if (transferProcess.id) {
                        try {
                            withdrawResponse = await exchange.withdraw(currency, withdrawAmount, address, memo, { chain: chainId });
                            if (withdrawResponse.id) {
                                try {
                                    const withdrawals = await exchange.fetchWithdrawals(currency);
                                    const withdrawData = withdrawals.find((w) => w.id === withdrawResponse.id);
                                    if (withdrawData) {
                                        withdrawResponse.fee =
                                            withdrawAmount * fee + ((_c = withdrawData.fee) === null || _c === void 0 ? void 0 : _c.cost);
                                        switch (withdrawData.status) {
                                            case "ok":
                                                withdrawStatus = "COMPLETED";
                                                break;
                                            case "canceled":
                                                withdrawStatus = "CANCELLED";
                                                break;
                                            case "failed":
                                                withdrawStatus = "FAILED";
                                            default:
                                                withdrawStatus = "PENDING";
                                                break;
                                        }
                                    }
                                }
                                catch (error) {
                                    withdrawResponse.fee = fee;
                                }
                            }
                        }
                        catch (error) {
                            console.error(`Withdrawal failed: ${error.message}`);
                            throw new Error(`Withdrawal failed: ${error.message}`);
                        }
                    }
                }
                catch (error) {
                    console.error(`Transfer failed: ${error.message}`);
                    throw new Error(`Transfer failed: ${error.message}`);
                }
                break;
            case "binance":
            case "okx":
                try {
                    withdrawResponse = await exchange.withdraw(currency, withdrawAmount, address, memo, { network: chain });
                    withdrawResponse.fee = Number(withdrawResponse.fee) || fee;
                    switch (withdrawResponse.status) {
                        case "ok":
                            withdrawStatus = "COMPLETED";
                            break;
                        case "canceled":
                            withdrawStatus = "CANCELLED";
                            break;
                        case "failed":
                            withdrawStatus = "FAILED";
                        default:
                            withdrawStatus = "PENDING";
                            break;
                    }
                }
                catch (error) {
                    console.error(`Withdrawal failed: ${error.message}`);
                    throw new Error(`Withdrawal failed: ${error.message}`);
                }
                break;
            // other providers
            default:
                break;
        }
        if (!withdrawResponse ||
            !withdrawResponse.id ||
            !withdrawStatus ||
            withdrawStatus === "FAILED" ||
            withdrawStatus === "CANCELLED") {
            throw new Error("Withdrawal failed");
        }
        await db_1.models.transaction.update({
            status: withdrawStatus,
            referenceId: withdrawResponse.id,
        }, {
            where: { id },
        });
        const updatedTransaction = await db_1.models.transaction.findOne({
            where: { id },
        });
        if (!updatedTransaction) {
            throw (0, error_1.createError)(500, "Transaction not found");
        }
        try {
            const userData = (await (0, exports.getUserById)(userId));
            (0, emails_1.sendSpotWalletWithdrawalConfirmationEmail)(userData, updatedTransaction.get({ plain: true }), wallet);
        }
        catch (error) {
            console.error(`Withdrawal confirmation email failed: ${error.message}`);
        }
        return {
            message: "Withdrawal approved successfully",
        };
    }
    catch (error) {
        throw new Error(error.message);
    }
};
async function getWalletQuery(userId, currency) {
    const wallet = await db_1.models.wallet.findOne({
        where: {
            userId,
            currency,
            type: "SPOT",
        },
        include: [
            {
                model: db_1.models.transaction, // Assuming 'transaction' is the model name you've used in associations
                as: "transactions", // This should match the alias used in the association if there's one. Omit if no alias is defined.
                order: [["createdAt", "DESC"]],
            },
        ],
    });
    if (!wallet) {
        throw (0, error_1.createError)(404, "Wallet not found");
    }
    return wallet.get({ plain: true });
}
exports.getWalletQuery = getWalletQuery;
async function getCurrency(symbol) {
    const currency = await db_1.models.exchangeCurrency.findOne({
        where: {
            currency: symbol,
        },
    });
    if (!currency) {
        throw new Error("Currency details not found");
    }
    return currency.get({ plain: true });
}
exports.getCurrency = getCurrency;
function mapChainNameToChainId(chainName) {
    const chainMap = {
        BEP20: "bsc",
        BEP2: "bnb",
        ERC20: "eth",
        TRC20: "trx",
    };
    return chainMap[chainName] || chainName;
}
exports.mapChainNameToChainId = mapChainNameToChainId;
// Get user by ID
const getUserById = async (id) => {
    const user = await db_1.models.user.findOne({
        where: { id },
        include: utils_1.userInclude,
    });
    if (!user)
        throw new Error("User not found");
    return {
        ...user.get({ plain: true }),
        password: undefined,
    };
};
exports.getUserById = getUserById;
