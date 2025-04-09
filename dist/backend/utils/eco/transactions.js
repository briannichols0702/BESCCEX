"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchPublicEcosystemTransactions = exports.fetchGeneralEcosystemTransactions = exports.fetchEcosystemTransactions = void 0;
const date_fns_1 = require("date-fns");
const chains_1 = require("./chains");
const utxo_1 = require("./utxo");
const redis_1 = require("../redis");
const logger_1 = require("@b/utils/logger");
const sol_1 = __importDefault(require("../../blockchains/sol"));
const tron_1 = __importDefault(require("@b/blockchains/tron"));
const xmr_1 = __importDefault(require("@b/blockchains/xmr"));
const ton_1 = __importDefault(require("@b/blockchains/ton"));
const CACHE_EXPIRATION = 30;
const fetchEcosystemTransactions = async (chain, address) => {
    const config = chains_1.chainConfigs[chain];
    if (!config) {
        throw new Error(`Unsupported chain: ${chain}`);
    }
    try {
        if (["BTC", "LTC", "DOGE", "DASH"].includes(chain)) {
            return await (0, utxo_1.fetchUTXOTransactions)(chain, address);
        }
        else if (chain === "SOL") {
            const solanaService = await sol_1.default.getInstance();
            return await solanaService.fetchTransactions(address);
        }
        else if (chain === "TRON") {
            const tronService = await tron_1.default.getInstance();
            return await tronService.fetchTransactions(address);
        }
        else if (chain === "XMR") {
            const moneroService = await xmr_1.default.getInstance();
            return await moneroService.fetchTransactions("master_wallet");
        }
        else if (chain === "TON") {
            const tonService = await ton_1.default.getInstance();
            return await tonService.fetchTransactions(address);
        }
        else {
            return await fetchAndParseTransactions(address, chain, config);
        }
    }
    catch (error) {
        (0, logger_1.logError)("fetch_ecosystem_transactions", error, __filename);
        throw new Error(error.message);
    }
};
exports.fetchEcosystemTransactions = fetchEcosystemTransactions;
const fetchAndParseTransactions = async (address, chain, config) => {
    const cacheKey = `wallet:${address}:transactions:${chain.toLowerCase()}`;
    if (config.cache) {
        const cachedData = await getCachedData(cacheKey);
        if (cachedData) {
            return cachedData;
        }
    }
    const rawTransactions = await config.fetchFunction(address, chain);
    const parsedTransactions = parseRawTransactions(rawTransactions);
    if (config.cache) {
        const cacheData = {
            transactions: parsedTransactions,
            timestamp: new Date().toISOString(),
        };
        const redis = redis_1.RedisSingleton.getInstance();
        await redis.setex(cacheKey, CACHE_EXPIRATION, JSON.stringify(cacheData));
    }
    return parsedTransactions;
};
const getCachedData = async (cacheKey) => {
    const redis = redis_1.RedisSingleton.getInstance();
    let cachedData = await redis.get(cacheKey);
    if (cachedData && typeof cachedData === "string") {
        cachedData = JSON.parse(cachedData);
    }
    if (cachedData) {
        const now = new Date();
        const lastUpdated = new Date(cachedData.timestamp);
        if ((0, date_fns_1.differenceInMinutes)(now, lastUpdated) < CACHE_EXPIRATION) {
            return cachedData.transactions;
        }
    }
    return null;
};
const parseRawTransactions = (rawTransactions) => {
    if (!Array.isArray(rawTransactions === null || rawTransactions === void 0 ? void 0 : rawTransactions.result)) {
        throw new Error(`Invalid raw transactions format`);
    }
    return rawTransactions.result.map((rawTx) => {
        return {
            timestamp: rawTx.timeStamp,
            hash: rawTx.hash,
            from: rawTx.from,
            to: rawTx.to,
            amount: rawTx.value,
            method: rawTx.functionName,
            methodId: rawTx.methodId,
            contract: rawTx.contractAddress,
            confirmations: rawTx.confirmations,
            status: rawTx.txreceipt_status,
            isError: rawTx.isError,
            gas: rawTx.gas,
            gasPrice: rawTx.gasPrice,
            gasUsed: rawTx.gasUsed,
        };
    });
};
const fetchGeneralEcosystemTransactions = async (chain, address) => {
    var _a;
    const chainConfig = chains_1.chainConfigs[chain];
    if (!chainConfig) {
        throw new Error(`Unsupported chain: ${chain}`);
    }
    const networkEnvVar = `${chain}_NETWORK`;
    const networkName = process.env[networkEnvVar];
    if (!networkName) {
        throw new Error(`Environment variable ${networkEnvVar} is not set`);
    }
    const hasExplorerApi = (_a = chainConfig.explorerApi) !== null && _a !== void 0 ? _a : true;
    const apiEnvVar = `${chain}_EXPLORER_API_KEY`;
    const apiKey = process.env[apiEnvVar];
    if (hasExplorerApi && !apiKey) {
        throw new Error(`Environment variable ${apiEnvVar} is not set`);
    }
    const network = chainConfig.networks[networkName];
    if (!network || !network.explorer) {
        throw new Error(`Unsupported or misconfigured network: ${networkName} for chain: ${chain}`);
    }
    const url = `https://${network.explorer}/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc${hasExplorerApi ? `&apikey=${apiKey}` : ""}`;
    try {
        const response = await fetch(url);
        return await response.json();
    }
    catch (error) {
        (0, logger_1.logError)("fetch_general_ecosystem_transactions", error, __filename);
        throw new Error(`API call failed: ${error.message}`);
    }
};
exports.fetchGeneralEcosystemTransactions = fetchGeneralEcosystemTransactions;
const fetchPublicEcosystemTransactions = async (url) => {
    try {
        const response = await fetch(url);
        return await response.json();
    }
    catch (error) {
        (0, logger_1.logError)("fetch_public_ecosystem_transactions", error, __filename);
        throw new Error(`API call failed: ${error.message}`);
    }
};
exports.fetchPublicEcosystemTransactions = fetchPublicEcosystemTransactions;
