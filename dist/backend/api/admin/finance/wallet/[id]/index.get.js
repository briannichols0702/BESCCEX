"use strict";
// /server/api/admin/wallets/show.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils"); // Assuming the schema is in a separate file.
const db_1 = require("@b/db");
exports.metadata = {
    summary: "Retrieves a specific wallet by UUID",
    operationId: "getWalletByUuid",
    tags: ["Admin", "Wallets"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            required: true,
            description: "ID of the wallet to retrieve",
            schema: { type: "string" },
        },
    ],
    responses: {
        200: {
            description: "Wallet information",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: utils_1.walletSchema,
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("Wallet"),
        500: query_1.serverErrorResponse,
    },
    requiresAuth: true,
    permission: "Access Wallet Management",
};
exports.default = async (data) => {
    const { params } = data;
    return await (0, query_1.getRecord)("wallet", params.id, [
        {
            model: db_1.models.user,
            as: "user",
            attributes: ["firstName", "lastName", "email", "avatar"],
        },
        {
            model: db_1.models.transaction,
            as: "transactions",
            attributes: [
                "id",
                "type",
                "amount",
                "fee",
                "status",
                "createdAt",
                "metadata",
            ],
        },
    ]);
};
