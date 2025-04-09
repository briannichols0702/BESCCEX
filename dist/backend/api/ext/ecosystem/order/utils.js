"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseHistoricalDataSchema = exports.baseTickerSchema = exports.baseOrderSchema = void 0;
const schema_1 = require("@b/utils/schema");
exports.baseOrderSchema = {
    id: (0, schema_1.baseStringSchema)("Order ID"),
    symbol: (0, schema_1.baseStringSchema)("Trading symbol"),
    type: (0, schema_1.baseStringSchema)("Order type"),
    side: (0, schema_1.baseStringSchema)("Order side (buy/sell)"),
    amount: (0, schema_1.baseStringSchema)("Order amount, converted from bigint"),
    price: (0, schema_1.baseStringSchema)("Order price, converted from bigint"),
    cost: (0, schema_1.baseStringSchema)("Total cost, converted from bigint"),
    fee: (0, schema_1.baseStringSchema)("Order fee, converted from bigint"),
    filled: (0, schema_1.baseStringSchema)("Filled amount, converted from bigint"),
    remaining: (0, schema_1.baseStringSchema)("Remaining amount, converted from bigint"),
    status: (0, schema_1.baseStringSchema)("Order status"),
};
exports.baseTickerSchema = {
    symbol: (0, schema_1.baseStringSchema)("Trading symbol"),
    price: (0, schema_1.baseStringSchema)("Latest trading price"),
};
exports.baseHistoricalDataSchema = {
    openTime: (0, schema_1.baseNumberSchema)("Open time of the candle"),
    closeTime: (0, schema_1.baseNumberSchema)("Close time of the candle"),
    open: (0, schema_1.baseStringSchema)("Opening price"),
    high: (0, schema_1.baseStringSchema)("Highest price"),
    low: (0, schema_1.baseStringSchema)("Lowest price"),
    close: (0, schema_1.baseStringSchema)("Closing price"),
    volume: (0, schema_1.baseStringSchema)("Volume"),
};
