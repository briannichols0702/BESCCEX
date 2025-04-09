"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
const db_1 = require("@b/db");
const provider_1 = require("@b/utils/eco/provider");
const utxo_1 = require("@b/utils/eco/utxo");
const ethers_1 = require("ethers");
const chains_1 = require("@b/utils/eco/chains");
const sol_1 = __importDefault(require("@b/blockchains/sol"));
const tron_1 = __importDefault(require("@b/blockchains/tron"));
const xmr_1 = __importDefault(require("@b/blockchains/xmr"));
const ton_1 = __importDefault(require("@b/blockchains/ton"));
exports.metadata = {
    summary: "Retrieves detailed information of a specific ecosystem master wallet by ID",
    operationId: "getEcosystemMasterWalletById",
    tags: ["Admin", "Ecosystem Master Wallets"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            required: true,
            description: "ID of the ecosystem master wallet to retrieve",
            schema: { type: "string" },
        },
    ],
    responses: {
        200: {
            description: "Ecosystem master wallet details",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: utils_1.baseEcosystemMasterWalletSchema, // Define this schema in your utils if it's not already defined
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("Ecosystem Master Wallet"),
        500: query_1.serverErrorResponse,
    },
    permission: "Access Ecosystem Master Wallet Management",
    requiresAuth: true,
};
exports.default = async (data) => {
    const { params } = data;
    const wallet = await db_1.models.ecosystemMasterWallet.findByPk(params.id, {
        include: [
            {
                model: db_1.models.ecosystemCustodialWallet,
                as: "ecosystemCustodialWallets",
                attributes: ["id", "address", "status"],
            },
        ],
    });
    if (!wallet) {
        throw new Error(`Ecosystem master wallet not found: ${params.id}`);
    }
    await getWalletBalance(wallet);
    const updatedWallet = await db_1.models.ecosystemMasterWallet.findByPk(params.id, {
        include: [
            {
                model: db_1.models.ecosystemCustodialWallet,
                as: "ecosystemCustodialWallets",
                attributes: ["id", "address", "status"],
            },
        ],
    });
    if (!updatedWallet) {
        throw new Error(`Ecosystem master wallet not found: ${params.id}`);
    }
    return updatedWallet.get({ plain: true });
};
const getWalletBalance = async (wallet) => {
    try {
        let formattedBalance;
        if (wallet.chain === "SOL") {
            const solanaService = await sol_1.default.getInstance();
            formattedBalance = await solanaService.getBalance(wallet.address);
        }
        else if (wallet.chain === "TRON") {
            const tronService = await tron_1.default.getInstance();
            formattedBalance = await tronService.getBalance(wallet.address);
        }
        else if (wallet.chain === "XMR") {
            const moneroService = await xmr_1.default.getInstance();
            formattedBalance = await moneroService.getBalance("master_wallet");
        }
        else if (wallet.chain === "TON") {
            const tonService = await ton_1.default.getInstance();
            formattedBalance = await tonService.getBalance(wallet.address);
        }
        else if (["BTC", "LTC", "DOGE", "DASH"].includes(wallet.chain)) {
            formattedBalance = await (0, utxo_1.fetchUTXOWalletBalance)(wallet.chain, wallet.address);
        }
        else {
            const provider = await (0, provider_1.getProvider)(wallet.chain);
            const balance = await provider.getBalance(wallet.address);
            const decimals = chains_1.chainConfigs[wallet.chain].decimals;
            formattedBalance = ethers_1.ethers.formatUnits(balance.toString(), decimals);
        }
        if (!formattedBalance || isNaN(parseFloat(formattedBalance))) {
            console.error(`Invalid formatted balance for ${wallet.chain} wallet: ${formattedBalance}`);
            return;
        }
        if (parseFloat(formattedBalance) === 0) {
            return;
        }
        await (0, utils_1.updateMasterWalletBalance)(wallet.id, parseFloat(formattedBalance));
    }
    catch (error) {
        console.error(`Failed to fetch ${wallet.chain} wallet balance: ${error.message}`);
    }
};
