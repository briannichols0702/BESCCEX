"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactionsController = exports.metadata = void 0;
const transactions_1 = require("@b/utils/eco/transactions");
const error_1 = require("@b/utils/error");
exports.metadata = {
    summary: "Retrieves transactions for a specific address on a chain",
    description: "Fetches all transactions associated with a specific address on a blockchain.",
    operationId: "getTransactions",
    tags: ["Admin", "Blockchain", "Transactions"],
    parameters: [
        {
            name: "chain",
            in: "path",
            required: true,
            schema: { type: "string", description: "Blockchain chain identifier" },
        },
        {
            name: "address",
            in: "path",
            required: true,
            schema: { type: "string", description: "Blockchain address" },
        },
    ],
    responses: {
        200: {
            description: "Transactions retrieved successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                txid: { type: "string", description: "Transaction ID" },
                                from: { type: "string", description: "Sender address" },
                                to: { type: "string", description: "Receiver address" },
                                amount: { type: "number", description: "Amount transferred" },
                                timestamp: {
                                    type: "number",
                                    description: "Timestamp of the transaction",
                                },
                            },
                        },
                    },
                },
            },
        },
        500: {
            description: "Failed to retrieve transactions",
        },
    },
    permission: "Access Ecosystem Master Wallet Management",
};
const getTransactionsController = async (data) => {
    const { params } = data;
    try {
        const { chain, address } = params;
        return await (0, transactions_1.fetchEcosystemTransactions)(chain, address);
    }
    catch (error) {
        throw (0, error_1.createError)({
            statusCode: 500,
            message: `Failed to fetch transactions: ${error.message}`,
        });
    }
};
exports.getTransactionsController = getTransactionsController;
