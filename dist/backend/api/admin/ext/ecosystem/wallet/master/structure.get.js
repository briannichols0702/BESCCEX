"use strict";
// /api/admin/ecosystemMasterWallets/structure.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.ecosystemMasterWalletStructure = exports.metadata = void 0;
const db_1 = require("@b/db");
const constants_1 = require("@b/utils/constants");
const sequelize_1 = require("sequelize");
exports.metadata = {
    summary: "Get form structure for Ecosystem Master Wallets",
    operationId: "getEcosystemMasterWalletStructure",
    tags: ["Admin", "Ecosystem Master Wallets"],
    responses: {
        200: {
            description: "Form structure for managing Ecosystem Master Wallets",
            content: constants_1.structureSchema,
        },
    },
    permission: "Access Ecosystem Master Wallet Management",
};
const ecosystemMasterWalletStructure = async () => {
    const chains = ["SOL", "TRON", "XMR", "TON", "MO"];
    const blockchainStatuses = await db_1.models.ecosystemBlockchain.findAll({
        where: {
            chain: { [sequelize_1.Op.in]: chains },
        },
    });
    const chainOptions = [
        { value: "ETH", label: "Ethereum" },
        { value: "BSC", label: "Binance Smart Chain" },
        { value: "POLYGON", label: "Polygon" },
        { value: "FTM", label: "Fantom" },
        { value: "OPTIMISM", label: "Optimism" },
        { value: "ARBITRUM", label: "Arbitrum" },
        { value: "BASE", label: "Syscoin" },
        { value: "CELO", label: "Celo" },
        { value: "BTC", label: "Bitcoin" },
        { value: "LTC", label: "Litecoin" },
        { value: "DOGE", label: "Dogecoin" },
        { value: "DASH", label: "Dash" },
    ];
    // Add enabled chains dynamically
    blockchainStatuses.forEach((blockchain) => {
        if (blockchain.status && blockchain.chain) {
            chainOptions.push({
                value: blockchain.chain,
                label: `${blockchain.chain}`,
            });
        }
    });
    const chain = {
        type: "select",
        label: "Blockchain",
        name: "chain",
        options: chainOptions,
        placeholder: "Select the blockchain",
    };
    const currency = {
        type: "input",
        label: "Currency",
        name: "currency",
        placeholder: "Enter the currency (e.g., ETH, BTC)",
    };
    const address = {
        type: "input",
        label: "Wallet Address",
        name: "address",
        placeholder: "Enter the wallet address",
    };
    const balance = {
        type: "input",
        label: "Balance",
        name: "balance",
        placeholder: "Enter the wallet balance",
        ts: "number",
    };
    const data = {
        type: "textarea",
        label: "Data",
        name: "data",
        placeholder: "Enter additional wallet data",
    };
    const status = {
        type: "select",
        label: "Status",
        name: "status",
        options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
        ],
        ts: "boolean",
    };
    const lastIndex = {
        type: "input",
        label: "Last Index",
        name: "lastIndex",
        placeholder: "Enter the last index used",
        ts: "number",
    };
    return {
        chain,
        currency,
        address,
        balance,
        data,
        status,
        lastIndex,
    };
};
exports.ecosystemMasterWalletStructure = ecosystemMasterWalletStructure;
exports.default = async () => {
    const { chain, currency, address, balance, data, status, lastIndex } = await (0, exports.ecosystemMasterWalletStructure)();
    return {
        get: [[chain, currency], address, balance],
        set: [chain],
    };
};
