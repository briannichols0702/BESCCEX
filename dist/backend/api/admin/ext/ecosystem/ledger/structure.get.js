"use strict";
// /api/admin/ecosystemPrivateLedgers/structure.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.ecosystemPrivateLedgerStructure = exports.metadata = void 0;
const constants_1 = require("@b/utils/constants");
const db_1 = require("@b/db");
exports.metadata = {
    summary: "Get form structure for Ecosystem Private Ledgers",
    operationId: "getEcosystemPrivateLedgerStructure",
    tags: ["Admin", "Ecosystem Private Ledgers"],
    responses: {
        200: {
            description: "Form structure for managing Ecosystem Private Ledgers",
            content: constants_1.structureSchema,
        },
    },
    permission: "Access Ecosystem Private Ledger Management",
};
const ecosystemPrivateLedgerStructure = async () => {
    const wallets = await db_1.models.wallet.findAll();
    const walletId = {
        type: "select",
        label: "Wallet",
        name: "walletId",
        options: wallets.map((wallet) => ({
            value: wallet.id,
            label: wallet.currency,
        })),
        placeholder: "Select the associated wallet",
    };
    const index = {
        type: "input",
        label: "Index",
        name: "index",
        placeholder: "Enter the ledger index",
        ts: "number",
    };
    const currency = {
        type: "input",
        label: "Currency",
        name: "currency",
        placeholder: "Enter the currency (e.g., USD, BTC)",
    };
    const chain = {
        type: "input",
        label: "Chain",
        name: "chain",
        placeholder: "Enter the blockchain chain (e.g., Ethereum, Bitcoin)",
    };
    const network = {
        type: "input",
        label: "Network",
        name: "network",
        placeholder: "Enter the network (e.g., mainnet, testnet)",
    };
    const offchainDifference = {
        type: "input",
        label: "Offchain Difference",
        name: "offchainDifference",
        placeholder: "Enter the offchain difference amount",
        ts: "number",
    };
    return {
        walletId,
        index,
        currency,
        chain,
        network,
        offchainDifference,
    };
};
exports.ecosystemPrivateLedgerStructure = ecosystemPrivateLedgerStructure;
exports.default = async () => {
    const { walletId, index, currency, chain, network, offchainDifference } = await (0, exports.ecosystemPrivateLedgerStructure)();
    return {
        get: [walletId, index, currency, chain, network, offchainDifference],
        set: [walletId, index, currency, chain, network, offchainDifference],
    };
};
