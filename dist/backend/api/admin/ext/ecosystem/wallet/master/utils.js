"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deployCustodialContract = exports.getEcosystemMasterWalletBalance = exports.createEVMWallet = exports.createAndEncryptWallet = exports.ecosystemMasterWalletStoreSchema = exports.ecosystemMasterWalletUpdateSchema = exports.baseEcosystemMasterWalletSchema = exports.ecosystemMasterWalletSchema = exports.updateMasterWalletBalance = exports.createMasterWallet = exports.getMasterWallet = exports.getMasterWalletById = exports.getAllMasterWallets = void 0;
const fs = __importStar(require("fs"));
const utxo_1 = require("@b/utils/eco/utxo");
const encrypt_1 = require("@b/utils/encrypt");
const schema_1 = require("@b/utils/schema");
const ethers_1 = require("ethers");
const redis_1 = require("@b/utils/redis");
const date_fns_1 = require("date-fns");
const gas_1 = require("@b/utils/eco/gas");
const db_1 = require("@b/db");
const provider_1 = require("@b/utils/eco/provider");
const chains_1 = require("@b/utils/eco/chains");
const smartContract_1 = require("@b/utils/eco/smartContract");
const wallet_1 = require("@b/utils/eco/wallet");
const sol_1 = __importDefault(require("@b/blockchains/sol"));
const tron_1 = __importDefault(require("@b/blockchains/tron"));
const xmr_1 = __importDefault(require("@b/blockchains/xmr"));
const ton_1 = __importDefault(require("@b/blockchains/ton"));
// Fetch all master wallets
async function getAllMasterWallets() {
    return db_1.models.ecosystemMasterWallet.findAll({
        attributes: wallet_1.walletResponseAttributes,
    });
}
exports.getAllMasterWallets = getAllMasterWallets;
// Fetch a single master wallet by ID
async function getMasterWalletById(id) {
    return db_1.models.ecosystemMasterWallet.findOne({
        where: { id },
        attributes: wallet_1.walletResponseAttributes,
    });
}
exports.getMasterWalletById = getMasterWalletById;
// Fetch a single master wallet by UUID (no select constraint)
async function getMasterWallet(id) {
    return db_1.models.ecosystemMasterWallet.findOne({
        where: { id },
    });
}
exports.getMasterWallet = getMasterWallet;
// Create a new master wallet
async function createMasterWallet(walletData, currency) {
    const wallet = await db_1.models.ecosystemMasterWallet.create({
        currency,
        chain: walletData.chain,
        address: walletData.address,
        data: walletData.data,
        status: true,
    });
    return wallet;
}
exports.createMasterWallet = createMasterWallet;
// Update master wallet balance
async function updateMasterWalletBalance(id, balance) {
    await db_1.models.ecosystemMasterWallet.update({
        balance,
    }, {
        where: { id },
    });
    return getMasterWalletById(id);
}
exports.updateMasterWalletBalance = updateMasterWalletBalance;
const id = (0, schema_1.baseStringSchema)("ID of the ecosystem master wallet");
const chain = (0, schema_1.baseStringSchema)("Blockchain chain associated with the master wallet", 255);
const currency = (0, schema_1.baseStringSchema)("Currency used in the master wallet", 255);
const address = (0, schema_1.baseStringSchema)("Address of the master wallet", 255);
const balance = (0, schema_1.baseNumberSchema)("Balance of the master wallet");
const data = (0, schema_1.baseStringSchema)("Additional data associated with the master wallet", 1000, 0, true);
const status = (0, schema_1.baseEnumSchema)("Operational status of the master wallet", [
    "ACTIVE",
    "INACTIVE",
]);
const lastIndex = (0, schema_1.baseNumberSchema)("Last index used for generating wallet address");
exports.ecosystemMasterWalletSchema = {
    id,
    chain,
    currency,
    address,
    balance,
    data,
    status,
    lastIndex,
};
exports.baseEcosystemMasterWalletSchema = {
    id,
    chain,
    currency,
    address,
    balance,
    data,
    status,
    lastIndex,
};
exports.ecosystemMasterWalletUpdateSchema = {
    type: "object",
    properties: {
        chain,
        currency,
        address,
        balance,
        data,
        status,
        lastIndex,
    },
    required: ["chain", "currency", "address", "status", "lastIndex"],
};
exports.ecosystemMasterWalletStoreSchema = {
    description: `Master wallet created or updated successfully`,
    content: {
        "application/json": {
            schema: {
                type: "object",
                properties: exports.baseEcosystemMasterWalletSchema,
            },
        },
    },
};
const createAndEncryptWallet = async (chain) => {
    let wallet;
    if (["BTC", "LTC", "DOGE", "DASH"].includes(chain)) {
        // Generate a UTXO wallet
        wallet = (0, utxo_1.createUTXOWallet)(chain);
    }
    else if (chain === "SOL") {
        const solanaService = await sol_1.default.getInstance();
        wallet = solanaService.createWallet();
    }
    else if (chain === "TRON") {
        const tronService = await tron_1.default.getInstance();
        wallet = tronService.createWallet();
    }
    else if (chain === "XMR") {
        const moneroService = await xmr_1.default.getInstance();
        wallet = await moneroService.createWallet("master_wallet");
    }
    else if (chain === "TON") {
        const tonService = await ton_1.default.getInstance();
        wallet = await tonService.createWallet();
    }
    else {
        // Generate an EVM wallet
        wallet = (0, exports.createEVMWallet)();
    }
    // Define the directory and file path
    const walletDir = `${process.cwd()}/ecosystem/wallets`;
    const walletFilePath = `${walletDir}/${chain}.json`;
    // Check if directory exists, if not create it
    if (!fs.existsSync(walletDir)) {
        fs.mkdirSync(walletDir, { recursive: true });
    }
    await fs.writeFileSync(walletFilePath, JSON.stringify(wallet), "utf8");
    // Encrypt all the wallet details
    const data = (0, encrypt_1.encrypt)(JSON.stringify(wallet.data));
    return {
        address: wallet.address,
        chain,
        data,
    };
};
exports.createAndEncryptWallet = createAndEncryptWallet;
const createEVMWallet = () => {
    // Generate a random wallet
    const wallet = ethers_1.ethers.Wallet.createRandom();
    if (!wallet.mnemonic) {
        throw new Error("Mnemonic not found");
    }
    // Derive the HDNode from the wallet's mnemonic
    const hdNode = ethers_1.ethers.HDNodeWallet.fromPhrase(wallet.mnemonic.phrase);
    if (!hdNode) {
        throw new Error("HDNode not found");
    }
    const xprv = hdNode.extendedKey;
    const xpub = hdNode.neuter().extendedKey;
    if (!hdNode.mnemonic) {
        throw new Error("Mnemonic not found");
    }
    const mnemonic = hdNode.mnemonic.phrase;
    const address = hdNode.address;
    const publicKey = hdNode.publicKey;
    const privateKey = hdNode.privateKey;
    const path = hdNode.path;
    const chainCode = hdNode.chainCode;
    return {
        address,
        data: {
            mnemonic,
            publicKey,
            privateKey,
            xprv,
            xpub,
            chainCode,
            path,
        },
    };
};
exports.createEVMWallet = createEVMWallet;
const getEcosystemMasterWalletBalance = async (wallet) => {
    try {
        const cacheKey = `wallet:${wallet.id}:balance`;
        const redis = redis_1.RedisSingleton.getInstance();
        let cachedBalanceData = await redis.get(cacheKey);
        if (cachedBalanceData) {
            if (typeof cachedBalanceData !== "object") {
                cachedBalanceData = JSON.parse(cachedBalanceData);
            }
            const now = new Date();
            const lastUpdated = new Date(cachedBalanceData.timestamp);
            if ((0, date_fns_1.differenceInMinutes)(now, lastUpdated) < 5 &&
                parseFloat(cachedBalanceData.balance) !== 0) {
                return;
            }
        }
        let formattedBalance;
        if (["BTC", "LTC", "DOGE", "DASH"].includes(wallet.chain)) {
            formattedBalance = await (0, utxo_1.fetchUTXOWalletBalance)(wallet.chain, wallet.address);
        }
        else if (wallet.chain === "SOL") {
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
        else {
            const provider = await (0, provider_1.getProvider)(wallet.chain);
            const balance = await provider.getBalance(wallet.address);
            const decimals = chains_1.chainConfigs[wallet.chain].decimals;
            formattedBalance = ethers_1.ethers.formatUnits(balance.toString(), decimals);
        }
        if (!formattedBalance || isNaN(parseFloat(formattedBalance))) {
            console.log(`Invalid formatted balance for ${wallet.chain} wallet: ${formattedBalance}`);
            return;
        }
        if (parseFloat(formattedBalance) === 0) {
            return;
        }
        await updateMasterWalletBalance(wallet.id, parseFloat(formattedBalance));
        const cacheData = {
            balance: formattedBalance,
            timestamp: new Date().toISOString(),
        };
        await redis.setex(cacheKey, 300, JSON.stringify(cacheData));
    }
    catch (error) {
        console.error(`Failed to fetch ${wallet.chain} wallet balance: ${error.message}`);
    }
};
exports.getEcosystemMasterWalletBalance = getEcosystemMasterWalletBalance;
async function deployCustodialContract(masterWallet) {
    try {
        // Initialize Ethereum provider
        const provider = await (0, provider_1.getProvider)(masterWallet.chain);
        if (!provider) {
            throw new Error("Provider not initialized");
        }
        // Decrypt mnemonic
        let decryptedData;
        if (!masterWallet.data) {
            throw new Error("Mnemonic not found");
        }
        try {
            decryptedData = JSON.parse((0, encrypt_1.decrypt)(masterWallet.data));
        }
        catch (error) {
            throw new Error(`Failed to decrypt mnemonic: ${error.message}`);
        }
        if (!decryptedData || !decryptedData.privateKey) {
            throw new Error("Decrypted data or Mnemonic not found");
        }
        const { privateKey } = decryptedData;
        // Create a signer
        const signer = new ethers_1.ethers.Wallet(privateKey).connect(provider);
        const { abi, bytecode } = await (0, smartContract_1.getSmartContract)("wallet", "CustodialWalletERC20");
        if (!abi || !bytecode) {
            throw new Error("Smart contract ABI or Bytecode not found");
        }
        // Create Contract Factory
        const custodialWalletFactory = new ethers_1.ContractFactory(abi, bytecode, signer);
        // Fetch adjusted gas price
        const gasPrice = await (0, gas_1.getAdjustedGasPrice)(provider);
        // Deploy the contract with dynamic gas settings
        const custodialWalletContract = await custodialWalletFactory.deploy(masterWallet.address, {
            gasPrice: gasPrice,
        });
        // Wait for the contract to be deployed
        const response = await custodialWalletContract.waitForDeployment();
        return await response.getAddress();
    }
    catch (error) {
        throw new Error(error.message);
    }
}
exports.deployCustodialContract = deployCustodialContract;
