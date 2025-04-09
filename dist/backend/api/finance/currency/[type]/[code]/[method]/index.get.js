"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleNetworkMappingReverse = exports.handleNetworkMapping = exports.metadata = void 0;
const exchange_1 = __importDefault(require("@b/utils/exchange"));
// /server/api/currencies/show.get.ts
const utils_1 = require("../../../utils");
const query_1 = require("@b/utils/query");
const error_1 = require("@b/utils/error");
const utils_2 = require("@b/api/exchange/utils");
exports.metadata = {
    summary: "Retrieves a single currency by its ID",
    description: "This endpoint retrieves a single currency by its ID.",
    operationId: "getCurrencyById",
    tags: ["Finance", "Currency"],
    requiresAuth: true,
    parameters: [
        {
            index: 0,
            name: "type",
            in: "path",
            required: true,
            schema: {
                type: "string",
                enum: ["SPOT"],
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
        {
            index: 2,
            name: "method",
            in: "path",
            required: false,
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
    const { user, params } = data;
    if (!(user === null || user === void 0 ? void 0 : user.id))
        throw (0, error_1.createError)(401, "Unauthorized");
    const { type, code, method } = params;
    if (!type || !code)
        throw (0, error_1.createError)(400, "Invalid type or code");
    if (type !== "SPOT")
        throw (0, error_1.createError)(400, "Invalid type");
    const exchange = await exchange_1.default.startExchange();
    const provider = await exchange_1.default.getProvider();
    if (!exchange)
        throw (0, error_1.createError)(500, "Exchange not found");
    try {
        if (exchange.has["fetchDepositAddressesByNetwork"]) {
            const depositAddress = await exchange.fetchDepositAddressesByNetwork(code, method);
            if (!depositAddress)
                throw (0, error_1.createError)(404, "Currency not found");
            return { ...depositAddress[method], trx: true };
        }
        else if (exchange.has["fetchDepositAddresses"]) {
            const depositAddresses = await exchange.fetchDepositAddresses(code);
            if (!depositAddresses)
                throw (0, error_1.createError)(404, "Currency not found");
            return { ...depositAddresses[method], trx: true };
        }
        else if (exchange.has["fetchDepositAddress"]) {
            let network = method;
            if (provider === "xt") {
                network = handleNetworkMapping(network);
            }
            const depositAddress = await exchange.fetchDepositAddress(code, {
                network,
            });
            if (!depositAddress)
                throw (0, error_1.createError)(404, "Currency not found");
            return { ...depositAddress, trx: true };
        }
    }
    catch (error) {
        const message = (0, utils_2.sanitizeErrorMessage)(error.message);
        throw (0, error_1.createError)(404, message);
    }
    throw (0, error_1.createError)(404, "Method not found");
};
function handleNetworkMapping(network) {
    switch (network) {
        case "TRON":
            return "TRX";
        case "ETH":
            return "ERC20";
        case "BSC":
            return "BEP20";
        case "POLYGON":
            return "MATIC";
        default:
            return network;
    }
}
exports.handleNetworkMapping = handleNetworkMapping;
function handleNetworkMappingReverse(network) {
    switch (network) {
        case "TRX":
            return "TRON";
        case "ERC20":
            return "ETH";
        case "BEP20":
            return "BSC";
        case "MATIC":
            return "POLYGON";
        default:
            return network;
    }
}
exports.handleNetworkMappingReverse = handleNetworkMappingReverse;
