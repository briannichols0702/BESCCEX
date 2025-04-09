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
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapChainNameToChainId = void 0;
const ccxt = __importStar(require("ccxt"));
const system_1 = require("./system");
const db_1 = require("@b/db");
const logger_1 = require("@b/utils/logger");
const utils_1 = require("@b/api/exchange/utils");
class ExchangeManager {
    constructor() {
        this.exchangeCache = new Map();
        this.provider = null;
        this.exchange = null;
        this.exchangeProvider = null;
        this.lastAttemptTime = null;
        this.attemptCount = 0;
    }
    async fetchActiveProvider() {
        try {
            const provider = await db_1.models.exchange.findOne({
                where: {
                    status: true,
                },
            });
            if (!provider) {
                return null;
            }
            return provider.name;
        }
        catch (error) {
            (0, logger_1.logError)("exchange", error, __filename);
            return null;
        }
    }
    async initializeExchange(provider, retries = 3) {
        if (await (0, utils_1.handleBanStatus)(await (0, utils_1.loadBanStatus)())) {
            return null;
        }
        if (this.exchangeCache.has(provider)) {
            return this.exchangeCache.get(provider);
        }
        const now = Date.now();
        if (this.attemptCount >= 3 &&
            this.lastAttemptTime &&
            now - this.lastAttemptTime < 30 * 60 * 1000) {
            return null;
        }
        const apiKey = process.env[`APP_${provider.toUpperCase()}_API_KEY`];
        const apiSecret = process.env[`APP_${provider.toUpperCase()}_API_SECRET`];
        const apiPassphrase = process.env[`APP_${provider.toUpperCase()}_API_PASSPHRASE`];
        if (!apiKey || !apiSecret || apiKey === "" || apiSecret === "") {
            (0, logger_1.logError)("exchange", new Error(`API credentials for ${provider} are missing.`), __filename);
            this.attemptCount += 1;
            this.lastAttemptTime = now;
            return null;
        }
        try {
            let exchange = new ccxt.pro[provider]({
                apiKey,
                secret: apiSecret,
                password: apiPassphrase,
            });
            const credentialsValid = await exchange.checkRequiredCredentials();
            if (!credentialsValid) {
                (0, logger_1.logError)("exchange", new Error(`API credentials for ${provider} are invalid.`), __filename);
                await exchange.close();
                exchange = new ccxt.pro[provider]();
            }
            try {
                await exchange.loadMarkets();
            }
            catch (error) {
                if (this.isRateLimitError(error)) {
                    await this.handleRateLimitError(provider);
                    return this.initializeExchange(provider, retries);
                }
                else {
                    (0, logger_1.logError)("exchange", new Error(`Failed to load markets: ${error.message}`), __filename);
                    await exchange.close();
                    exchange = new ccxt.pro[provider]();
                }
            }
            this.exchangeCache.set(provider, exchange);
            this.attemptCount = 0;
            this.lastAttemptTime = null;
            return exchange;
        }
        catch (error) {
            (0, logger_1.logError)("exchange", error, __filename);
            this.attemptCount += 1;
            this.lastAttemptTime = now;
            if (retries > 0 &&
                (this.attemptCount < 3 || now - this.lastAttemptTime >= 30 * 60 * 1000)) {
                await (0, system_1.sleep)(5000);
                return this.initializeExchange(provider, retries - 1);
            }
            return null;
        }
    }
    isRateLimitError(error) {
        return error instanceof ccxt.RateLimitExceeded || error.code === -1003;
    }
    async handleRateLimitError(provider) {
        const banTime = Date.now() + 60000; // Ban for 1 minute
        await (0, utils_1.saveBanStatus)(banTime);
        await (0, system_1.sleep)(60000); // Wait for 1 minute
    }
    async startExchange() {
        if (await (0, utils_1.handleBanStatus)(await (0, utils_1.loadBanStatus)())) {
            return null;
        }
        if (this.exchange) {
            return this.exchange;
        }
        this.provider = this.provider || (await this.fetchActiveProvider());
        if (!this.provider) {
            return null;
        }
        this.exchange =
            this.exchangeCache.get(this.provider) ||
                (await this.initializeExchange(this.provider));
        return this.exchange;
    }
    async startExchangeProvider(provider) {
        if (await (0, utils_1.handleBanStatus)(await (0, utils_1.loadBanStatus)())) {
            return null;
        }
        if (!provider) {
            throw new Error("Provider is required to start exchange provider.");
        }
        this.exchangeProvider =
            this.exchangeCache.get(provider) ||
                (await this.initializeExchange(provider));
        return this.exchangeProvider;
    }
    removeExchange(provider) {
        if (!provider) {
            throw new Error("Provider is required to remove exchange.");
        }
        this.exchangeCache.delete(provider);
        if (this.provider === provider) {
            this.exchange = null;
            this.provider = null;
        }
    }
    async getProvider() {
        if (!this.provider) {
            this.provider = await this.fetchActiveProvider();
        }
        return this.provider;
    }
    async testExchangeCredentials(provider) {
        if (await (0, utils_1.handleBanStatus)(await (0, utils_1.loadBanStatus)())) {
            return {
                status: false,
                message: "Service temporarily unavailable. Please try again later.",
            };
        }
        try {
            const apiKey = process.env[`APP_${provider.toUpperCase()}_API_KEY`];
            const apiSecret = process.env[`APP_${provider.toUpperCase()}_API_SECRET`];
            const apiPassphrase = process.env[`APP_${provider.toUpperCase()}_API_PASSPHRASE`];
            if (!apiKey || !apiSecret || apiKey === "" || apiSecret === "") {
                return {
                    status: false,
                    message: "API credentials are missing",
                };
            }
            const exchange = new ccxt.pro[provider]({
                apiKey,
                secret: apiSecret,
                password: apiPassphrase,
            });
            await exchange.loadMarkets();
            const balance = await exchange.fetchBalance();
            if (balance) {
                return {
                    status: true,
                    message: "API credentials are valid",
                };
            }
            else {
                return {
                    status: false,
                    message: "Failed to fetch balance with the provided credentials",
                };
            }
        }
        catch (error) {
            (0, logger_1.logError)("exchange", error, __filename);
            return {
                status: false,
                message: `Error testing API credentials: ${error.message}`,
            };
        }
    }
    async stopExchange() {
        if (this.exchange) {
            await this.exchange.close();
            this.exchange = null;
        }
    }
}
ExchangeManager.instance = new ExchangeManager();
exports.default = ExchangeManager.instance;
function mapChainNameToChainId(chainName) {
    const chainMap = {
        BEP20: "bsc",
        BEP2: "bnb",
        ERC20: "eth",
        TRC20: "trx",
        "KAVA EVM CO-CHAIN": "kavaevm",
        "LIGHTNING NETWORK": "lightning",
        "BTC-SEGWIT": "btc",
        "ASSET HUB(POLKADOT)": "polkadot",
    };
    return chainMap[chainName] || chainName;
}
exports.mapChainNameToChainId = mapChainNameToChainId;
