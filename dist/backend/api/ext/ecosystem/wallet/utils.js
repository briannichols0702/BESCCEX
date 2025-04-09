"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActiveCustodialWallets = exports.unlockExpiredAddresses = exports.unlockAddress = exports.isAddressLocked = exports.lockAddress = exports.baseWalletSchema = exports.baseTransactionSchema = void 0;
const db_1 = require("@b/db");
const schema_1 = require("@b/utils/schema");
exports.baseTransactionSchema = {
    id: (0, schema_1.baseStringSchema)("Transaction ID"),
    type: (0, schema_1.baseStringSchema)("Transaction type"),
    status: (0, schema_1.baseStringSchema)("Transaction status"),
    amount: (0, schema_1.baseNumberSchema)("Transaction amount"),
    fee: (0, schema_1.baseNumberSchema)("Transaction fee"),
    description: (0, schema_1.baseStringSchema)("Transaction description"),
    metadata: {
        type: "object",
        description: "Additional metadata for the transaction",
        // Define specific properties if necessary
    },
    referenceId: (0, schema_1.baseStringSchema)("Reference ID"),
    createdAt: (0, schema_1.baseStringSchema)("Creation time of the transaction", undefined, undefined, false, "date-time"),
};
exports.baseWalletSchema = {
    id: (0, schema_1.baseStringSchema)("Wallet ID"),
    type: (0, schema_1.baseStringSchema)("Wallet type"),
    currency: (0, schema_1.baseStringSchema)("Wallet currency"),
    balance: (0, schema_1.baseNumberSchema)("Wallet balance"),
    transactions: {
        type: "array",
        description: "List of transactions",
        items: {
            type: "object",
            properties: exports.baseTransactionSchema,
            nullable: true,
        },
    },
    address: {
        type: "array",
        description: "Wallet addresses",
        items: (0, schema_1.baseStringSchema)("Wallet address"),
        nullable: true,
    },
};
// In-memory cache for locked addresses
const lockedAddressesCache = new Map();
// Function to lock an address
function lockAddress(address) {
    const normalizedAddress = address.toLowerCase();
    lockedAddressesCache.set(normalizedAddress, Date.now());
    console.info(`Locked address ${normalizedAddress}`);
}
exports.lockAddress = lockAddress;
// Function to check if an address is locked
function isAddressLocked(address) {
    return lockedAddressesCache.has(address.toLowerCase());
}
exports.isAddressLocked = isAddressLocked;
// Function to unlock an address
function unlockAddress(address) {
    const normalizedAddress = address.toLowerCase();
    lockedAddressesCache.delete(normalizedAddress);
    console.info(`Unlocked address ${normalizedAddress}`);
}
exports.unlockAddress = unlockAddress;
// Function to unlock expired addresses
function unlockExpiredAddresses() {
    const currentTimestamp = Date.now();
    lockedAddressesCache.forEach((lockTimestamp, address) => {
        if (currentTimestamp - lockTimestamp > 3600 * 1000) {
            unlockAddress(address);
        }
    });
}
exports.unlockExpiredAddresses = unlockExpiredAddresses;
async function getActiveCustodialWallets(chain) {
    return await db_1.models.ecosystemCustodialWallet.findAll({
        where: {
            chain: chain,
            status: "ACTIVE",
        },
    });
}
exports.getActiveCustodialWallets = getActiveCustodialWallets;
