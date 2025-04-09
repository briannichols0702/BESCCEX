"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const Websocket_1 = require("@b/handler/Websocket");
const matchingEngine_1 = require("@b/utils/eco/matchingEngine");
const queries_1 = require("@b/utils/eco/scylla/queries");
exports.metadata = {};
exports.default = async (data, message) => {
    if (typeof message === "string") {
        message = JSON.parse(message);
    }
    const { type, symbol } = message.payload;
    switch (type) {
        case "orderbook":
            const orderbook = await (0, queries_1.getOrderBook)(symbol);
            (0, Websocket_1.sendMessageToRoute)(`/api/ext/ecosystem/market`, { type: "orderbook", symbol }, {
                stream: "orderbook",
                data: orderbook,
            });
            break;
        case "trades":
            (0, Websocket_1.sendMessageToRoute)(`/api/ext/ecosystem/market`, { type: "trades", symbol }, {
                stream: "trades",
                data: [],
            });
            break;
        case "ticker":
            const engine = await matchingEngine_1.MatchingEngine.getInstance();
            const ticker = await engine.getTicker(symbol);
            (0, Websocket_1.sendMessageToRoute)(`/api/ext/ecosystem/market`, { type: "ticker", symbol }, {
                stream: "ticker",
                data: ticker,
            });
            break;
        default:
            break;
    }
};
