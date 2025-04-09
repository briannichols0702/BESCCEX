"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const Websocket_1 = require("@b/handler/Websocket");
const matchingEngine_1 = require("@b/utils/futures/matchingEngine");
exports.metadata = {};
exports.default = async (data, message) => {
    if (typeof message === "string") {
        message = JSON.parse(message);
    }
    const engine = await matchingEngine_1.FuturesMatchingEngine.getInstance();
    const tickers = await engine.getTickers();
    (0, Websocket_1.sendMessageToRoute)(`/api/ext/futures/ticker`, { type: "tickers" }, {
        stream: "tickers",
        data: tickers,
    });
};
