"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEcoPriceInUSD = exports.getSpotPriceInUSD = exports.getFiatPriceInUSD = exports.getCurrencies = exports.findCurrencyById = exports.updateCurrencyRates = exports.cacheCurrencies = exports.baseResponseSchema = exports.baseCurrencySchema = void 0;
const db_1 = require("@b/db");
const exchange_1 = __importDefault(require("@b/utils/exchange"));
const utils_1 = require("@b/api/exchange/utils");
const matchingEngine_1 = require("@b/utils/eco/matchingEngine");
const redis_1 = require("@b/utils/redis");
const schema_1 = require("@b/utils/schema");
const lodash_1 = require("lodash");
const error_1 = require("@b/utils/error");
const redis = redis_1.RedisSingleton.getInstance();
exports.baseCurrencySchema = {
    id: (0, schema_1.baseNumberSchema)("ID of the currency"),
    name: (0, schema_1.baseStringSchema)("Currency name"),
    symbol: (0, schema_1.baseStringSchema)("Currency symbol"),
    precision: (0, schema_1.baseNumberSchema)("Currency precision"),
    price: (0, schema_1.baseNumberSchema)("Currency price"),
    status: (0, schema_1.baseBooleanSchema)("Currency status"),
};
exports.baseResponseSchema = {
    status: (0, schema_1.baseBooleanSchema)("Indicates if the request was successful"),
    statusCode: (0, schema_1.baseNumberSchema)("HTTP status code"),
    data: (0, schema_1.baseObjectSchema)("Detailed data response"),
};
async function cacheCurrencies() {
    try {
        const currencies = await getCurrencies();
        await redis.set("currencies", JSON.stringify(currencies), "EX", 300); // Cache for 5 minutes
    }
    catch (error) { }
}
exports.cacheCurrencies = cacheCurrencies;
cacheCurrencies();
async function updateCurrencyRates(rates) {
    await db_1.sequelize.transaction(async (transaction) => {
        const codes = Object.keys(rates);
        // Validate each rate before processing
        codes.forEach((code) => {
            const price = rates[code];
            if (!(0, lodash_1.isNumber)(price) || isNaN(price)) {
                throw new Error(`Invalid price for currency ${code}: ${price}`);
            }
        });
        // Create a batch of update operations
        const updatePromises = codes.map((code) => {
            return db_1.models.currency.update({ price: rates[code] }, { where: { id: code }, transaction });
        });
        // Execute all updates within a transaction
        await Promise.all(updatePromises);
    });
    const updatedCurrencies = await db_1.models.currency.findAll({
        where: { id: Object.keys(rates) },
    });
    // Map Sequelize instances to plain objects.
    return updatedCurrencies.map((currency) => currency.get({ plain: true }));
}
exports.updateCurrencyRates = updateCurrencyRates;
// Helper Functions
async function findCurrencyById(id) {
    const currency = await db_1.models.currency.findOne({
        where: { id },
    });
    if (!currency)
        throw new Error("Currency not found");
    return currency;
}
exports.findCurrencyById = findCurrencyById;
async function getCurrencies() {
    const currencies = await db_1.models.currency.findAll({
        where: { status: "true" }, // Assuming status is stored as string 'true'/'false'
        order: [["id", "ASC"]],
    });
    return currencies.map((currency) => currency.get({ plain: true }));
}
exports.getCurrencies = getCurrencies;
const getFiatPriceInUSD = async (currency) => {
    const fiatCurrency = await db_1.models.currency.findOne({
        where: { id: currency, status: true },
    });
    if (!fiatCurrency) {
        throw (0, error_1.createError)(404, `Currency ${currency} not found`);
    }
    return parseFloat(fiatCurrency.price);
};
exports.getFiatPriceInUSD = getFiatPriceInUSD;
const getSpotPriceInUSD = async (currency) => {
    if (currency === "USDT") {
        return 1;
    }
    const exchange = await exchange_1.default.startExchange();
    if (!exchange) {
        throw (0, error_1.createError)(503, "Service temporarily unavailable. Please try again later.");
    }
    try {
        const unblockTime = await (0, utils_1.loadBanStatus)();
        if (await (0, utils_1.handleBanStatus)(unblockTime)) {
            throw (0, error_1.createError)(503, "Service temporarily unavailable. Please try again later.");
        }
        const ticker = await exchange.fetchTicker(`${currency}/USDT`);
        const price = ticker.last;
        if (!price) {
            throw new Error("Error fetching ticker data");
        }
        return price;
    }
    catch (error) {
        if (error.statusCode === 503) {
            throw error;
        }
        throw new Error("Error fetching market data");
    }
};
exports.getSpotPriceInUSD = getSpotPriceInUSD;
const getEcoPriceInUSD = async (currency) => {
    if (currency === "USDT") {
        return 1;
    }
    const engine = await matchingEngine_1.MatchingEngine.getInstance();
    try {
        const ticker = await engine.getTicker(`${currency}/USDT`);
        const price = ticker.last;
        if (!price) {
            throw new Error("Error fetching ticker data");
        }
        return price;
    }
    catch (error) {
        throw new Error("Error fetching market data");
    }
};
exports.getEcoPriceInUSD = getEcoPriceInUSD;
