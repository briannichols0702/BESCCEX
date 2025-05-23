"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLatestOrdersForCandles = exports.intervals = void 0;
exports.intervals = [
    "1m",
    "3m",
    "5m",
    "15m",
    "30m",
    "1h",
    "2h",
    "4h",
    "6h",
    "12h",
    "1d",
    "3d",
    "1w",
];
function getLatestOrdersForCandles(orders) {
    const latestOrdersMap = {};
    orders.forEach((order) => {
        if (!latestOrdersMap[order.symbol] ||
            latestOrdersMap[order.symbol].updatedAt < order.updatedAt) {
            latestOrdersMap[order.symbol] = order;
        }
    });
    return Object.values(latestOrdersMap);
}
exports.getLatestOrdersForCandles = getLatestOrdersForCandles;
