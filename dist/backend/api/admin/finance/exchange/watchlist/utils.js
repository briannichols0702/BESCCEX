"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseExchangeWatchlistSchema = void 0;
const schema_1 = require("@b/utils/schema");
exports.baseExchangeWatchlistSchema = {
    id: (0, schema_1.baseStringSchema)("ID of the exchange watchlist entry"),
    userId: (0, schema_1.baseStringSchema)("User ID associated with the watchlist"),
    symbol: (0, schema_1.baseStringSchema)("Symbol of the watchlist item"),
};
