"use strict";
// /api/admin/ecosystem/masterWallets/store.post.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("./utils");
const chains_1 = require("@b/utils/eco/chains");
const schema_1 = require("@b/utils/schema");
const wallet_1 = require("@b/utils/eco/wallet");
exports.metadata = {
    summary: "Stores a new Ecosystem Master Wallet",
    operationId: "storeEcosystemMasterWallet",
    tags: ["Admin", "Ecosystem Master Wallets"],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        chain: (0, schema_1.baseStringSchema)("Blockchain chain associated with the master wallet", 255),
                    },
                    required: ["chain"],
                },
            },
        },
    },
    responses: (0, query_1.storeRecordResponses)(utils_1.ecosystemMasterWalletStoreSchema, "Ecosystem Master Wallet"),
    requiresAuth: true,
    permission: "Access Ecosystem Master Wallet Management",
};
exports.default = async (data) => {
    const { body } = data;
    const { chain } = body;
    const existingWallet = await (0, wallet_1.getMasterWalletByChain)(chain);
    if (existingWallet) {
        throw new Error(`Master wallet already exists: ${chain}`);
    }
    const walletData = await (0, utils_1.createAndEncryptWallet)(chain);
    return await (0, utils_1.createMasterWallet)(walletData, chains_1.chainConfigs[chain].currency);
};
