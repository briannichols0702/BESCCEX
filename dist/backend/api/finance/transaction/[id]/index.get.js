"use strict";
// /server/api/wallets/transactions/show.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactionByRefId = exports.getTransaction = exports.metadata = void 0;
const error_1 = require("@b/utils/error");
const db_1 = require("@b/db");
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Retrieves details of a specific transaction by reference ID",
    description: "Fetches detailed information about a specific transaction based on its unique reference ID.",
    operationId: "getTransaction",
    tags: ["Finance", "Transactions"],
    requiresAuth: true,
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            required: true,
            description: "The UUID of the transaction to retrieve",
            schema: { type: "string" },
        },
    ],
    responses: {
        200: {
            description: "Transaction details retrieved successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            id: {
                                type: "string",
                                description: "ID of the transaction",
                            },
                            userId: {
                                type: "string",
                                description: "ID of the user who created the transaction",
                            },
                            walletId: {
                                type: "string",
                                description: "ID of the wallet associated with the transaction",
                            },
                            type: {
                                type: "string",
                                description: "Type of the transaction",
                            },
                            status: {
                                type: "string",
                                description: "Status of the transaction",
                            },
                            amount: {
                                type: "number",
                                description: "Amount of the transaction",
                            },
                            fee: {
                                type: "number",
                                description: "Fee charged for the transaction",
                            },
                            description: {
                                type: "string",
                                description: "Description of the transaction",
                            },
                            metadata: {
                                type: "object",
                                description: "Metadata of the transaction",
                            },
                            referenceId: {
                                type: "string",
                                description: "Reference ID of the transaction",
                            },
                            createdAt: {
                                type: "string",
                                description: "Date and time when the transaction was created",
                            },
                            updatedAt: {
                                type: "string",
                                description: "Date and time when the transaction was last updated",
                            },
                            wallet: {
                                type: "object",
                                properties: {
                                    id: {
                                        type: "string",
                                        description: "ID of the wallet",
                                    },
                                    userId: {
                                        type: "string",
                                        description: "ID of the user who owns the wallet",
                                    },
                                    currency: {
                                        type: "string",
                                        description: "Currency of the wallet",
                                    },
                                    type: {
                                        type: "string",
                                        description: "Type of the wallet",
                                    },
                                    balance: {
                                        type: "number",
                                        description: "Current balance of the wallet",
                                    },
                                    createdAt: {
                                        type: "string",
                                        description: "Date and time when the wallet was created",
                                    },
                                    updatedAt: {
                                        type: "string",
                                        description: "Date and time when the wallet was last updated",
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("Transaction"),
        500: query_1.serverErrorResponse,
    },
};
exports.default = async (data) => {
    return getTransaction(data.params.id);
};
async function getTransaction(id) {
    const response = await db_1.models.transaction.findByPk(id, {
        include: [
            {
                model: db_1.models.wallet,
                as: "wallet",
                attributes: ["currency", "type"],
            },
            {
                model: db_1.models.user,
                as: "user",
                attributes: ["firstName", "lastName", "email", "avatar"],
            },
        ],
    });
    if (!response) {
        throw (0, error_1.createError)({
            statusCode: 404,
            message: "Transaction not found",
        });
    }
    return response.get({ plain: true });
}
exports.getTransaction = getTransaction;
async function getTransactionByRefId(refId) {
    const response = await db_1.models.transaction.findOne({
        where: { referenceId: refId },
        include: [
            {
                model: db_1.models.wallet,
                as: "wallet",
                attributes: ["currency", "type"],
            },
            {
                model: db_1.models.user,
                as: "user",
                attributes: ["firstName", "lastName", "email", "avatar"],
            },
        ],
    });
    if (!response) {
        throw (0, error_1.createError)({
            statusCode: 404,
            message: "Transaction not found",
        });
    }
    return response.get({ plain: true });
}
exports.getTransactionByRefId = getTransactionByRefId;
