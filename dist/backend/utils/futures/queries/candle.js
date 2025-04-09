"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getYesterdayCandles = exports.getLastCandles = exports.getHistoricalCandles = void 0;
const client_1 = __importStar(require("@b/utils/eco/scylla/client"));
async function getHistoricalCandles(symbol, interval, from, to) {
    try {
        const query = `
      SELECT * FROM ${client_1.scyllaFuturesKeyspace}.candles
      WHERE symbol = ?
      AND interval = ?
      AND "createdAt" >= ?
      AND "createdAt" <= ?
      ORDER BY "createdAt" ASC;
    `;
        const params = [symbol, interval, new Date(from), new Date(to)];
        // Execute the query using your existing ScyllaDB client
        const result = await client_1.default.execute(query, params, { prepare: true });
        // Map the rows to Candle objects
        const candles = result.rows.map((row) => [
            row.createdAt.getTime(),
            row.open,
            row.high,
            row.low,
            row.close,
            row.volume,
        ]);
        return candles;
    }
    catch (error) {
        throw new Error(`Failed to fetch historical futures candles: ${error.message}`);
    }
}
exports.getHistoricalCandles = getHistoricalCandles;
/**
 * Fetches the latest futures candle for each interval.
 * @returns A Promise that resolves with an array of the latest futures candles.
 */
async function getLastCandles() {
    try {
        // Fetch the latest candle for each symbol and interval
        const query = `
      SELECT symbol, interval, open, high, low, close, volume, "createdAt", "updatedAt" 
      FROM ${client_1.scyllaFuturesKeyspace}.latest_candles;
    `;
        const result = await client_1.default.execute(query, [], { prepare: true });
        const latestCandles = result.rows.map((row) => {
            return {
                symbol: row.symbol,
                interval: row.interval,
                open: row.open,
                high: row.high,
                low: row.low,
                close: row.close,
                volume: row.volume,
                createdAt: new Date(row.createdAt),
                updatedAt: new Date(row.updatedAt),
            };
        });
        return latestCandles;
    }
    catch (error) {
        console.error(`Failed to fetch latest futures candles: ${error.message}`);
        throw new Error(`Failed to fetch latest futures candles: ${error.message}`);
    }
}
exports.getLastCandles = getLastCandles;
async function getYesterdayCandles() {
    try {
        // Calculate the date range for "yesterday"
        const endOfYesterday = new Date();
        endOfYesterday.setHours(0, 0, 0, 0);
        const startOfYesterday = new Date(endOfYesterday.getTime() - 24 * 60 * 60 * 1000);
        // Query to get futures candles for yesterday
        const query = `
      SELECT * FROM ${client_1.scyllaFuturesKeyspace}.latest_candles
      WHERE "createdAt" >= ? AND "createdAt" < ?;
    `;
        const result = await client_1.default.execute(query, [startOfYesterday.toISOString(), endOfYesterday.toISOString()], { prepare: true });
        const yesterdayCandles = {};
        for (const row of result.rows) {
            // Only consider candles with a '1d' interval
            if (row.interval !== "1d") {
                continue;
            }
            const candle = {
                symbol: row.symbol,
                interval: row.interval,
                open: row.open,
                high: row.high,
                low: row.low,
                close: row.close,
                volume: row.volume,
                createdAt: new Date(row.createdAt),
                updatedAt: new Date(row.updatedAt),
            };
            if (!yesterdayCandles[row.symbol]) {
                yesterdayCandles[row.symbol] = [];
            }
            yesterdayCandles[row.symbol].push(candle);
        }
        return yesterdayCandles;
    }
    catch (error) {
        console.error(`Failed to fetch yesterday's futures candles: ${error.message}`);
        throw new Error(`Failed to fetch yesterday's futures candles: ${error.message}`);
    }
}
exports.getYesterdayCandles = getYesterdayCandles;
