"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
exports.metadata = {
    summary: "Updates a specific master wallet",
    operationId: "updateEcosystemMasterWallet",
    tags: ["Admin", "Ecosystem", "Master Wallets"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            description: "ID of the master wallet to update",
            required: true,
            schema: {
                type: "string",
            },
        },
    ],
    requestBody: {
        description: "New data for the master wallet",
        content: {
            "application/json": {
                schema: utils_1.ecosystemMasterWalletUpdateSchema,
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("Master Wallet"),
    requiresAuth: true,
    permission: "Access Ecosystem Master Wallet Management",
};
exports.default = async (data) => {
    const { body, params } = data;
    const { id } = params;
    const { chain, currency, address, balance, data: walletData, status, lastIndex, } = body;
    return await (0, query_1.updateRecord)("ecosystemMasterWallet", id, {
        chain,
        currency,
        address,
        balance,
        data: walletData,
        status,
        lastIndex,
    });
};
