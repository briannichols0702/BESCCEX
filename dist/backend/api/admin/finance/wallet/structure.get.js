"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.walletStructure = exports.metadata = void 0;
// /api/admin/wallets/structure.get.ts
const constants_1 = require("@b/utils/constants");
const cache_1 = require("@b/utils/cache");
exports.metadata = {
    summary: "Get form structure for wallets",
    operationId: "getWalletsStructure",
    tags: ["Admin", "Wallets"],
    responses: {
        200: {
            description: "Form structure for wallets",
            content: constants_1.structureSchema,
        },
    },
    permission: "Access Wallet Management",
};
const walletStructure = async () => {
    const type = {
        type: "select",
        label: "Wallet Type",
        name: "type",
        options: [
            { value: "FIAT", label: "Fiat" },
            { value: "SPOT", label: "Spot" },
        ],
        placeholder: "Select wallet type",
    };
    const cacheManager = cache_1.CacheManager.getInstance();
    const extensions = await cacheManager.getExtensions();
    if (extensions.has("ecosystem")) {
        type.options.push({ value: "ECO", label: "Funding" });
    }
    const currency = {
        type: "input",
        label: "Currency",
        name: "currency",
        placeholder: "Enter the currency code, e.g., USD",
    };
    const balance = {
        type: "input",
        label: "Balance",
        name: "balance",
        placeholder: "Enter the balance",
        ts: "number",
    };
    const inOrder = {
        type: "input",
        label: "In Order",
        name: "inOrder",
        placeholder: "Enter the amount in order",
        ts: "number",
    };
    const address = {
        type: "json",
        label: "Address",
        name: "address",
        placeholder: '{"btc": "1ExAmpLe0FaBiTcoInAdDress"}',
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
    return {
        type,
        currency,
        balance,
        inOrder,
        address,
        status,
    };
};
exports.walletStructure = walletStructure;
exports.default = async () => {
    const { type, currency, balance, inOrder, address, status } = await (0, exports.walletStructure)();
    return {
        get: [[type, currency], [balance, inOrder], status],
        set: [[type, currency], [balance, inOrder], status],
    };
};
