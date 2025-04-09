"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
// /server/api/wallets/fiat/customDeposit.post.ts
const exchange_1 = __importDefault(require("@b/utils/exchange"));
const db_1 = require("@b/db");
const query_1 = require("@b/utils/query");
const error_1 = require("@b/utils/error");
const index_get_1 = require("../../currency/[type]/[code]/[method]/index.get");
exports.metadata = {
    summary: "Initiates a spot deposit transaction",
    description: "This endpoint initiates a spot deposit transaction for the user",
    operationId: "initiateSpotDeposit",
    tags: ["Finance", "Deposit"],
    requiresAuth: true,
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        currency: { type: "string" },
                        chain: { type: "string" },
                        trx: { type: "string" },
                    },
                    required: ["currency", "chain", "trx"],
                },
            },
        },
    },
    responses: {
        200: {
            description: "Spot deposit transaction initiated successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            message: {
                                type: "string",
                                description: "Success message",
                            },
                        },
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("Deposit Method"),
        500: query_1.serverErrorResponse,
    },
};
exports.default = async (data) => {
    const { user, body } = data;
    if (!(user === null || user === void 0 ? void 0 : user.id))
        throw (0, error_1.createError)({ statusCode: 401, message: "Unauthorized" });
    const { currency, chain, trx } = body;
    const provider = await exchange_1.default.getProvider();
    const parsedChain = provider === "xt" ? (0, index_get_1.handleNetworkMappingReverse)(chain) : chain;
    const userPk = await db_1.models.user.findByPk(user.id);
    if (!userPk)
        throw (0, error_1.createError)({ statusCode: 404, message: "User not found" });
    const existingTransaction = await db_1.models.transaction.findOne({
        where: { referenceId: trx, type: "DEPOSIT" },
    });
    if (existingTransaction) {
        throw (0, error_1.createError)({
            statusCode: 400,
            message: "Transaction already exists",
        });
    }
    let wallet = await db_1.models.wallet.findOne({
        where: { userId: user.id, currency: currency, type: "SPOT" },
    });
    if (!wallet) {
        wallet = await db_1.models.wallet.create({
            userId: user.id,
            currency: currency,
            type: "SPOT",
            status: true,
        });
    }
    const currencyData = await db_1.models.exchangeCurrency.findOne({
        where: { currency },
    });
    if (!currencyData) {
        throw (0, error_1.createError)({
            statusCode: 404,
            message: "Currency not found",
        });
    }
    const transaction = await db_1.models.transaction.create({
        userId: user.id,
        walletId: wallet.id,
        type: "DEPOSIT",
        amount: 0,
        status: "PENDING",
        description: `${currency} deposit transaction initiated`,
        metadata: JSON.stringify({ currency, chain: parsedChain, trx }),
        referenceId: trx,
    });
    return {
        transaction,
        currency: wallet.currency,
        chain: parsedChain,
        trx: trx,
        method: "SPOT",
    };
};
