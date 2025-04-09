"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeCustodialWallet = exports.metadata = void 0;
// /api/admin/ecosystem/custodialWallets/store.post.ts
const utils_1 = require("../master/utils");
const db_1 = require("@b/db");
const ethers_1 = require("ethers");
exports.metadata = {
    summary: "Stores a new Ecosystem Custodial Wallet",
    operationId: "storeEcosystemCustodialWallet",
    tags: ["Admin", "Ecosystem Custodial Wallets"],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        masterWalletId: {
                            type: "string",
                            description: "Master wallet ID associated with the custodial wallet",
                        },
                    },
                    required: ["masterWalletId"],
                },
            },
        },
    },
    responses: {
        200: {
            description: "Ecosystem custodial wallet created successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            message: {
                                type: "string",
                                description: "Success message",
                            },
                        },
                    },
                },
            },
        },
    },
    requiresAuth: true,
    permission: "Access Ecosystem Custodial Wallet Management",
};
exports.default = async (data) => {
    const { body } = data;
    const { masterWalletId } = body;
    try {
        const wallet = await db_1.models.ecosystemMasterWallet.findByPk(masterWalletId);
        if (!wallet) {
            throw new Error(`Master wallet not found`);
        }
        const contractAddress = await (0, utils_1.deployCustodialContract)(wallet);
        if (!contractAddress) {
            throw new Error("Failed to deploy custodial wallet contract");
        }
        await storeCustodialWallet(wallet.id, wallet.chain, contractAddress);
        return {
            message: "Ecosystem custodial wallet created successfully",
        };
    }
    catch (error) {
        if ((0, ethers_1.isError)(error, "INSUFFICIENT_FUNDS")) {
            // Handle insufficient funds
            console.error("Insufficient funds for transaction");
        }
        // General error logging
        console.error(`Failed to deploy custodial wallet contract: ${error.message}`);
        throw new Error(error.message);
    }
};
async function storeCustodialWallet(walletId, chain, contractAddress) {
    return await db_1.models.ecosystemCustodialWallet.create({
        masterWalletId: walletId,
        address: contractAddress,
        network: process.env[`${chain}_NETWORK`],
        chain: chain,
        status: "ACTIVE",
    });
}
exports.storeCustodialWallet = storeCustodialWallet;
