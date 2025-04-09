"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("./utils");
const error_1 = require("@b/utils/error");
exports.metadata = {
    summary: "Retrieves details of a specific wallet",
    description: "Fetches detailed information about a specific wallet based on its unique identifier.",
    operationId: "getWallet",
    tags: ["Finance", "Wallets"],
    requiresAuth: true,
    parameters: [
        {
            in: "query",
            name: "type",
            required: true,
            schema: {
                type: "string",
                enum: ["ECO", "SPOT"],
            },
            description: "The type of wallet to retrieve",
        },
        {
            in: "query",
            name: "currency",
            required: true,
            schema: {
                type: "string",
            },
            description: "The currency of the wallet to retrieve",
        },
        {
            in: "query",
            name: "pair",
            required: true,
            schema: {
                type: "string",
            },
            description: "The pair of the wallet to retrieve",
        },
    ],
    responses: {
        200: {
            description: "Wallet details retrieved successfully",
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("Wallet"),
        500: query_1.serverErrorResponse,
    },
};
exports.default = async (data) => {
    const { user, query } = data;
    if (!user)
        throw (0, error_1.createError)({ statusCode: 401, message: "Unauthorized" });
    const { type, currency, pair } = query;
    let CURRENCY = 0;
    let PAIR = 0;
    try {
        CURRENCY = (await (0, utils_1.getWallet)(user.id, type, currency)).balance || 0;
    }
    catch (error) { }
    try {
        PAIR = (await (0, utils_1.getWallet)(user.id, type, pair)).balance || 0;
    }
    catch (error) { }
    return { CURRENCY, PAIR };
};
