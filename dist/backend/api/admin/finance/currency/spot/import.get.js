"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const exchange_1 = __importDefault(require("@b/utils/exchange"));
const db_1 = require("@b/db");
const query_1 = require("@b/utils/query");
const utils_1 = require("../../exchange/utils");
const sequelize_1 = require("sequelize");
const cron_1 = require("@b/utils/cron");
exports.metadata = {
    summary: "Import Exchange Currencies",
    operationId: "importCurrencies",
    tags: ["Admin", "Settings", "Exchange"],
    description: "Imports currencies from the specified exchange, processes their data, and saves them to the database.",
    requiresAuth: true,
    responses: {
        200: {
            description: "Currencies imported successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            message: { type: "string" },
                        },
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("Exchange"),
        500: query_1.serverErrorResponse,
    },
    permission: "Access Spot Currency Management",
};
exports.default = async (data) => {
    const exchange = await exchange_1.default.startExchange();
    const provider = await exchange_1.default.getProvider();
    if (!exchange) {
        throw new Error(`Failed to start exchange provider: ${provider}`);
    }
    await exchange.loadMarkets();
    const currencies = exchange.currencies;
    const transformedCurrencies = {};
    Object.values(currencies).forEach((currency) => {
        let standardizedNetworks;
        if (provider === "binance") {
            standardizedNetworks = (0, utils_1.standardizeBinanceData)(currency.networks || {});
        }
        else if (provider === "kucoin") {
            standardizedNetworks = (0, utils_1.standardizeKucoinData)(currency);
        }
        else if (provider === "okx") {
            standardizedNetworks = (0, utils_1.standardizeOkxData)(currency.networks || {});
        }
        else if (provider === "xt") {
            standardizedNetworks = (0, utils_1.standardizeXtData)(currency);
        }
        if (currency["precision"]) {
            transformedCurrencies[currency["code"]] = {
                currency: currency["code"],
                name: currency["name"] || currency["code"], // Ensure name is not null
                precision: parseInt(currency["precision"]),
                status: currency["active"],
                deposit: currency["deposit"],
                withdraw: currency["withdraw"],
                fee: currency["fee"],
                chains: standardizedNetworks,
            };
        }
    });
    const newCurrencyCodes = Object.keys(transformedCurrencies);
    // Fetch existing currencies
    const existingCurrencies = await db_1.models.exchangeCurrency.findAll({
        attributes: ["currency"],
    });
    const existingCurrencyCodes = new Set(existingCurrencies.map((c) => c.currency));
    // Determine currencies to delete
    const currenciesToDelete = [...existingCurrencyCodes].filter((code) => !newCurrencyCodes.includes(code));
    // Begin transaction
    await db_1.sequelize.transaction(async (transaction) => {
        // Delete unwanted currencies
        if (currenciesToDelete.length > 0) {
            await db_1.models.exchangeCurrency.destroy({
                where: {
                    currency: { [sequelize_1.Op.in]: currenciesToDelete },
                },
                transaction,
            });
        }
        // Save valid currencies
        await saveValidCurrencies(transformedCurrencies, transaction);
    });
    try {
        await (0, cron_1.processCurrenciesPrices)();
    }
    catch (error) {
        console.error("Error processing currencies prices", error);
    }
    return {
        message: "Exchange currencies imported and saved successfully!",
    };
};
async function saveValidCurrencies(transformedCurrencies, transaction) {
    const existingCurrencies = await db_1.models.exchangeCurrency.findAll({
        attributes: ["currency"],
        transaction,
    });
    const existingCurrencyCodes = new Set(existingCurrencies.map((c) => c.currency));
    const currencyCodes = Object.keys(transformedCurrencies);
    for (const currencyCode of currencyCodes) {
        const currencyData = transformedCurrencies[currencyCode];
        try {
            // Ensure fee is a valid number, otherwise log and skip the currency
            const fee = currencyData.fee !== undefined && currencyData.fee !== null
                ? Number(currencyData.fee)
                : 0;
            if (isNaN(fee)) {
                continue; // Skip this currency and move to the next one
            }
            if (!existingCurrencyCodes.has(currencyCode)) {
                await db_1.models.exchangeCurrency.create({
                    currency: currencyData.currency,
                    name: currencyData.name || currencyData.currency, // Ensure name is not null
                    precision: currencyData.precision,
                    status: false,
                    fee: fee, // Use the valid fee here
                }, { transaction });
            }
            else {
                await db_1.models.exchangeCurrency.update({
                    name: currencyData.name || currencyData.currency, // Ensure name is not null
                    precision: currencyData.precision,
                    status: false,
                    fee: fee, // Use the valid fee here
                }, { where: { currency: currencyCode }, transaction });
            }
        }
        catch (error) {
            continue; // Skip to the next currency on error
        }
    }
}
