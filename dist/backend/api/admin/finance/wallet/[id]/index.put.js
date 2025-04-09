"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
// /api/admin/wallets/[id]/update.put.ts
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
exports.metadata = {
    summary: "Updates an existing wallet",
    operationId: "updateWallet",
    tags: ["Admin", "Wallets"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            description: "The ID of the wallet to update",
            required: true,
            schema: {
                type: "string",
            },
        },
    ],
    requestBody: {
        required: true,
        description: "Updated data for the wallet",
        content: {
            "application/json": {
                schema: utils_1.walletUpdateSchema,
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("Wallet"),
    requiresAuth: true,
    permission: "Access Wallet Management",
};
exports.default = async (data) => {
    const { body, params } = data;
    const { id } = params;
    const { type, currency, balance, inOrder, status } = body;
    return await (0, query_1.updateRecord)("wallet", id, {
        type,
        currency,
        balance,
        inOrder,
        status,
    });
};
