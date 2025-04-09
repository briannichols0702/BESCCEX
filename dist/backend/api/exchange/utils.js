"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseWatchlistItemSchema = exports.baseTickerSchema = exports.baseOrderBookSchema = exports.baseOrderBookEntrySchema = exports.sanitizeErrorMessage = exports.handleExchangeError = exports.extractBanTime = exports.handleBanStatus = exports.formatWaitTime = exports.loadBanStatus = exports.saveBanStatus = exports.BAN_STATUS_KEY = void 0;
const schema_1 = require("@b/utils/schema");
const redis_1 = require("@b/utils/redis");
const redis = redis_1.RedisSingleton.getInstance();
exports.BAN_STATUS_KEY = "exchange:ban_status";
async function saveBanStatus(unblockTime) {
    await redis.set(exports.BAN_STATUS_KEY, unblockTime);
}
exports.saveBanStatus = saveBanStatus;
async function loadBanStatus() {
    const unblockTime = await redis.get(exports.BAN_STATUS_KEY);
    return unblockTime ? parseInt(unblockTime) : 0;
}
exports.loadBanStatus = loadBanStatus;
function formatWaitTime(ms) {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes} minutes and ${seconds} seconds`;
}
exports.formatWaitTime = formatWaitTime;
async function handleBanStatus(unblockTime) {
    if (Date.now() < unblockTime) {
        const waitTime = unblockTime - Date.now();
        console.log(`Waiting for ${formatWaitTime(waitTime)} until unblock time`);
        await new Promise((resolve) => setTimeout(resolve, Math.min(waitTime, 60000)));
        return true;
    }
    return false;
}
exports.handleBanStatus = handleBanStatus;
function extractBanTime(errorMessage) {
    if (errorMessage.includes("IP banned until")) {
        const match = errorMessage.match(/until (\d+)/);
        if (match) {
            return parseInt(match[1]);
        }
    }
    return null;
}
exports.extractBanTime = extractBanTime;
async function handleExchangeError(error, ExchangeManager) {
    const banTime = extractBanTime(error.message);
    if (banTime) {
        await saveBanStatus(banTime);
        return banTime;
    }
    await ExchangeManager.stopExchange();
    await new Promise((resolve) => setTimeout(resolve, 5000));
    return await ExchangeManager.startExchange();
}
exports.handleExchangeError = handleExchangeError;
function sanitizeErrorMessage(errorMessage) {
    // Handle undefined or null inputs explicitly
    if (errorMessage == null) {
        // Customize this message as needed
        return "An unknown error occurred";
    }
    // Convert Error objects to their message string
    if (errorMessage instanceof Error) {
        errorMessage = errorMessage.message;
    }
    // Proceed with sanitization only if errorMessage is a string
    if (typeof errorMessage === "string") {
        const keywordsToHide = ["kucoin", "binance", "okx"];
        let sanitizedMessage = errorMessage;
        keywordsToHide.forEach((keyword) => {
            const regex = new RegExp(keyword, "gi"); // 'gi' for global and case-insensitive match
            sanitizedMessage = sanitizedMessage.replace(regex, "***");
        });
        return sanitizedMessage;
    }
    // Return the input unchanged if it's not a string, as we only sanitize strings
    return errorMessage;
}
exports.sanitizeErrorMessage = sanitizeErrorMessage;
exports.baseOrderBookEntrySchema = {
    type: "array",
    items: {
        type: "number",
        description: "Order book entry consisting of price and volume",
    },
};
exports.baseOrderBookSchema = {
    asks: {
        type: "array",
        items: exports.baseOrderBookEntrySchema,
        description: "Asks are sell orders in the order book",
    },
    bids: {
        type: "array",
        items: exports.baseOrderBookEntrySchema,
        description: "Bids are buy orders in the order book",
    },
};
exports.baseTickerSchema = {
    symbol: (0, schema_1.baseStringSchema)("Trading symbol for the market pair"),
    bid: (0, schema_1.baseNumberSchema)("Current highest bid price"),
    ask: (0, schema_1.baseNumberSchema)("Current lowest ask price"),
    close: (0, schema_1.baseNumberSchema)("Last close price"),
    last: (0, schema_1.baseNumberSchema)("Most recent transaction price"),
    change: (0, schema_1.baseNumberSchema)("Price change percentage"),
    baseVolume: (0, schema_1.baseNumberSchema)("Volume of base currency traded"),
    quoteVolume: (0, schema_1.baseNumberSchema)("Volume of quote currency traded"),
};
exports.baseWatchlistItemSchema = {
    id: (0, schema_1.baseStringSchema)("Unique identifier for the watchlist item", undefined, undefined, false, undefined, "uuid"),
    userId: (0, schema_1.baseStringSchema)("User ID associated with the watchlist item", undefined, undefined, false, undefined, "uuid"),
    symbol: (0, schema_1.baseStringSchema)("Symbol of the watchlist item"),
};
