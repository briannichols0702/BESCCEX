"use strict";
// /api/admin/ecosystemCustodialWallets/structure.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.ecosystemCustodialWalletStructure = exports.metadata = void 0;
const constants_1 = require("@b/utils/constants");
const db_1 = require("@b/db");
const sequelize_1 = require("sequelize");
exports.metadata = {
    summary: "Get form structure for Ecosystem Custodial Wallets",
    operationId: "getEcosystemCustodialWalletStructure",
    tags: ["Admin", "Ecosystem Custodial Wallets"],
    responses: {
        200: {
            description: "Form structure for managing Ecosystem Custodial Wallets",
            content: constants_1.structureSchema,
        },
    },
    permission: "Access Ecosystem Custodial Wallet Management",
};
const ecosystemCustodialWalletStructure = async () => {
    // except chain : SOL, TRON
    const masterWallets = await db_1.models.ecosystemMasterWallet.findAll({
        where: {
            chain: {
                [sequelize_1.Op.notIn]: [
                    "SOL",
                    "TRON",
                    "BTC",
                    "LTC",
                    "DOGE",
                    "DASH",
                    "XMR",
                    "TON",
                    "MO",
                ],
            },
        },
    });
    const masterWalletId = {
        type: "select",
        label: "Master Wallet",
        name: "masterWalletId",
        options: masterWallets.map((wallet) => ({
            value: wallet.id,
            label: wallet.chain,
        })),
        placeholder: "Select the master wallet",
    };
    const address = {
        type: "input",
        label: "Wallet Address",
        name: "address",
        placeholder: "Enter the wallet address",
    };
    const status = {
        type: "select",
        label: "Status",
        name: "status",
        options: [
            { value: "ACTIVE", label: "Active" },
            { value: "INACTIVE", label: "Inactive" },
            { value: "SUSPENDED", label: "Suspended" },
        ],
        placeholder: "Select the status of the wallet",
    };
    return {
        masterWalletId,
        address,
        status,
    };
};
exports.ecosystemCustodialWalletStructure = ecosystemCustodialWalletStructure;
exports.default = async () => {
    const { masterWalletId, address, status } = await (0, exports.ecosystemCustodialWalletStructure)();
    return {
        get: [masterWalletId, address, status],
        set: [masterWalletId],
        edit: [status],
    };
};
