"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const exchange_1 = __importDefault(require("@b/utils/exchange"));
const cron_1 = require("@b/utils/cron");
const db_1 = require("@b/db");
const error_1 = require("@b/utils/error");
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Withdraws money from the specified Forex account",
    description: "Allows a user to withdraw money from their Forex account into their wallet.",
    operationId: "withdrawForexAccount",
    tags: ["Forex", "Accounts"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", description: "Forex account ID" },
        },
    ],
    requiresAuth: true,
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        type: { type: "string", description: "Wallet type" },
                        currency: { type: "string", description: "Currency code" },
                        chain: {
                            type: "string",
                            description: "Blockchain network",
                            nullable: true,
                        },
                        amount: { type: "number", description: "Amount to withdraw" },
                    },
                    required: ["type", "currency", "amount"],
                },
            },
        },
    },
    responses: {
        201: {
            description: "Withdrawal successfully processed",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            message: { type: "string", description: "Success message" },
                            transaction: {
                                type: "object",
                                properties: {
                                    id: { type: "string", description: "Transaction ID" },
                                    userId: { type: "string", description: "User ID" },
                                    walletId: { type: "string", description: "Wallet ID" },
                                    type: { type: "string", description: "Transaction type" },
                                    status: { type: "string", description: "Transaction status" },
                                    amount: { type: "number", description: "Transaction amount" },
                                    fee: { type: "number", description: "Transaction fee" },
                                    description: {
                                        type: "string",
                                        description: "Transaction description",
                                    },
                                    metadata: {
                                        type: "object",
                                        description: "Transaction metadata",
                                    },
                                    createdAt: {
                                        type: "string",
                                        description: "Transaction creation date",
                                    },
                                    updatedAt: {
                                        type: "string",
                                        description: "Transaction update date",
                                    },
                                },
                            },
                            balance: { type: "number", description: "Wallet balance" },
                            currency: { type: "string", description: "Currency code" },
                            chain: {
                                type: "string",
                                description: "Blockchain network",
                                nullable: true,
                            },
                            type: { type: "string", description: "Wallet type" },
                        },
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("Forex Account"),
        500: query_1.serverErrorResponse,
    },
};
exports.default = async (data) => {
    const { user, params, body } = data;
    if (!(user === null || user === void 0 ? void 0 : user.id)) {
        throw (0, error_1.createError)({ statusCode: 401, message: "Unauthorized" });
    }
    const { id } = params;
    const { amount, type, currency, chain } = body;
    if (!amount || amount <= 0)
        throw new Error("Amount is required and must be greater than zero");
    if (amount <= 0)
        throw new Error("Amount must be greater than zero");
    let updatedBalance;
    const transaction = await db_1.sequelize.transaction(async (t) => {
        var _a;
        const account = await db_1.models.forexAccount.findByPk(id, {
            transaction: t,
        });
        if (!account)
            throw new Error("Account not found");
        if (account.balance < amount)
            throw new Error("Insufficient balance");
        const wallet = await db_1.models.wallet.findOne({
            where: { userId: user.id, type, currency },
            transaction: t,
        });
        if (!wallet)
            throw new Error("Wallet not found");
        let currencyData;
        let taxAmount = 0;
        switch (type) {
            case "FIAT":
                currencyData = await db_1.models.currency.findOne({
                    where: { id: wallet.currency },
                    transaction: t,
                });
                if (!currencyData || !currencyData.price) {
                    await (0, cron_1.fetchFiatCurrencyPrices)();
                    currencyData = await db_1.models.currency.findOne({
                        where: { id: wallet.currency },
                        transaction: t,
                    });
                    if (!currencyData || !currencyData.price)
                        throw new Error("Currency processing failed");
                }
                break;
            case "SPOT":
                currencyData = await db_1.models.exchangeCurrency.findOne({
                    where: { currency: wallet.currency },
                    transaction: t,
                });
                if (!currencyData || !currencyData.price) {
                    await (0, cron_1.processCurrenciesPrices)();
                    currencyData = await db_1.models.exchangeCurrency.findOne({
                        where: { currency: wallet.currency },
                        transaction: t,
                    });
                    if (!currencyData || !currencyData.price)
                        throw new Error("Currency processing failed");
                }
                const exchange = await exchange_1.default.startExchange();
                const provider = await exchange_1.default.getProvider();
                if (!exchange)
                    throw (0, error_1.createError)(500, "Exchange not found");
                const currencies = await exchange.fetchCurrencies();
                const exchangeCurrency = Object.values(currencies).find((c) => c.id === currency);
                if (!exchangeCurrency)
                    throw (0, error_1.createError)(404, "Currency not found");
                let fixedFee = 0;
                switch (provider) {
                    case "binance":
                    case "kucoin":
                        fixedFee =
                            exchangeCurrency.networks[chain].fee ||
                                ((_a = exchangeCurrency.networks[chain].fees) === null || _a === void 0 ? void 0 : _a.withdraw);
                        break;
                    default:
                        break;
                }
                const parsedAmount = parseFloat(amount);
                const percentageFee = currencyData.fee || 0;
                taxAmount = parseFloat(Math.max((parsedAmount * percentageFee) / 100 + fixedFee, 0).toFixed(2));
                break;
            default:
                throw new Error("Invalid wallet type");
        }
        const Total = amount + taxAmount;
        if (account.balance < Total) {
            throw new Error("Insufficient funds");
        }
        updatedBalance = parseFloat((account.balance - Total).toFixed(2));
        await account.update({ balance: updatedBalance }, { transaction: t });
        const transaction = await db_1.models.transaction.create({
            userId: user.id,
            walletId: wallet.id,
            type: "FOREX_WITHDRAW",
            status: "PENDING",
            amount,
            fee: taxAmount,
            description: `Withdraw to Forex account ${account.accountId}`,
            metadata: JSON.stringify({
                id: id,
                accountId: account.accountId,
                type: type,
                currency: currency,
                chain: chain,
                price: currencyData.price,
            }),
        }, { transaction: t });
        return transaction;
    });
    return {
        message: "Withdraw successful",
        transaction: transaction,
        balance: updatedBalance,
        currency,
        chain,
        type,
    };
};
