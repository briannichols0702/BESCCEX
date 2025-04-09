"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Updates the status of a wallet transaction",
    operationId: "updateWalletTransactionStatus",
    tags: ["Admin", "Wallet Transactions"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            required: true,
            description: "ID of the wallet transaction to update",
            schema: { type: "string" },
        },
    ],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        status: {
                            type: "string",
                            description: "New status to apply",
                            enum: [
                                "COMPLETED",
                                "FAILED",
                                "CANCELLED",
                                "EXPIRED",
                                "REJECTED",
                                "REFUNDED",
                                "FROZEN",
                                "PROCESSING",
                                "TIMEOUT",
                            ],
                        },
                    },
                    required: ["status"],
                },
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("Wallet Transaction"),
    requiresAuth: true,
    permission: "Access Transaction Management",
};
exports.default = async (data) => {
    const { body, params } = data;
    const { id } = params;
    const { status } = body;
    return (0, query_1.updateStatus)("transaction", id, status);
};
