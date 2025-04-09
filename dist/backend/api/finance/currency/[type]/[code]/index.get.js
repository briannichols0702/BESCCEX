"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const exchange_1 = __importDefault(require("@b/utils/exchange"));
// /server/api/currencies/show.get.ts
const utils_1 = require("../../utils");
const query_1 = require("@b/utils/query");
const error_1 = require("@b/utils/error");
const db_1 = require("@b/db");
const sequelize_1 = require("sequelize");
exports.metadata = {
    summary: "Retrieves a single currency by its ID",
    description: "This endpoint retrieves a single currency by its ID.",
    operationId: "getCurrencyById",
    tags: ["Finance", "Currency"],
    requiresAuth: true,
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
            index: 0,
            name: "type",
            in: "path",
            required: true,
            schema: {
                type: "string",
                enum: ["FIAT", "SPOT", "ECO"],
            },
        },
        {
            index: 1,
            name: "code",
            in: "path",
            required: true,
            schema: {
                type: "string",
            },
        },
    ],
    responses: {
        200: {
            description: "Currency retrieved successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            ...utils_1.baseResponseSchema,
                            data: {
                                type: "object",
                                properties: utils_1.baseCurrencySchema,
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
exports.default = async (data) => {
    const { user, params, query } = data;
    if (!(user === null || user === void 0 ? void 0 : user.id))
        throw (0, error_1.createError)(401, "Unauthorized");
    const { action } = query;
    const { type, code } = params;
    if (!type || !code)
        throw (0, error_1.createError)(400, "Invalid type or code");
    switch (action) {
        case "deposit":
            return handleDeposit(type, code);
        case "withdraw":
            return handleWithdraw(type, code);
        default:
            throw (0, error_1.createError)(400, "Invalid action");
    }
};
async function handleDeposit(type, code) {
    switch (type) {
        case "FIAT":
            const gateways = await db_1.models.depositGateway.findAll({
                where: {
                    status: true,
                    [sequelize_1.Op.and]: sequelize_1.Sequelize.literal(`JSON_CONTAINS(currencies, '"${code}"')`),
                },
            });
            const methods = await db_1.models.depositMethod.findAll({
                where: { status: true },
            });
            return { gateways, methods };
        case "SPOT":
            const exchange = await exchange_1.default.startExchange();
            const provider = await exchange_1.default.getProvider();
            if (!exchange)
                throw (0, error_1.createError)(500, "Exchange not found");
            const currencies = await exchange.fetchCurrencies();
            let currency = undefined;
            switch (provider) {
                case "xt":
                    currency = Object.values(currencies).find((c) => c.code === code);
                    break;
                default:
                    currency = Object.values(currencies).find((c) => c.id === code);
                    break;
            }
            if (!currency)
                throw (0, error_1.createError)(404, "Currency not found");
            if (!currency.active)
                throw (0, error_1.createError)(400, "Withdrawal not enabled for this currency");
            switch (provider) {
                case "binance":
                case "kucoin":
                    if (!currency.networks ||
                        typeof currency.networks !== "object" ||
                        !Object.keys(currency.networks).length) {
                        throw (0, error_1.createError)(400, "Networks data is missing or invalid");
                    }
                    return Object.values(currency.networks)
                        .filter((network) => network.active && network.deposit)
                        .map((network) => ({
                        id: network.id,
                        chain: network.network || network.name,
                        fee: network.fee,
                        precision: network.precision,
                        limits: network.limits,
                    }))
                        .sort((a, b) => a.chain.localeCompare(b.chain));
                case "kraken":
                    const depositMethods = await exchange.fetchDepositMethods(code);
                    return depositMethods;
                case "xt":
                    if (!currency.networks ||
                        typeof currency.networks !== "object" ||
                        !Object.keys(currency.networks).length) {
                        throw (0, error_1.createError)(400, "Networks data is missing or invalid");
                    }
                    return Object.values(currency.networks)
                        .filter((network) => network.active && network.deposit)
                        .map((network) => ({
                        id: network.id,
                        chain: network.network || network.name,
                        fee: network.fee,
                        precision: network.precision,
                        limits: network.limits,
                    }))
                        .sort((a, b) => a.chain.localeCompare(b.chain));
                default:
                    break;
            }
        case "ECO":
            const tokens = await db_1.models.ecosystemToken.findAll({
                where: { status: true, currency: code },
                attributes: [
                    "name",
                    "chain",
                    "icon",
                    "limits",
                    "fee",
                    "type",
                    "contractType",
                ],
                order: [["chain", "ASC"]],
            });
            return tokens;
        default:
            throw (0, error_1.createError)(400, "Invalid wallet type");
    }
}
async function handleWithdraw(type, code) {
    switch (type) {
        case "FIAT":
            const methods = await db_1.models.withdrawMethod.findAll({
                where: { status: true },
            });
            return { methods };
        case "SPOT":
            const exchange = await exchange_1.default.startExchange();
            const provider = await exchange_1.default.getProvider();
            if (!exchange)
                throw (0, error_1.createError)(500, "Exchange not found");
            const currencyData = await db_1.models.exchangeCurrency.findOne({
                where: { currency: code, status: true },
            });
            if (!currencyData) {
                throw new Error("Currency not found");
            }
            const percentageFee = currencyData.fee || 0;
            const currencies = await exchange.fetchCurrencies();
            let currency = undefined;
            switch (provider) {
                case "xt":
                    currency = Object.values(currencies).find((c) => c.code === code);
                    break;
                default:
                    currency = Object.values(currencies).find((c) => c.id === code);
                    break;
            }
            if (!currency)
                throw (0, error_1.createError)(404, "Currency not found");
            if (!currency.active)
                throw (0, error_1.createError)(400, "Withdrawal not enabled for this currency");
            if (!currency.networks ||
                typeof currency.networks !== "object" ||
                !Object.keys(currency.networks).length) {
                throw (0, error_1.createError)(400, "Networks data is missing or invalid");
            }
            return Object.values(currency.networks)
                .filter((network) => network.active && network.withdraw)
                .map((network) => {
                var _a;
                return ({
                    id: network.id,
                    chain: network.network || network.name,
                    fixedFee: network.fee || ((_a = network.fees) === null || _a === void 0 ? void 0 : _a.withdraw) || 0,
                    percentageFee: percentageFee,
                    precision: network.precision,
                    limits: network.limits,
                });
            })
                .sort((a, b) => a.chain.localeCompare(b.chain));
        case "ECO":
            const tokens = await db_1.models.ecosystemToken.findAll({
                where: { status: true, currency: code },
                attributes: ["name", "chain", "icon", "limits", "fee", "type"],
                order: [["chain", "ASC"]],
            });
            return tokens.map((token) => ({
                ...token.get({ plain: true }),
                fee: typeof token.fee === "string" ? JSON.parse(token.fee) : token.fee,
                limits: typeof token.limits === "string"
                    ? JSON.parse(token.limits)
                    : token.limits,
            }));
        default:
            throw (0, error_1.createError)(400, "Invalid wallet type");
    }
}
