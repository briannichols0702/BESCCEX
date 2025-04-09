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
exports.generateOrderBookUpdateQueries = exports.updateSingleOrderBook = exports.fetchExistingAmounts = exports.updateOrderBookInDB = exports.fetchOrderBooks = exports.getOrderBook = exports.getOrderbookEntry = exports.query = void 0;
const blockchain_1 = require("@b/utils/eco/blockchain");
const client_1 = __importStar(require("@b/utils/eco/scylla/client"));
const logger_1 = require("@b/utils/logger");
async function query(q, params = []) {
    return client_1.default.execute(q, params, { prepare: true });
}
exports.query = query;
async function getOrderbookEntry(symbol, price, side) {
    const query = `
    SELECT * FROM ${client_1.scyllaFuturesKeyspace}.orderbook
    WHERE symbol = ? AND price = ? AND side = ?;
  `;
    const params = [symbol, price, side];
    try {
        const result = await client_1.default.execute(query, params, { prepare: true });
        if (result.rows.length > 0) {
            const row = result.rows[0];
            return (0, blockchain_1.toBigIntFloat)(row["amount"]);
        }
        else {
            console.warn(`Orderbook entry not found for params: ${JSON.stringify(params)}`);
            return null;
        }
    }
    catch (error) {
        console.error(`Failed to fetch futures orderbook entry: ${error.message}`);
        throw new Error(`Failed to fetch futures orderbook entry: ${error.message}`);
    }
}
exports.getOrderbookEntry = getOrderbookEntry;
async function getOrderBook(symbol) {
    const askQuery = `
    SELECT * FROM ${client_1.scyllaFuturesKeyspace}.orderbook
    WHERE symbol = ? AND side = 'ASKS'
    LIMIT 50;
  `;
    const bidQuery = `
    SELECT * FROM ${client_1.scyllaFuturesKeyspace}.orderbook
    WHERE symbol = ? AND side = 'BIDS'
    ORDER BY price DESC
    LIMIT 50;
  `;
    const [askRows, bidRows] = await Promise.all([
        client_1.default.execute(askQuery, [symbol], { prepare: true }),
        client_1.default.execute(bidQuery, [symbol], { prepare: true }),
    ]);
    const asks = askRows.rows.map((row) => [row.price, row.amount]);
    const bids = bidRows.rows.map((row) => [row.price, row.amount]);
    return { asks, bids };
}
exports.getOrderBook = getOrderBook;
async function fetchOrderBooks() {
    const query = `
    SELECT * FROM ${client_1.scyllaFuturesKeyspace}.orderbook;
  `;
    try {
        const result = await client_1.default.execute(query);
        return result.rows.map((row) => ({
            symbol: row.symbol,
            price: row.price,
            amount: row.amount,
            side: row.side,
        }));
    }
    catch (error) {
        console.error(`Failed to fetch futures order books: ${error.message}`);
        return null;
    }
}
exports.fetchOrderBooks = fetchOrderBooks;
async function updateOrderBookInDB(symbol, price, amount, side) {
    let query;
    let params;
    if (amount > 0) {
        query = `
      INSERT INTO ${client_1.scyllaFuturesKeyspace}.orderbook (symbol, price, amount, side)
      VALUES (?, ?, ?, ?);
    `;
        params = [symbol, price, amount, side.toUpperCase()];
    }
    else {
        query = `
      DELETE FROM ${client_1.scyllaFuturesKeyspace}.orderbook
      WHERE symbol = ? AND price = ? AND side = ?;
    `;
        params = [symbol, price, side.toUpperCase()];
    }
    try {
        await client_1.default.execute(query, params, { prepare: true });
    }
    catch (error) {
        console.error(`Failed to update futures order book: ${error.message}`);
    }
}
exports.updateOrderBookInDB = updateOrderBookInDB;
async function fetchExistingAmounts(symbol) {
    try {
        const result = await client_1.default.execute(`SELECT price, side, amount FROM ${client_1.scyllaFuturesKeyspace}.orderbook_by_symbol WHERE symbol = ?;`, [symbol]);
        const symbolOrderBook = { bids: {}, asks: {} };
        result.rows.forEach((row) => {
            const side = row.side === "BIDS" ? "bids" : "asks";
            const priceStr = (0, blockchain_1.removeTolerance)((0, blockchain_1.toBigIntFloat)(row.price)).toString();
            symbolOrderBook[side][priceStr] = (0, blockchain_1.removeTolerance)((0, blockchain_1.toBigIntFloat)(row.amount));
        });
        return symbolOrderBook;
    }
    catch (error) {
        (0, logger_1.logError)("fetch_existing_amounts", error, __filename);
        console.error(`Failed to fetch existing amounts for ${symbol}:`, error);
        throw new Error(`Failed to fetch existing amounts for ${symbol}`);
    }
}
exports.fetchExistingAmounts = fetchExistingAmounts;
async function updateSingleOrderBook(order, operation) {
    try {
        const result = await client_1.default.execute(`SELECT price, side, amount FROM ${client_1.scyllaFuturesKeyspace}.orderbook_by_symbol WHERE symbol = ?;`, [order.symbol]);
        const symbolOrderBook = { bids: {}, asks: {} };
        result.rows.forEach((row) => {
            const side = row.side === "BIDS" ? "bids" : "asks";
            symbolOrderBook[side][(0, blockchain_1.removeTolerance)((0, blockchain_1.toBigIntFloat)(row.price)).toString()] = (0, blockchain_1.removeTolerance)((0, blockchain_1.toBigIntFloat)(row.amount));
        });
        const side = order.side === "BUY" ? "bids" : "asks";
        const price = (0, blockchain_1.removeTolerance)(BigInt(order.price));
        const existingAmount = symbolOrderBook[side][price.toString()] || BigInt(0);
        let newAmount = BigInt(0);
        if (operation === "add") {
            newAmount = existingAmount + (0, blockchain_1.removeTolerance)(BigInt(order.amount));
        }
        else if (operation === "subtract") {
            newAmount = existingAmount - (0, blockchain_1.removeTolerance)(BigInt(order.amount));
        }
        if (newAmount > BigInt(0)) {
            await client_1.default.execute(`INSERT INTO ${client_1.scyllaFuturesKeyspace}.orderbook (symbol, price, side, amount) VALUES (?, ?, ?, ?)`, [
                order.symbol,
                (0, blockchain_1.fromBigInt)(price),
                order.side === "BUY" ? "BIDS" : "ASKS",
                (0, blockchain_1.fromBigInt)(newAmount),
            ]);
            symbolOrderBook[side][price.toString()] = newAmount;
        }
        else {
            await client_1.default.execute(`DELETE FROM ${client_1.scyllaFuturesKeyspace}.orderbook WHERE symbol = ? AND price = ? AND side = ?`, [
                order.symbol,
                (0, blockchain_1.fromBigInt)(price),
                order.side === "BUY" ? "BIDS" : "ASKS",
            ]);
            delete symbolOrderBook[side][price.toString()];
        }
        return symbolOrderBook;
    }
    catch (err) {
        (0, logger_1.logError)("update_single_order_book", err, __filename);
        console.error("Failed to update order book in database:", err);
        throw new Error("Failed to update order book in database");
    }
}
exports.updateSingleOrderBook = updateSingleOrderBook;
function generateOrderBookUpdateQueries(mappedOrderBook) {
    const queries = [];
    for (const [symbol, sides] of Object.entries(mappedOrderBook)) {
        for (const [side, priceAmountMap] of Object.entries(sides)) {
            if (Object.keys(priceAmountMap).length === 0) {
                queries.push({
                    query: `DELETE FROM ${client_1.scyllaFuturesKeyspace}.orderbook WHERE symbol = ? AND side = ?`,
                    params: [symbol, side.toUpperCase()],
                });
                continue;
            }
            for (const [price, amount] of Object.entries(priceAmountMap)) {
                if (amount > BigInt(0)) {
                    queries.push({
                        query: `UPDATE ${client_1.scyllaFuturesKeyspace}.orderbook SET amount = ? WHERE symbol = ? AND price = ? AND side = ?`,
                        params: [
                            (0, blockchain_1.fromBigInt)((0, blockchain_1.removeTolerance)(BigInt(amount))),
                            symbol,
                            (0, blockchain_1.fromBigInt)((0, blockchain_1.removeTolerance)(BigInt(price))),
                            side.toUpperCase(),
                        ],
                    });
                }
                else {
                    queries.push({
                        query: `DELETE FROM ${client_1.scyllaFuturesKeyspace}.orderbook WHERE symbol = ? AND price = ? AND side = ?`,
                        params: [
                            symbol,
                            (0, blockchain_1.fromBigInt)((0, blockchain_1.removeTolerance)(BigInt(price))),
                            side.toUpperCase(),
                        ],
                    });
                }
            }
        }
    }
    return queries;
}
exports.generateOrderBookUpdateQueries = generateOrderBookUpdateQueries;
