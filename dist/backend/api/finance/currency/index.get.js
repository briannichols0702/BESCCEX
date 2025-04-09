"use strict";
// /server/api/currencies/index.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const error_1 = require("@b/utils/error");
const utils_1 = require("./utils");
const query_1 = require("@b/utils/query");
const db_1 = require("@b/db");
const sequelize_1 = require("sequelize");
exports.metadata = {
    summary: "Lists all currencies with their current rates",
    description: "This endpoint retrieves all available currencies along with their current rates.",
    operationId: "getCurrencies",
    tags: ["Finance", "Currency"],
    parameters: [
        {
            name: "action",
            in: "query",
            description: "The action to perform",
            required: false,
            schema: {
                type: "string",
            },
        },
        {
            name: "walletType",
            in: "query",
            description: "The type of wallet to retrieve currencies for",
            required: true,
            schema: {
                type: "string",
            },
        },
        {
            name: "targetWalletType",
            in: "query",
            description: "The type of wallet to transfer to",
            required: false,
            schema: {
                type: "string",
            },
        },
    ],
    requiresAuth: true,
    responses: {
        200: {
            description: "Currencies retrieved successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            ...utils_1.baseResponseSchema,
                            data: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: utils_1.baseCurrencySchema,
                                },
                            },
                        },
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("Currency"),
        500: query_1.serverErrorResponse,
    },
};
const walletTypeToModel = {
    FIAT: async (where) => db_1.models.currency.findAll({ where }),
    SPOT: async (where) => db_1.models.exchangeCurrency.findAll({ where }),
    ECO: async (where) => db_1.models.ecosystemToken.findAll({ where }),
};
exports.default = async (data) => {
    const { user, query } = data;
    if (!(user === null || user === void 0 ? void 0 : user.id))
        throw (0, error_1.createError)(401, "Unauthorized");
    const { action, walletType, targetWalletType } = query;
    const where = { status: true };
    switch (action) {
        case "deposit":
            return handleDeposit(walletType, where);
        case "withdraw":
        case "payment":
            return handleWithdraw(walletType, user.id);
        case "transfer":
            return handleTransfer(walletType, targetWalletType, user.id);
        default:
            throw (0, error_1.createError)(400, "Invalid action");
    }
};
async function handleDeposit(walletType, where) {
    const getModel = walletTypeToModel[walletType];
    if (!getModel)
        throw (0, error_1.createError)(400, "Invalid wallet type");
    let currencies = await getModel(where);
    switch (walletType) {
        case "FIAT":
            return currencies
                .map((currency) => ({
                value: currency.id,
                label: `${currency.id} - ${currency.name}`,
            }))
                .sort((a, b) => a.label.localeCompare(b.label));
        case "SPOT":
            return currencies
                .map((currency) => ({
                value: currency.currency,
                label: `${currency.currency} - ${currency.name}`,
            }))
                .sort((a, b) => a.label.localeCompare(b.label));
        case "ECO":
            const seen = new Set();
            currencies = currencies.filter((currency) => {
                const duplicate = seen.has(currency.currency);
                seen.add(currency.currency);
                return !duplicate;
            });
            return currencies
                .map((currency) => ({
                value: currency.currency,
                label: `${currency.currency} - ${currency.name}`,
                icon: currency.icon,
            }))
                .sort((a, b) => a.label.localeCompare(b.label));
        default:
            throw (0, error_1.createError)(400, "Invalid wallet type");
    }
}
async function handleWithdraw(walletType, userId) {
    const wallets = await db_1.models.wallet.findAll({
        where: { userId, type: walletType, balance: { [sequelize_1.Op.gt]: 0 } },
    });
    if (!wallets.length)
        throw (0, error_1.createError)(404, `No ${walletType} wallets found to withdraw from`);
    const currencies = wallets
        .map((wallet) => ({
        value: wallet.currency,
        label: `${wallet.currency} - ${wallet.balance}`,
    }))
        .sort((a, b) => a.label.localeCompare(b.label));
    return currencies;
}
async function handleTransfer(walletType, targetWalletType, userId) {
    const fromWallets = await db_1.models.wallet.findAll({
        where: { userId, type: walletType, balance: { [sequelize_1.Op.gt]: 0 } },
    });
    if (!fromWallets.length)
        throw (0, error_1.createError)(404, `No ${walletType} wallets found to transfer from`);
    const currencies = fromWallets
        .map((wallet) => ({
        value: wallet.currency,
        label: `${wallet.currency} - ${wallet.balance}`,
    }))
        .sort((a, b) => a.label.localeCompare(b.label));
    let targetCurrencies = [];
    switch (targetWalletType) {
        case "FIAT":
            const fiatCurrencies = await db_1.models.currency.findAll({
                where: { status: true },
            });
            targetCurrencies = fiatCurrencies
                .map((currency) => ({
                value: currency.id,
                label: `${currency.id} - ${currency.name}`,
            }))
                .sort((a, b) => a.label.localeCompare(b.label));
            break;
        case "SPOT":
            const spotCurrencies = await db_1.models.exchangeCurrency.findAll({
                where: { status: true },
            });
            targetCurrencies = spotCurrencies
                .map((currency) => ({
                value: currency.currency,
                label: `${currency.currency} - ${currency.name}`,
            }))
                .sort((a, b) => a.label.localeCompare(b.label));
            break;
        case "ECO":
        case "FUTURES":
            const ecoCurrencies = await db_1.models.ecosystemToken.findAll({
                where: { status: true },
            });
            targetCurrencies = ecoCurrencies
                .map((currency) => ({
                value: currency.currency,
                label: `${currency.currency} - ${currency.name}`,
            }))
                .sort((a, b) => a.label.localeCompare(b.label));
            break;
        default:
            throw (0, error_1.createError)(400, "Invalid wallet type");
    }
    return { from: currencies, to: targetCurrencies };
}
