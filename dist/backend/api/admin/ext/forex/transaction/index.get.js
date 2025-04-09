"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const query_1 = require("@b/utils/query");
const constants_1 = require("@b/utils/constants");
exports.metadata = {
    summary: "List all Forex transactions",
    description: "Retrieves a paginated list of all Forex transactions processed.",
    operationId: "getForexTransactions",
    tags: ["Admin", "Forex"],
    parameters: [
        ...constants_1.crudParameters, // Includes pagination and filtering parameters
        {
            name: "type",
            in: "query",
            description: "Filter by transaction type",
            schema: {
                type: "string",
                enum: ["FOREX_DEPOSIT", "FOREX_WITHDRAW"],
            },
        },
    ],
    responses: {
        200: {
            description: "Forex transactions retrieved successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            data: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        id: { type: "number", description: "Transaction ID" },
                                        type: { type: "string", description: "Transaction type" },
                                        amount: {
                                            type: "number",
                                            description: "Amount transacted",
                                        },
                                        currency: { type: "string", description: "Currency used" },
                                        user: {
                                            type: "object",
                                            properties: {
                                                firstName: {
                                                    type: "string",
                                                    description: "User's first name",
                                                },
                                                lastName: {
                                                    type: "string",
                                                    description: "User's last name",
                                                },
                                                id: { type: "string", description: "User identifier" },
                                                avatar: { type: "string", description: "User avatar" },
                                            },
                                        },
                                        wallet: {
                                            type: "object",
                                            properties: {
                                                id: {
                                                    type: "string",
                                                    description: "Wallet identifier",
                                                },
                                                currency: {
                                                    type: "string",
                                                    description: "Wallet currency",
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                            pagination: constants_1.paginationSchema,
                        },
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("Transactions"),
        500: query_1.serverErrorResponse,
    },
    requiresAuth: true,
    permission: "Access Forex Signal Management",
};
exports.default = async (data) => {
    const { query } = data;
    return (0, query_1.getFiltered)({
        model: db_1.models.transaction,
        query,
        sortField: query.sortField || "createdAt",
        customFilterHandler: (filters) => {
            // Parse and handle custom filters if necessary
            if (filters.type) {
                filters.type = (0, query_1.parseFilterParam)(filters.type, [
                    "FOREX_DEPOSIT",
                    "FOREX_WITHDRAW",
                ]);
            }
            return filters;
        },
        includeModels: [
            {
                model: db_1.models.user,
                as: "user",
                attributes: ["firstName", "lastName", "id", "avatar"],
            },
            {
                model: db_1.models.wallet,
                as: "wallet",
                attributes: ["id", "currency"],
            },
        ],
    });
};
