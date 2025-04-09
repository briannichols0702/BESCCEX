"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("./utils");
const tokens_1 = require("@b/utils/eco/tokens");
const sol_1 = __importDefault(require("@b/blockchains/sol")); // Import SolanaService
const chains_1 = require("@b/utils/eco/chains");
const wallet_1 = require("@b/utils/eco/wallet");
const task_1 = require("@b/utils/task");
const db_1 = require("@b/db");
exports.metadata = {
    summary: "Stores a new Ecosystem Token",
    operationId: "storeEcosystemToken",
    tags: ["Admin", "Ecosystem Tokens"],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: utils_1.ecosystemTokenDeploySchema,
            },
        },
    },
    responses: (0, query_1.storeRecordResponses)(utils_1.ecosystemTokenStoreSchema, "Ecosystem Token"),
    requiresAuth: true,
    permission: "Access Ecosystem Token Management",
};
exports.default = async (data) => {
    var _a, _b;
    const { body } = data;
    const { name, currency, chain, decimals, status, precision, limits, fee, icon, initialHolder, initialSupply, marketCap, } = body;
    if (marketCap < 0) {
        throw new Error("Market cap cannot be negative");
    }
    if (initialSupply < 0) {
        throw new Error("Initial supply cannot be negative");
    }
    if (marketCap < initialSupply) {
        throw new Error("Market cap cannot be less than initial supply");
    }
    if (initialSupply === 0) {
        throw new Error("Initial supply cannot be zero");
    }
    if (!initialHolder) {
        throw new Error("Initial holder is required");
    }
    try {
        // Get the master wallet for this chain
        const masterWallet = await (0, wallet_1.getMasterWalletByChainFull)(chain);
        if (!masterWallet) {
            throw new Error(`Master wallet for chain ${chain} not found`);
        }
        let contract;
        if (chain === "SOL") {
            // Use SolanaService to deploy the SPL token mint
            const solanaService = await sol_1.default.getInstance();
            contract = await solanaService.deploySplToken(masterWallet, decimals);
            // Add minting task to the queue
            task_1.taskQueue.add(() => solanaService
                .mintInitialSupply(masterWallet, contract, initialSupply, decimals, initialHolder) // Add initialHolder here
                .then(() => console.log(`[INFO] Background minting completed for mint ${contract}`))
                .catch(async (err) => {
                // remove token from ecosystemToken
                await db_1.models.ecosystemToken.destroy({
                    where: { contract },
                });
                console.error(`[ERROR] Background minting failed for mint ${contract}: ${err.message}`);
            }));
        }
        else {
            // Deploy ERC20 Token on Ethereum or other supported EVM chains
            contract = await (0, tokens_1.deployTokenContract)(masterWallet, chain, name, currency, initialHolder, decimals, initialSupply, marketCap);
        }
        const type = (_b = (_a = chains_1.chainConfigs[chain]) === null || _a === void 0 ? void 0 : _a.smartContract) === null || _b === void 0 ? void 0 : _b.name;
        const network = process.env[`${chain}_NETWORK`];
        if (!network) {
            throw new Error(`Network not found for chain ${chain}`);
        }
        // Save to ecosystemToken database, including off-chain metadata
        const result = await (0, query_1.storeRecord)({
            model: "ecosystemToken",
            data: {
                contract,
                name,
                currency,
                chain,
                network,
                type,
                decimals,
                status,
                precision,
                limits: JSON.stringify(limits),
                fee: JSON.stringify(fee),
                icon,
                contractType: "PERMIT",
            },
            returnResponse: true,
        });
        // If the creation was successful and an icon was provided, update the cache
        if (result.record && icon) {
            try {
                await (0, utils_1.updateIconInCache)(currency, icon);
            }
            catch (error) {
                console.error(`Failed to update icon in cache for ${currency}:`, error);
            }
        }
        // Return the response immediately after saving the token record
        return result;
    }
    catch (error) {
        // console.error(`Error creating ecosystem token:`, error);
        throw new Error(`Failed to create ecosystem token: ${error.message}`);
    }
};
