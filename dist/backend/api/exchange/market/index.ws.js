"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderbookHandler = exports.TradesHandler = exports.OHLCVHandler = exports.TickerHandler = exports.metadata = void 0;
const exchange_1 = __importDefault(require("@b/utils/exchange"));
const Websocket_1 = require("@b/handler/Websocket");
const logger_1 = require("@b/utils/logger");
const utils_1 = require("../utils");
exports.metadata = {};
class BaseMarketDataHandler {
    constructor() {
        this.accumulatedBuffer = {};
        this.bufferInterval = null;
        this.unblockTime = 0;
        this.activeSubscriptions = new Set();
        this.exchange = null;
        this.symbolToStreamKey = {};
    }
    flushBuffer(type) {
        Object.entries(this.accumulatedBuffer).forEach(([streamKey, data]) => {
            if (Object.keys(data).length > 0) {
                const route = `/api/exchange/market`;
                const payload = { ...data.payload, symbol: data.symbol };
                (0, Websocket_1.sendMessageToRoute)(route, payload, {
                    stream: streamKey, // Do not include the symbol in the stream key for frontend
                    data: data.msg,
                });
                delete this.accumulatedBuffer[streamKey];
            }
        });
    }
    async fetchDataWithRetries(fetchFunction) {
        if (Date.now() < this.unblockTime) {
            throw new Error(`Blocked until ${new Date(this.unblockTime).toLocaleString()}`);
        }
        return await fetchFunction();
    }
    async handleSubscription(symbol, type, interval, limit) {
        const frontendStreamKey = `${type}${interval ? `:${interval}` : ""}${limit ? `:${limit}` : ""}`;
        const internalStreamKey = `${symbol}:${frontendStreamKey}`;
        this.symbolToStreamKey[frontendStreamKey] = symbol;
        const fetchData = {
            ticker: async () => ({
                msg: await this.exchange.watchTicker(symbol),
                payload: { type },
            }),
            ohlcv: async () => ({
                msg: await this.exchange.watchOHLCV(symbol, interval, undefined, Number(limit) || 1000),
                payload: { type, interval, limit },
            }),
            trades: async () => ({
                msg: await this.exchange.watchTrades(symbol, undefined, limit ? Number(limit) : 20),
                payload: { type, limit },
            }),
            orderbook: async () => ({
                msg: await this.exchange.watchOrderBook(symbol, limit ? Number(limit) : 100),
                payload: { type, limit },
            }),
        };
        while (this.activeSubscriptions.has(internalStreamKey) &&
            (0, Websocket_1.hasClients)(`/api/exchange/market`)) {
            try {
                if (Date.now() < this.unblockTime) {
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                    continue;
                }
                const { msg, payload } = await this.fetchDataWithRetries(() => fetchData[type]());
                this.accumulatedBuffer[frontendStreamKey] = { symbol, msg, payload };
                await new Promise((resolve) => setTimeout(resolve, 250));
            }
            catch (error) {
                (0, logger_1.logError)("exchange", error, __filename);
                const result = await (0, utils_1.handleExchangeError)(error, exchange_1.default);
                if (typeof result === "number") {
                    this.unblockTime = result;
                    await (0, utils_1.saveBanStatus)(this.unblockTime);
                }
                else {
                    this.exchange = result;
                }
                await new Promise((resolve) => setTimeout(resolve, 5000));
            }
        }
        this.activeSubscriptions.delete(internalStreamKey);
    }
    async start(message, flushInterval) {
        try {
            this.unblockTime = await (0, utils_1.loadBanStatus)();
            if (typeof message === "string") {
                message = JSON.parse(message);
            }
            const { symbol, type, interval, limit } = message.payload;
            if (!this.bufferInterval) {
                this.bufferInterval = setInterval(() => this.flushBuffer(type), flushInterval);
            }
            if (!this.exchange) {
                this.exchange = await exchange_1.default.startExchange();
                if (!this.exchange) {
                    throw new Error("Failed to start exchange");
                }
            }
            const typeMap = {
                ticker: "watchTicker",
                ohlcv: "watchOHLCV",
                trades: "watchTrades",
                orderbook: "watchOrderBook",
            };
            if (!this.exchange.has[typeMap[type]]) {
                console.info(`Endpoint ${type} is not available`);
                return;
            }
            const internalStreamKey = `${symbol}:${type}${interval ? `:${interval}` : ""}${limit ? `:${limit}` : ""}`;
            if (!this.activeSubscriptions.has(internalStreamKey)) {
                this.activeSubscriptions.add(internalStreamKey);
                this.handleSubscription(symbol, type, interval, limit);
            }
        }
        catch (error) {
            (0, logger_1.logError)("exchange", error, __filename);
        }
    }
    async stop() {
        this.activeSubscriptions.clear();
        if (this.bufferInterval) {
            clearInterval(this.bufferInterval);
            this.bufferInterval = null;
        }
        if (this.exchange) {
            await exchange_1.default.stopExchange();
            this.exchange = null;
        }
    }
}
class TickerHandler extends BaseMarketDataHandler {
    constructor() {
        super();
    }
    static getInstance() {
        if (!TickerHandler.instance) {
            TickerHandler.instance = new TickerHandler();
        }
        return TickerHandler.instance;
    }
}
exports.TickerHandler = TickerHandler;
class OHLCVHandler extends BaseMarketDataHandler {
    constructor() {
        super();
    }
    static getInstance() {
        if (!OHLCVHandler.instance) {
            OHLCVHandler.instance = new OHLCVHandler();
        }
        return OHLCVHandler.instance;
    }
}
exports.OHLCVHandler = OHLCVHandler;
class TradesHandler extends BaseMarketDataHandler {
    constructor() {
        super();
    }
    static getInstance() {
        if (!TradesHandler.instance) {
            TradesHandler.instance = new TradesHandler();
        }
        return TradesHandler.instance;
    }
}
exports.TradesHandler = TradesHandler;
class OrderbookHandler extends BaseMarketDataHandler {
    constructor() {
        super();
    }
    static getInstance() {
        if (!OrderbookHandler.instance) {
            OrderbookHandler.instance = new OrderbookHandler();
        }
        return OrderbookHandler.instance;
    }
}
exports.OrderbookHandler = OrderbookHandler;
exports.default = async (data, message) => {
    let parsedMessage;
    if (typeof message === "string") {
        try {
            parsedMessage = JSON.parse(message);
        }
        catch (error) {
            (0, logger_1.logError)("Invalid JSON message", error, __filename);
            return;
        }
    }
    else {
        parsedMessage = message;
    }
    const { type } = parsedMessage.payload;
    switch (type) {
        case "ticker":
            await TickerHandler.getInstance().start(parsedMessage, 500);
            break;
        case "ohlcv":
            await OHLCVHandler.getInstance().start(parsedMessage, 400);
            break;
        case "orderbook":
            await OrderbookHandler.getInstance().start(parsedMessage, 600);
            break;
        case "trades":
            await TradesHandler.getInstance().start(parsedMessage, 700);
            break;
        default:
            throw new Error(`Unknown type: ${type}`);
    }
};
