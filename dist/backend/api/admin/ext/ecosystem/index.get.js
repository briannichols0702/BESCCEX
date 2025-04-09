"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkChainEnvVariables = exports.metadata = void 0;
const encrypt_1 = require("@b/utils/encrypt");
const query_1 = require("@b/utils/query");
const db_1 = require("@b/db"); // Assuming models are imported for database access
const sequelize_1 = require("sequelize");
exports.metadata = {
    summary: "Get ecosystem blockchains information",
    operationId: "getEcosystemBlockchains",
    tags: ["Admin", "Ecosystem", "Blockchains"],
    responses: {
        200: {
            description: "Ecosystem blockchains information",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            baseChains: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        chain: { type: "string" },
                                        info: {
                                            type: "object",
                                            properties: {
                                                network: { type: "string" },
                                                nodeProvider: { type: "string" },
                                                rpc: { type: "boolean" },
                                                rpcWss: { type: "boolean" },
                                                explorerApi: { type: "boolean" },
                                            },
                                        },
                                    },
                                },
                            },
                            extendedChains: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        chain: { type: "string" },
                                        info: {
                                            type: "object",
                                            properties: {
                                                network: { type: "string" },
                                                license: { type: "string" },
                                                status: { type: "boolean" }, // Indicates if chain is active from DB
                                            },
                                        },
                                    },
                                },
                            },
                            isUnlockedVault: { type: "boolean" },
                        },
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("Ecosystem Blockchains"),
        500: query_1.serverErrorResponse,
    },
    requiresAuth: true,
    permission: "Access Ecosystem Management",
};
exports.default = async (data) => {
    try {
        const { utxoChains, evmChains } = await checkChainEnvVariables();
        const extendedChains = await fetchExtendedChainsStatus();
        const isUnlockedVault = (0, encrypt_1.isUnlockedEcosystemVault)();
        return {
            baseChains: utxoChains
                .map((chain) => ({
                chain: chain.chain,
                info: chain.info,
            }))
                .concat(evmChains.map((chain) => ({
                chain: chain.chain,
                info: chain.info,
            }))),
            extendedChains: extendedChains.map((chain) => ({
                chain: chain.chain,
                info: chain.info,
            })),
            isUnlockedVault,
        };
    }
    catch (error) {
        throw new Error(`Failed to fetch ecosystem blockchains: ${error.message}`);
    }
};
async function checkChainEnvVariables() {
    const utxoChains = ["BTC", "LTC", "DOGE", "DASH"].map((chain) => {
        const network = process.env[`${chain}_NETWORK`] || "mainnet";
        const nodeProvider = process.env[`${chain}_NODE`] || "blockcypher";
        return {
            chain,
            info: {
                network,
                nodeProvider,
            },
        };
    });
    const evmChains = [
        "ETH",
        "BSC",
        "POLYGON",
        "FTM",
        "OPTIMISM",
        "ARBITRUM",
        "BASE",
        "CELO",
    ].map((chain) => {
        const network = process.env[`${chain}_NETWORK`] || "";
        const rpc = process.env[`${chain}_${network.toUpperCase()}_RPC`];
        const rpcWss = process.env[`${chain}_${network.toUpperCase()}_RPC_WSS`];
        const explorerApi = process.env[`${chain}_EXPLORER_API_KEY`];
        return {
            chain,
            info: {
                network,
                rpc: !!rpc,
                rpcWss: !!rpcWss,
                explorerApi: !!explorerApi,
            },
        };
    });
    return { utxoChains, evmChains };
}
exports.checkChainEnvVariables = checkChainEnvVariables;
// New function to fetch extended chains' data in one database call
async function fetchExtendedChainsStatus() {
    const extendedChainNames = ["SOL", "TRON", "XMR", "TON", "MO"]; // List of extended chains
    const networks = {
        SOL: process.env.SOL_NETWORK || "mainnet",
        TRON: process.env.TRON_NETWORK || "mainnet",
        XMR: process.env.XMR_NETWORK || "mainnet",
        TON: process.env.TON_NETWORK || "mainnet",
        MO: process.env.MO_NETWORK || "mainnet",
    };
    // Fetch data for all extended chains at once using Op.in
    const blockchains = await db_1.models.ecosystemBlockchain.findAll({
        where: {
            chain: { [sequelize_1.Op.in]: extendedChainNames },
        },
    });
    // Map each blockchain result to its configuration with dynamic fields
    return extendedChainNames.map((chain) => {
        const blockchain = blockchains.find((b) => b.chain === chain);
        const network = networks[chain];
        const rpc = process.env[`${chain}_${network.toUpperCase()}_RPC`];
        const rpcWss = process.env[`${chain}_${network.toUpperCase()}_RPC_WSS`];
        return {
            chain,
            info: {
                network,
                rpc: !!rpc,
                rpcWss: !!rpcWss,
                explorerApi: ["MO", "TON"].includes(chain) ? false : true,
                status: (blockchain === null || blockchain === void 0 ? void 0 : blockchain.status) || false,
                version: blockchain === null || blockchain === void 0 ? void 0 : blockchain.version,
                productId: blockchain === null || blockchain === void 0 ? void 0 : blockchain.productId,
            },
        };
    });
}
