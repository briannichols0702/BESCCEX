"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlePositionBroadcast = exports.handleTickersBroadcast = exports.handleCandleBroadcast = exports.handleTickerBroadcast = exports.handleTradesBroadcast = exports.handleOrderBroadcast = exports.handleOrderBookBroadcast = void 0;
const Websocket_1 = require("@b/handler/Websocket");
const blockchain_1 = require("@b/utils/eco/blockchain");
async function handleOrderBookBroadcast(symbol, book) {
    try {
        if (!book) {
            console.error("Book is undefined");
            return;
        }
        const threshold = 1e-10;
        const orderbook = {
            asks: Object.entries(book.asks || {})
                .map(([price, amount]) => [
                (0, blockchain_1.fromWei)(Number(price)),
                (0, blockchain_1.fromWei)(Number(amount)),
            ])
                .filter(([price, amount]) => price > threshold && amount > threshold),
            bids: Object.entries(book.bids || {})
                .map(([price, amount]) => [
                (0, blockchain_1.fromWei)(Number(price)),
                (0, blockchain_1.fromWei)(Number(amount)),
            ])
                .filter(([price, amount]) => price > threshold && amount > threshold),
        };
        (0, Websocket_1.sendMessageToRoute)(`/api/ext/futures/market`, { type: "orderbook", symbol }, {
            stream: "orderbook",
            data: orderbook,
        });
    }
    catch (error) {
        console.error(`Failed to fetch and broadcast order book: ${error}`);
    }
}
exports.handleOrderBookBroadcast = handleOrderBookBroadcast;
async function handleOrderBroadcast(order) {
    const filteredOrder = {
        ...order,
        price: (0, blockchain_1.fromBigInt)(order.price),
        amount: (0, blockchain_1.fromBigInt)(order.amount),
        filled: (0, blockchain_1.fromBigInt)(order.filled),
        remaining: (0, blockchain_1.fromBigInt)(order.remaining),
        cost: (0, blockchain_1.fromBigInt)(order.cost),
        fee: (0, blockchain_1.fromBigInt)(order.fee),
        average: (0, blockchain_1.fromBigInt)(order.average),
        leverage: (0, blockchain_1.fromBigInt)(order.leverage),
        stopLossPrice: order.stopLossPrice
            ? (0, blockchain_1.fromBigInt)(order.stopLossPrice)
            : undefined,
        takeProfitPrice: order.takeProfitPrice
            ? (0, blockchain_1.fromBigInt)(order.takeProfitPrice)
            : undefined,
    };
    (0, Websocket_1.sendMessageToRoute)(`/api/ext/futures/market/${order.symbol}`, { type: "orders", userId: order.userId }, {
        stream: "orders",
        data: filteredOrder,
    });
}
exports.handleOrderBroadcast = handleOrderBroadcast;
async function handleTradesBroadcast(symbol, trades) {
    (0, Websocket_1.sendMessageToRoute)(`/api/ext/futures/market`, { type: "trades", symbol }, {
        stream: "trades",
        data: trades,
    });
}
exports.handleTradesBroadcast = handleTradesBroadcast;
async function handleTickerBroadcast(symbol, ticker) {
    (0, Websocket_1.sendMessageToRoute)(`/api/ext/futures/market`, { type: "ticker", symbol }, {
        stream: "ticker",
        data: ticker,
    });
}
exports.handleTickerBroadcast = handleTickerBroadcast;
async function handleCandleBroadcast(symbol, interval, candle) {
    if (!candle || !candle.createdAt) {
        console.error("Candle data or createdAt property is missing");
        return;
    }
    const parsedCandle = [
        new Date(candle.createdAt).getTime(),
        candle.open,
        candle.high,
        candle.low,
        candle.close,
        candle.volume,
    ];
    (0, Websocket_1.sendMessageToRoute)(`/api/ext/futures/market`, { type: "ohlcv", interval, symbol }, {
        stream: "ohlcv",
        data: [parsedCandle],
    });
}
exports.handleCandleBroadcast = handleCandleBroadcast;
async function handleTickersBroadcast(tickers) {
    (0, Websocket_1.sendMessageToRoute)(`/api/ext/futures/ticker`, { type: "tickers" }, {
        stream: "tickers",
        data: tickers,
    });
}
exports.handleTickersBroadcast = handleTickersBroadcast;
async function handlePositionBroadcast(position) {
    const filteredPosition = {
        ...position,
        entryPrice: (0, blockchain_1.fromBigInt)(position.entryPrice),
        amount: (0, blockchain_1.fromBigInt)(position.amount),
        unrealizedPnl: (0, blockchain_1.fromBigInt)(position.unrealizedPnl),
        stopLossPrice: position.stopLossPrice
            ? (0, blockchain_1.fromBigInt)(position.stopLossPrice)
            : undefined,
        takeProfitPrice: position.takeProfitPrice
            ? (0, blockchain_1.fromBigInt)(position.takeProfitPrice)
            : undefined,
    };
    (0, Websocket_1.sendMessageToRoute)(`/api/ext/futures/market/${position.symbol}`, { type: "positions", userId: position.userId }, {
        stream: "positions",
        data: filteredPosition,
    });
}
exports.handlePositionBroadcast = handlePositionBroadcast;
