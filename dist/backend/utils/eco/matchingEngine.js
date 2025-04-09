"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchingEngine = void 0;
const blockchain_1 = require("./blockchain");
const candles_1 = require("./candles");
const matchmaking_1 = require("./matchmaking");
const orderbook_1 = require("./orderbook");
const client_1 = __importDefault(require("./scylla/client"));
const queries_1 = require("./scylla/queries");
const ws_1 = require("./ws");
const markets_1 = require("./markets");
const logger_1 = require("@b/utils/logger");
const uuid_1 = require("uuid");
function uuidToString(uuid) {
    return (0, uuid_1.stringify)(uuid.buffer);
}
class MatchingEngine {
    constructor() {
        this.orderQueue = {};
        this.marketsBySymbol = {};
        this.lockedOrders = new Set();
        this.lastCandle = {};
        this.yesterdayCandle = {};
    }
    static getInstance() {
        if (!this.instancePromise) {
            this.instancePromise = (async () => {
                const instance = new MatchingEngine();
                await instance.init();
                return instance;
            })();
        }
        return this.instancePromise;
    }
    async init() {
        await this.initializeMarkets();
        await this.initializeOrders();
        await this.initializeLastCandles();
        await this.initializeYesterdayCandles();
    }
    async initializeMarkets() {
        const markets = await (0, markets_1.getEcoSystemMarkets)();
        markets.forEach((market) => {
            this.marketsBySymbol[market.symbol] = market;
            this.orderQueue[market.symbol] = [];
        });
    }
    async initializeOrders() {
        try {
            const openOrders = await (0, queries_1.getAllOpenOrders)();
            openOrders.forEach((order) => {
                var _a, _b, _c, _d, _e, _f, _g, _h;
                const createdAt = new Date(order.createdAt);
                const updatedAt = new Date(order.updatedAt);
                if (isNaN(createdAt.getTime()) || isNaN(updatedAt.getTime())) {
                    (0, logger_1.logError)("matching_engine", new Error("Invalid date in order"), __filename);
                    return;
                }
                if (!((_a = order.userId) === null || _a === void 0 ? void 0 : _a.buffer) || !((_b = order.id) === null || _b === void 0 ? void 0 : _b.buffer)) {
                    (0, logger_1.logError)("matching_engine", new Error("Invalid Uuid in order"), __filename);
                    return;
                }
                const normalizedOrder = {
                    ...order,
                    amount: BigInt((_c = order.amount) !== null && _c !== void 0 ? _c : 0),
                    price: BigInt((_d = order.price) !== null && _d !== void 0 ? _d : 0),
                    cost: BigInt((_e = order.cost) !== null && _e !== void 0 ? _e : 0),
                    fee: BigInt((_f = order.fee) !== null && _f !== void 0 ? _f : 0),
                    remaining: BigInt((_g = order.remaining) !== null && _g !== void 0 ? _g : 0),
                    filled: BigInt((_h = order.filled) !== null && _h !== void 0 ? _h : 0),
                    createdAt,
                    updatedAt,
                    userId: uuidToString(order.userId),
                    id: uuidToString(order.id),
                };
                if (!this.orderQueue[normalizedOrder.symbol]) {
                    this.orderQueue[normalizedOrder.symbol] = [];
                }
                this.orderQueue[normalizedOrder.symbol].push(normalizedOrder);
            });
            await this.processQueue();
        }
        catch (error) {
            (0, logger_1.logError)("matching_engine", error, __filename);
            console.error(`Failed to populate order queue with open orders: ${error}`);
        }
    }
    async initializeLastCandles() {
        try {
            const lastCandles = await (0, queries_1.getLastCandles)();
            lastCandles.forEach((candle) => {
                if (!this.lastCandle[candle.symbol]) {
                    this.lastCandle[candle.symbol] = {};
                }
                this.lastCandle[candle.symbol][candle.interval] = candle;
            });
        }
        catch (error) {
            (0, logger_1.logError)("matching_engine", error, __filename);
            console.error(`Failed to initialize last candles: ${error}`);
        }
    }
    async initializeYesterdayCandles() {
        try {
            const yesterdayCandles = await (0, queries_1.getYesterdayCandles)();
            Object.keys(yesterdayCandles).forEach((symbol) => {
                const candles = yesterdayCandles[symbol];
                if (candles.length > 0) {
                    this.yesterdayCandle[symbol] = candles[0];
                }
            });
        }
        catch (error) {
            (0, logger_1.logError)("matching_engine", error, __filename);
            console.error(`Failed to initialize yesterday's candles: ${error}`);
        }
    }
    async processQueue() {
        const ordersToUpdate = [];
        const orderBookUpdates = {};
        const allOrderBookEntries = await (0, queries_1.fetchOrderBooks)();
        const mappedOrderBook = {};
        allOrderBookEntries === null || allOrderBookEntries === void 0 ? void 0 : allOrderBookEntries.forEach((entry) => {
            if (!mappedOrderBook[entry.symbol]) {
                mappedOrderBook[entry.symbol] = { bids: {}, asks: {} };
            }
            mappedOrderBook[entry.symbol][entry.side.toLowerCase()][(0, blockchain_1.removeTolerance)((0, blockchain_1.toBigIntFloat)(Number(entry.price))).toString()] = (0, blockchain_1.removeTolerance)((0, blockchain_1.toBigIntFloat)(Number(entry.amount)));
        });
        const calculationPromises = [];
        for (const symbol in this.orderQueue) {
            const orders = this.orderQueue[symbol];
            if (orders.length === 0)
                continue;
            const promise = (async () => {
                const { matchedOrders, bookUpdates } = await (0, matchmaking_1.matchAndCalculateOrders)(orders, mappedOrderBook[symbol] || { bids: {}, asks: {} });
                if (matchedOrders.length === 0) {
                    return;
                }
                ordersToUpdate.push(...matchedOrders);
                orderBookUpdates[symbol] = bookUpdates;
            })();
            calculationPromises.push(promise);
        }
        await Promise.all(calculationPromises);
        if (ordersToUpdate.length === 0) {
            return;
        }
        await this.performUpdates(ordersToUpdate, orderBookUpdates);
        const finalOrderBooks = {};
        for (const symbol in orderBookUpdates) {
            finalOrderBooks[symbol] = (0, orderbook_1.applyUpdatesToOrderBook)(mappedOrderBook[symbol], orderBookUpdates[symbol]);
        }
        const cleanupPromises = [];
        for (const symbol in this.orderQueue) {
            const promise = (async () => {
                this.orderQueue[symbol] = this.orderQueue[symbol].filter((order) => order.status === "OPEN");
            })();
            cleanupPromises.push(promise);
        }
        await Promise.all(cleanupPromises);
        this.broadcastUpdates(ordersToUpdate, finalOrderBooks);
    }
    async performUpdates(ordersToUpdate, orderBookUpdates) {
        const locked = this.lockOrders(ordersToUpdate);
        if (!locked) {
            console.warn("Couldn't obtain a lock on all orders, skipping this batch.");
            return;
        }
        const updateQueries = [];
        updateQueries.push(...(0, queries_1.generateOrderUpdateQueries)(ordersToUpdate));
        const latestOrdersForCandles = (0, candles_1.getLatestOrdersForCandles)(ordersToUpdate);
        latestOrdersForCandles.forEach((order) => {
            updateQueries.push(...this.updateLastCandles(order));
        });
        const orderBookQueries = (0, orderbook_1.generateOrderBookUpdateQueries)(orderBookUpdates);
        updateQueries.push(...orderBookQueries);
        if (updateQueries.length > 0) {
            try {
                await client_1.default.batch(updateQueries, { prepare: true });
            }
            catch (error) {
                (0, logger_1.logError)("matching_engine", error, __filename);
                console.error("Failed to batch update:", error);
            }
        }
        else {
            console.warn("No queries to batch update.");
        }
        this.unlockOrders(ordersToUpdate);
    }
    async addToQueue(order) {
        if (!(0, matchmaking_1.validateOrder)(order)) {
            return;
        }
        if (!order.createdAt ||
            isNaN(new Date(order.createdAt).getTime()) ||
            !order.updatedAt ||
            isNaN(new Date(order.updatedAt).getTime())) {
            (0, logger_1.logError)("matching_engine", new Error("Invalid date in order"), __filename);
            return;
        }
        if (!this.orderQueue[order.symbol]) {
            this.orderQueue[order.symbol] = [];
        }
        this.orderQueue[order.symbol].push(order);
        const symbolOrderBook = await (0, orderbook_1.updateSingleOrderBook)(order, "add");
        (0, ws_1.handleOrderBookBroadcast)(order.symbol, symbolOrderBook);
        await this.processQueue();
    }
    updateLastCandles(order) {
        let finalPrice = BigInt(0);
        let trades;
        try {
            trades = JSON.parse(order.trades);
        }
        catch (error) {
            (0, logger_1.logError)("matching_engine", error, __filename);
            console.error("Failed to parse trades:", error);
            return [];
        }
        if (trades &&
            trades.length > 0 &&
            trades[trades.length - 1].price !== undefined) {
            finalPrice = (0, blockchain_1.toBigIntFloat)(trades[trades.length - 1].price);
        }
        else if (order.price !== undefined) {
            finalPrice = order.price;
        }
        else {
            (0, logger_1.logError)("matching_engine", new Error("Neither trade prices nor order price are available"), __filename);
            console.error("Neither trade prices nor order price are available");
            return [];
        }
        const updateQueries = [];
        if (!this.lastCandle[order.symbol]) {
            this.lastCandle[order.symbol] = {};
        }
        candles_1.intervals.forEach((interval) => {
            const updateQuery = this.generateCandleQueries(order, interval, finalPrice);
            if (updateQuery) {
                updateQueries.push(updateQuery);
            }
        });
        return updateQueries;
    }
    generateCandleQueries(order, interval, finalPrice) {
        var _a;
        const existingLastCandle = (_a = this.lastCandle[order.symbol]) === null || _a === void 0 ? void 0 : _a[interval];
        const normalizedCurrentTime = (0, ws_1.normalizeTimeToInterval)(new Date().getTime(), interval);
        const normalizedLastCandleTime = existingLastCandle
            ? (0, ws_1.normalizeTimeToInterval)(new Date(existingLastCandle.createdAt).getTime(), interval)
            : null;
        const shouldCreateNewCandle = !existingLastCandle || normalizedCurrentTime !== normalizedLastCandleTime;
        if (shouldCreateNewCandle) {
            const newOpenPrice = existingLastCandle
                ? existingLastCandle.close
                : (0, blockchain_1.fromBigInt)(finalPrice);
            if (!newOpenPrice) {
                return null;
            }
            const finalPriceNumber = (0, blockchain_1.fromBigInt)(finalPrice);
            const normalizedTime = new Date((0, ws_1.normalizeTimeToInterval)(new Date().getTime(), interval));
            const newLastCandle = {
                symbol: order.symbol,
                interval,
                open: newOpenPrice,
                high: Math.max(newOpenPrice, finalPriceNumber),
                low: Math.min(newOpenPrice, finalPriceNumber),
                close: finalPriceNumber,
                volume: (0, blockchain_1.fromBigInt)(order.amount),
                createdAt: normalizedTime,
                updatedAt: new Date(),
            };
            this.lastCandle[order.symbol][interval] = newLastCandle;
            return {
                query: `INSERT INTO candles (symbol, interval, "createdAt", "updatedAt", open, high, low, close, volume) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                params: [
                    order.symbol,
                    interval,
                    newLastCandle.createdAt,
                    newLastCandle.updatedAt,
                    newOpenPrice,
                    newLastCandle.high,
                    newLastCandle.low,
                    newLastCandle.close,
                    newLastCandle.volume,
                ],
            };
        }
        else {
            let updateQuery = `UPDATE candles SET "updatedAt" = ?, close = ?`;
            const now = new Date();
            const finalPriceNumber = (0, blockchain_1.fromBigInt)(finalPrice);
            const updateParams = [now, finalPriceNumber];
            const newVolume = existingLastCandle.volume + (0, blockchain_1.fromBigInt)(order.amount);
            updateQuery += ", volume = ?";
            updateParams.push(newVolume);
            if (finalPriceNumber > existingLastCandle.high) {
                updateQuery += ", high = ?";
                updateParams.push(finalPriceNumber);
                existingLastCandle.high = finalPriceNumber;
            }
            else if (finalPriceNumber < existingLastCandle.low) {
                updateQuery += ", low = ?";
                updateParams.push(finalPriceNumber);
                existingLastCandle.low = finalPriceNumber;
            }
            existingLastCandle.close = finalPriceNumber;
            existingLastCandle.volume = newVolume;
            existingLastCandle.updatedAt = now;
            this.lastCandle[order.symbol][interval] = existingLastCandle;
            updateQuery += ` WHERE symbol = ? AND interval = ? AND "createdAt" = ?`;
            updateParams.push(order.symbol, interval, existingLastCandle.createdAt);
            return {
                query: updateQuery,
                params: updateParams,
            };
        }
    }
    async broadcastUpdates(ordersToUpdate, finalOrderBooks) {
        const updatePromises = [];
        updatePromises.push(...this.createOrdersBroadcastPromise(ordersToUpdate));
        for (const symbol in this.orderQueue) {
            if (finalOrderBooks[symbol]) {
                updatePromises.push(this.createOrderBookUpdatePromise(symbol, finalOrderBooks[symbol]));
                updatePromises.push(...this.createCandleBroadcastPromises(symbol));
            }
        }
        await Promise.all(updatePromises);
    }
    createOrderBookUpdatePromise(symbol, finalOrderBookState) {
        return (0, ws_1.handleOrderBookBroadcast)(symbol, finalOrderBookState);
    }
    createCandleBroadcastPromises(symbol) {
        const promises = [];
        for (const interval in this.lastCandle[symbol]) {
            promises.push((0, ws_1.handleCandleBroadcast)(symbol, interval, this.lastCandle[symbol][interval]));
        }
        promises.push((0, ws_1.handleTickerBroadcast)(symbol, this.getTicker(symbol)), (0, ws_1.handleTickersBroadcast)(this.getTickers()));
        return promises;
    }
    createOrdersBroadcastPromise(orders) {
        return orders.map((order) => (0, ws_1.handleOrderBroadcast)(order));
    }
    lockOrders(orders) {
        for (const order of orders) {
            if (this.lockedOrders.has(order.id)) {
                return false;
            }
        }
        for (const order of orders) {
            this.lockedOrders.add(order.id);
        }
        return true;
    }
    unlockOrders(orders) {
        for (const order of orders) {
            this.lockedOrders.delete(order.id);
        }
    }
    async handleOrderCancellation(orderId, symbol) {
        this.orderQueue[symbol] = this.orderQueue[symbol].filter((order) => order.id !== orderId);
        const updatedOrderBook = await (0, orderbook_1.fetchExistingAmounts)(symbol);
        (0, ws_1.handleOrderBookBroadcast)(symbol, updatedOrderBook);
        await this.processQueue();
    }
    getTickers() {
        const symbolsWithTickers = {};
        for (const symbol in this.lastCandle) {
            const ticker = this.getTicker(symbol);
            if (ticker.last !== 0) {
                symbolsWithTickers[symbol] = ticker;
            }
        }
        return symbolsWithTickers;
    }
    getTicker(symbol) {
        var _a;
        const lastCandle = (_a = this.lastCandle[symbol]) === null || _a === void 0 ? void 0 : _a["1d"];
        const previousCandle = this.yesterdayCandle[symbol];
        if (!lastCandle) {
            return {
                symbol,
                last: 0,
                baseVolume: 0,
                quoteVolume: 0,
                change: 0,
                percentage: 0,
                high: 0,
                low: 0,
            };
        }
        const last = lastCandle.close;
        const baseVolume = lastCandle.volume;
        const quoteVolume = last * baseVolume;
        let change = 0;
        let percentage = 0;
        if (previousCandle) {
            const open = previousCandle.close;
            const close = lastCandle.close;
            change = close - open;
            percentage = ((close - open) / open) * 100;
        }
        return {
            symbol,
            last,
            baseVolume,
            quoteVolume,
            percentage,
            change,
            high: lastCandle.high,
            low: lastCandle.low,
        };
    }
}
exports.MatchingEngine = MatchingEngine;
MatchingEngine.instancePromise = null;
