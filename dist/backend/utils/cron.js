"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCurrencyPricesBulk = exports.processCurrenciesPrices = exports.cacheExchangeCurrencies = exports.fetchFiatCurrencyPrices = exports.createWorker = void 0;
const bullmq_1 = require("bullmq");
const db_1 = require("@b/db");
const cache_1 = require("@b/utils/cache");
const utils_1 = require("@b/api/finance/currency/utils");
const index_get_1 = require("@b/api/exchange/currency/index.get");
const exchange_1 = __importDefault(require("@b/utils/exchange"));
const redis_1 = require("@b/utils/redis");
const logger_1 = require("./logger");
const utils_2 = require("@b/api/exchange/utils");
const wallet_1 = require("./crons/wallet");
const forex_1 = require("./crons/forex");
const ico_1 = require("./crons/ico");
const staking_1 = require("./crons/staking");
const mailwizard_1 = require("./crons/mailwizard");
const investment_1 = require("./crons/investment");
const aiInvestment_1 = require("./crons/aiInvestment");
const order_1 = require("./crons/order");
const cron_1 = require("./eco/cron");
const redis = redis_1.RedisSingleton.getInstance();
class CronJobManager {
    constructor() {
        this.cronJobs = [];
        this.loadNormalCronJobs();
    }
    static async getInstance() {
        if (!CronJobManager.instance) {
            CronJobManager.instance = new CronJobManager();
            await CronJobManager.instance.loadAddonCronJobs();
        }
        return CronJobManager.instance;
    }
    loadNormalCronJobs() {
        this.cronJobs.push({
            name: "processGeneralInvestments",
            title: "Process General Investments",
            period: 60 * 60 * 1000,
            description: "Processes active General investments.",
            function: investment_1.processGeneralInvestments,
            lastRun: null,
            lastRunError: null,
        }, {
            name: "processPendingOrders",
            title: "Process Pending Orders",
            period: 60 * 60 * 1000,
            description: "Processes pending binary orders.",
            function: order_1.processPendingOrders,
            lastRun: null,
            lastRunError: null,
        }, {
            name: "fetchFiatCurrencyPrices",
            title: "Fetch Fiat Currency Prices",
            period: 30 * 60 * 1000,
            description: "Fetches the latest fiat currency prices.",
            function: fetchFiatCurrencyPrices,
            lastRun: null,
            lastRunError: null,
        }, {
            name: "processCurrenciesPrices",
            title: "Process Currencies Prices",
            period: 2 * 60 * 1000,
            description: "Updates the prices of all exchange currencies in the database.",
            function: processCurrenciesPrices,
            lastRun: null,
            lastRunError: null,
        }, {
            name: "processSpotPendingDeposits",
            title: "Process Pending Spot Deposits",
            period: 15 * 60 * 1000,
            description: "Processes pending spot wallet deposits.",
            function: wallet_1.processSpotPendingDeposits,
            lastRun: null,
            lastRunError: null,
        }, {
            name: "processPendingWithdrawals",
            title: "Process Pending Withdrawals",
            period: 30 * 60 * 1000,
            description: "Processes pending spot wallet withdrawals.",
            function: wallet_1.processPendingWithdrawals,
            lastRun: null,
            lastRunError: null,
        }, {
            name: "processWalletPnl",
            title: "Process Wallet PnL",
            period: 24 * 60 * 60 * 1000,
            description: "Processes wallet PnL for all users.",
            function: wallet_1.processWalletPnl,
            lastRun: null,
            lastRunError: null,
        }, {
            name: "cleanupOldPnlRecords",
            title: "Cleanup Old PnL Records",
            period: 24 * 60 * 60 * 1000,
            description: "Removes old PnL records and zero balance records.",
            function: wallet_1.cleanupOldPnlRecords,
            lastRun: null,
            lastRunError: null,
        });
    }
    async loadAddonCronJobs() {
        const addonCronJobs = {
            ecosystem: [
                {
                    name: "processPendingEcoWithdrawals",
                    title: "Process Pending Ecosystem Withdrawals",
                    period: 30 * 60 * 1000,
                    description: "Processes pending funding wallet withdrawals.",
                    function: cron_1.processPendingEcoWithdrawals,
                    lastRun: null,
                    lastRunError: null,
                },
            ],
            ai_investment: [
                {
                    name: "processAiInvestments",
                    title: "Process AI Investments",
                    period: 60 * 60 * 1000,
                    description: "Processes active AI investments.",
                    function: aiInvestment_1.processAiInvestments,
                    lastRun: null,
                    lastRunError: null,
                },
            ],
            forex: [
                {
                    name: "processForexInvestments",
                    title: "Process Forex Investments",
                    period: 60 * 60 * 1000,
                    description: "Processes active Forex investments.",
                    function: forex_1.processForexInvestments,
                    lastRun: null,
                    lastRunError: null,
                },
            ],
            ico: [
                {
                    name: "processIcoPhases",
                    title: "Process ICO Phases",
                    period: 60 * 60 * 1000,
                    description: "Processes ICO phases and updates their status.",
                    function: ico_1.processIcoPhases,
                    lastRun: null,
                    lastRunError: null,
                },
            ],
            staking: [
                {
                    name: "processStakingLogs",
                    title: "Process Staking Logs",
                    period: 60 * 60 * 1000,
                    description: "Processes staking logs and releases stakes if necessary.",
                    function: staking_1.processStakingLogs,
                    lastRun: null,
                    lastRunError: null,
                },
            ],
            mailwizard: [
                {
                    name: "processMailwizardCampaigns",
                    title: "Process Mailwizard Campaigns",
                    period: 60 * 60 * 1000,
                    description: "Processes Mailwizard campaigns and sends emails.",
                    function: mailwizard_1.processMailwizardCampaigns,
                    lastRun: null,
                    lastRunError: null,
                },
            ],
        };
        const cacheManager = cache_1.CacheManager.getInstance();
        const extensions = await cacheManager.getExtensions();
        for (const addon of Object.keys(addonCronJobs)) {
            if (extensions.has(addon)) {
                addonCronJobs[addon].forEach((cronJob) => {
                    if (!this.isCronJobPresent(this.cronJobs, cronJob.name)) {
                        this.cronJobs.push(cronJob);
                    }
                });
            }
        }
    }
    getCronJobs() {
        return this.cronJobs;
    }
    updateJobStatus(name, lastRun, lastRunError) {
        const job = this.cronJobs.find((job) => job.name === name);
        if (job) {
            job.lastRun = lastRun;
            job.lastRunError = lastRunError;
        }
    }
    isCronJobPresent(cronJobs, jobName) {
        return cronJobs.some((job) => job.name === jobName);
    }
}
const createWorker = async (name, handler, period) => {
    const cronJobManager = await CronJobManager.getInstance();
    const queue = new bullmq_1.Queue(name, {
        connection: {
            host: "127.0.0.1",
            port: 6379,
        },
    });
    new bullmq_1.Worker(name, async (job) => {
        const startTime = Date.now();
        try {
            await handler();
            cronJobManager.updateJobStatus(name, startTime, null);
        }
        catch (error) {
            cronJobManager.updateJobStatus(name, startTime, error.message);
            (0, logger_1.logError)("worker", error, __filename);
            throw error;
        }
    }, {
        connection: {
            host: "127.0.0.1",
            port: 6379,
        },
    });
    queue.add(name, {}, { repeat: { every: period } }).catch((error) => {
        (0, logger_1.logError)("queue", error, __filename);
    });
};
exports.createWorker = createWorker;
async function fetchFiatCurrencyPrices() {
    const baseCurrency = "USD";
    const provider = process.env.APP_FIAT_RATES_PROVIDER || "openexchangerates";
    try {
        switch (provider.toLowerCase()) {
            case "openexchangerates":
                await fetchOpenExchangeRates(baseCurrency);
                break;
            case "exchangerate-api":
                await fetchExchangeRateApi(baseCurrency);
                break;
            default:
                throw new Error(`Unsupported fiat rates provider: ${provider}`);
        }
    }
    catch (error) {
        (0, logger_1.logError)("fetchFiatCurrencyPrices", error, __filename);
        throw error;
    }
}
exports.fetchFiatCurrencyPrices = fetchFiatCurrencyPrices;
async function fetchOpenExchangeRates(baseCurrency) {
    const openExchangeRatesApiKey = process.env.APP_OPENEXCHANGERATES_APP_ID;
    const openExchangeRatesUrl = `https://openexchangerates.org/api/latest.json?appId=${openExchangeRatesApiKey}&base=${baseCurrency}`;
    const frankfurterApiUrl = `https://api.frankfurter.app/latest?from=${baseCurrency}`;
    try {
        const data = await fetchWithTimeout(openExchangeRatesUrl);
        if (data && data.rates) {
            await updateRatesFromData(data.rates);
        }
        else {
            throw new Error("Invalid data format received from OpenExchangeRates API");
        }
    }
    catch (error) {
        (0, logger_1.logError)("fetchOpenExchangeRates - OpenExchangeRates", error, __filename);
        try {
            const data = await fetchWithTimeout(frankfurterApiUrl);
            if (data && data.rates) {
                await updateRatesFromData(data.rates);
            }
            else {
                throw new Error("Invalid data format received from Frankfurter API");
            }
        }
        catch (fallbackError) {
            (0, logger_1.logError)("fetchOpenExchangeRates - Frankfurter", fallbackError, __filename);
            throw new Error(`Both API calls failed: ${error.message}, ${fallbackError.message}`);
        }
    }
}
async function fetchExchangeRateApi(baseCurrency) {
    const exchangeRateApiKey = process.env.APP_EXCHANGERATE_API_KEY;
    const exchangeRateApiUrl = `https://v6.exchangerate-api.com/v6/${exchangeRateApiKey}/latest/${baseCurrency}`;
    try {
        const data = await fetchWithTimeout(exchangeRateApiUrl);
        if (data && data.conversion_rates) {
            await updateRatesFromData(data.conversion_rates);
        }
        else {
            throw new Error("Invalid data format received from ExchangeRate API");
        }
    }
    catch (error) {
        (0, logger_1.logError)("fetchExchangeRateApi", error, __filename);
        throw error;
    }
}
async function fetchWithTimeout(url, timeout = 5000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) {
            switch (response.status) {
                case 401:
                    throw new Error("Unauthorized: Invalid API key.");
                case 403:
                    throw new Error("Forbidden: Access denied.");
                case 429:
                    throw new Error("Too Many Requests: Rate limit exceeded.");
                case 500:
                    throw new Error("Internal Server Error: The API is currently unavailable.");
                default:
                    throw new Error(`Network response was not ok: ${response.statusText}`);
            }
        }
        const data = await response.json();
        return data;
    }
    finally {
        clearTimeout(id);
    }
}
async function updateRatesFromData(exchangeRates) {
    const ratesToUpdate = {};
    const currenciesRaw = await redis.get("currencies");
    if (!currenciesRaw) {
        throw new Error("No currencies data available in Redis");
    }
    let currencies;
    try {
        currencies = JSON.parse(currenciesRaw);
    }
    catch (parseError) {
        throw new Error(`Error parsing currencies data: ${parseError.message}`);
    }
    if (!Array.isArray(currencies)) {
        throw new Error("Currencies data is not an array");
    }
    for (const currency of currencies) {
        if (Object.prototype.hasOwnProperty.call(exchangeRates, currency.id)) {
            ratesToUpdate[currency.id] = exchangeRates[currency.id];
        }
    }
    await (0, utils_1.updateCurrencyRates)(ratesToUpdate);
    await (0, utils_1.cacheCurrencies)();
}
async function cacheExchangeCurrencies() {
    const currencies = await (0, index_get_1.getCurrencies)();
    await redis.set("exchangeCurrencies", JSON.stringify(currencies), "EX", 1800);
}
exports.cacheExchangeCurrencies = cacheExchangeCurrencies;
async function processCurrenciesPrices() {
    let unblockTime = await (0, utils_2.loadBanStatus)();
    try {
        if (Date.now() < unblockTime) {
            const waitTime = unblockTime - Date.now();
            console.log(`Waiting for ${(0, utils_2.formatWaitTime)(waitTime)} until unblock time`);
            return; // Exit the function if we're currently banned
        }
        const exchange = await exchange_1.default.startExchange();
        if (!exchange)
            return;
        let marketsCache = [];
        let currenciesCache = [];
        // Fetch markets from the database
        try {
            marketsCache = await db_1.models.exchangeMarket.findAll({
                where: {
                    status: true,
                },
                attributes: ["currency", "pair"],
            });
        }
        catch (err) {
            (0, logger_1.logError)("processCurrenciesPrices - fetch markets", err, __filename);
            throw err;
        }
        // Fetch currencies from the database
        try {
            currenciesCache = await db_1.models.exchangeCurrency.findAll({
                attributes: ["currency", "id", "price", "status"],
            });
        }
        catch (err) {
            (0, logger_1.logError)("processCurrenciesPrices - fetch currencies", err, __filename);
            throw err;
        }
        const marketSymbols = marketsCache.map((market) => `${market.currency}/${market.pair}`);
        if (!marketSymbols.length) {
            const error = new Error("No market symbols found");
            (0, logger_1.logError)("processCurrenciesPrices - market symbols", error, __filename);
            throw error;
        }
        let markets = {};
        try {
            if (exchange.has["fetchLastPrices"]) {
                markets = await exchange.fetchLastPrices(marketSymbols);
            }
            else {
                markets = await exchange.fetchTickers(marketSymbols);
            }
        }
        catch (error) {
            const result = await (0, utils_2.handleExchangeError)(error, exchange_1.default);
            if (typeof result === "number") {
                unblockTime = result;
                await (0, utils_2.saveBanStatus)(unblockTime);
                console.log(`Ban detected. Blocked until ${new Date(unblockTime).toLocaleString()}`);
                return; // Exit the function if we've been banned
            }
            (0, logger_1.logError)("processCurrenciesPrices - fetch markets data", error, __filename);
            throw error;
        }
        // Filter symbols with pair "USDT"
        const usdtPairs = Object.keys(markets).filter((symbol) => symbol.endsWith("/USDT"));
        // Prepare data for bulk update
        const bulkUpdateData = usdtPairs
            .map((symbol) => {
            const currency = symbol.split("/")[0];
            const market = markets[symbol];
            let price;
            if (exchange.has["fetchLastPrices"]) {
                price = market.price;
            }
            else {
                price = market.last;
            }
            // Ensure price is a valid number
            if (!price || isNaN(parseFloat(price))) {
                console.warn(`Invalid or missing price for symbol: ${symbol}, market data: ${JSON.stringify(market)}`);
                return null;
            }
            const matchingCurrency = currenciesCache.find((dbCurrency) => dbCurrency.currency === currency);
            if (matchingCurrency) {
                matchingCurrency.price = parseFloat(price); // update price directly in the object
                return matchingCurrency;
            }
            return null;
        })
            .filter((item) => item !== null);
        // Add USDT with price 1 if it's in the database currencies
        const usdtCurrency = currenciesCache.find((dbCurrency) => dbCurrency.currency === "USDT");
        if (usdtCurrency) {
            usdtCurrency.price = 1;
            bulkUpdateData.push(usdtCurrency);
        }
        try {
            await db_1.sequelize.transaction(async (transaction) => {
                for (const item of bulkUpdateData) {
                    await item.save({ transaction });
                }
            });
        }
        catch (error) {
            (0, logger_1.logError)("processCurrenciesPrices - update database", error, __filename);
            throw error;
        }
    }
    catch (error) {
        (0, logger_1.logError)("processCurrenciesPrices", error, __filename);
        throw error;
    }
}
exports.processCurrenciesPrices = processCurrenciesPrices;
async function updateCurrencyPricesBulk(data) {
    try {
        // Start a transaction
        await db_1.sequelize.transaction(async (transaction) => {
            // Map through data and update each exchangeCurrency record within the transaction
            for (const item of data) {
                await db_1.models.exchangeCurrency.update({ price: item.price }, {
                    where: { id: item.id },
                    transaction, // Ensure the update is part of the transaction
                });
            }
        });
    }
    catch (error) {
        (0, logger_1.logError)("updateCurrencyPricesBulk", error, __filename);
        throw error;
    }
}
exports.updateCurrencyPricesBulk = updateCurrencyPricesBulk;
exports.default = CronJobManager;
