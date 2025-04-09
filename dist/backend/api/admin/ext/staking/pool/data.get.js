"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stakingPoolCurrenciesChains = exports.metadata = void 0;
const db_1 = require("@b/db");
const constants_1 = require("@b/utils/constants");
const error_1 = require("@b/utils/error");
const cache_1 = require("@b/utils/cache");
exports.metadata = {
    summary: "Get available currencies and chains for Staking Pools",
    operationId: "getStakingPoolCurrenciesChains",
    tags: ["Staking Pools"],
    responses: {
        200: {
            description: "List of available currencies and chains",
            content: constants_1.structureSchema,
        },
    },
    requiresAuth: true,
};
const stakingPoolCurrenciesChains = async () => {
    // Fetch fiat currencies
    const fiatCurrencies = await db_1.models.currency.findAll({
        where: { status: true },
        attributes: ["id"],
    });
    const fiatCurrencyOptions = fiatCurrencies.map((currency) => ({
        value: currency.id,
        label: currency.id,
    }));
    // Fetch spot currencies
    const spotCurrencies = await db_1.models.exchangeCurrency.findAll({
        where: { status: true },
        attributes: ["currency"],
    });
    const spotCurrencyOptions = spotCurrencies.map((currency) => ({
        value: currency.currency,
        label: currency.currency,
    }));
    // Fetch funding currencies and their chains (if the ecosystem extension is enabled)
    let fundingCurrencyOptions = [];
    const currencyChains = {};
    const cacheManager = cache_1.CacheManager.getInstance();
    const extensions = await cacheManager.getExtensions();
    if (extensions.has("ecosystem")) {
        const allFundingCurrencies = await db_1.models.ecosystemToken.findAll({
            where: { status: true },
            attributes: ["currency", "chain"],
        });
        allFundingCurrencies.forEach((currency) => {
            if (!currencyChains[currency.currency]) {
                currencyChains[currency.currency] = [];
            }
            currencyChains[currency.currency].push(currency.chain);
        });
        // Ensure unique currencies for selection options
        const uniqueCurrencies = new Set(allFundingCurrencies.map((c) => c.currency));
        fundingCurrencyOptions = Array.from(uniqueCurrencies).map((currency) => ({
            value: currency,
            label: currency,
        }));
    }
    return {
        currencies: {
            FIAT: fiatCurrencyOptions,
            SPOT: spotCurrencyOptions,
            ECO: fundingCurrencyOptions,
        },
        chains: currencyChains,
    };
};
exports.stakingPoolCurrenciesChains = stakingPoolCurrenciesChains;
exports.default = async (data) => {
    const { user } = data;
    if (!(user === null || user === void 0 ? void 0 : user.id)) {
        throw (0, error_1.createError)({ statusCode: 401, message: "Unauthorized" });
    }
    const responseData = await (0, exports.stakingPoolCurrenciesChains)();
    return responseData;
};
