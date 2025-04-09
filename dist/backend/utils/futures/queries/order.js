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
exports.getOrders = exports.deleteAllMarketData = exports.generateOrderUpdateQueries = exports.getAllOpenOrders = exports.createOrder = exports.cancelOrderByUuid = exports.getOrderByUuid = exports.getOrdersByUserId = exports.query = exports.uuidToString = void 0;
const blockchain_1 = require("@b/utils/eco/blockchain");
const client_1 = __importStar(require("@b/utils/eco/scylla/client"));
const passwords_1 = require("@b/utils/passwords");
const matchingEngine_1 = require("../matchingEngine");
const wallet_1 = require("@b/utils/eco/wallet");
const orderbook_1 = require("./orderbook");
const uuid_1 = require("uuid");
function uuidToString(uuid) {
    return (0, uuid_1.stringify)(uuid.buffer);
}
exports.uuidToString = uuidToString;
async function query(q, params = []) {
    return client_1.default.execute(q, params, { prepare: true });
}
exports.query = query;
/**
 * Retrieves orders by user ID with pagination.
 * @param userId - The ID of the user whose orders are to be retrieved.
 * @param pageState - The page state for pagination. Default is null.
 * @param limit - The maximum number of orders to retrieve per page. Default is 10.
 * @returns A Promise that resolves with an array of orders and the next page state.
 */
async function getOrdersByUserId(userId) {
    const query = `
    SELECT * FROM ${client_1.scyllaFuturesKeyspace}.orders
    WHERE "userId" = ?
    ORDER BY "createdAt" DESC;
  `;
    const params = [userId];
    try {
        const result = await client_1.default.execute(query, params, { prepare: true });
        return result.rows.map(mapRowToOrder);
    }
    catch (error) {
        console.error(`Failed to fetch futures orders by userId: ${error.message}`);
        throw new Error(`Failed to fetch futures orders by userId: ${error.message}`);
    }
}
exports.getOrdersByUserId = getOrdersByUserId;
function mapRowToOrder(row) {
    return {
        id: row.id,
        userId: row.userId,
        symbol: row.symbol,
        type: row.type,
        side: row.side,
        price: row.price,
        amount: row.amount,
        filled: row.filled,
        remaining: row.remaining,
        timeInForce: row.timeInForce,
        cost: row.cost,
        fee: row.fee,
        feeCurrency: row.feeCurrency,
        average: row.average,
        trades: row.trades,
        status: row.status,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        leverage: row.leverage,
        stopLossPrice: row.stopLossPrice,
        takeProfitPrice: row.takeProfitPrice,
    };
}
function getOrderByUuid(userId, id, createdAt) {
    const query = `
    SELECT * FROM ${client_1.scyllaFuturesKeyspace}.orders
    WHERE "userId" = ? AND id = ? AND "createdAt" = ?;
  `;
    const params = [userId, id, createdAt];
    return client_1.default
        .execute(query, params, { prepare: true })
        .then((result) => result.rows[0])
        .then(mapRowToOrder);
}
exports.getOrderByUuid = getOrderByUuid;
async function cancelOrderByUuid(userId, id, createdAt, symbol, price, side, amount) {
    const priceFormatted = (0, blockchain_1.fromBigInt)(price);
    const orderbookSide = side === "BUY" ? "BIDS" : "ASKS";
    const orderbookAmount = await (0, orderbook_1.getOrderbookEntry)(symbol, priceFormatted, orderbookSide);
    let orderbookQuery = "";
    let orderbookParams = [];
    if (orderbookAmount) {
        const newAmount = orderbookAmount - amount;
        if (newAmount <= BigInt(0)) {
            orderbookQuery = `DELETE FROM ${client_1.scyllaFuturesKeyspace}.orderbook WHERE symbol = ? AND price = ? AND side = ?`;
            orderbookParams = [symbol, priceFormatted.toString(), orderbookSide];
        }
        else {
            orderbookQuery = `UPDATE ${client_1.scyllaFuturesKeyspace}.orderbook SET amount = ? WHERE symbol = ? AND price = ? AND side = ?`;
            orderbookParams = [
                (0, blockchain_1.fromBigInt)(newAmount).toString(),
                symbol,
                priceFormatted.toString(),
                orderbookSide,
            ];
        }
    }
    else {
        console.warn(`No orderbook entry found for symbol: ${symbol}, price: ${priceFormatted}, side: ${orderbookSide}`);
    }
    const deleteOrderQuery = `DELETE FROM ${client_1.scyllaFuturesKeyspace}.orders WHERE "userId" = ? AND id = ? AND "createdAt" = ?`;
    const deleteOrderParams = [userId, id, createdAt];
    const batchQueries = orderbookQuery
        ? [
            { query: orderbookQuery, params: orderbookParams },
            { query: deleteOrderQuery, params: deleteOrderParams },
        ]
        : [{ query: deleteOrderQuery, params: deleteOrderParams }];
    try {
        await client_1.default.batch(batchQueries, { prepare: true });
    }
    catch (error) {
        console.error(`Failed to cancel futures order and update orderbook: ${error.message}`);
        throw new Error(`Failed to cancel futures order and update orderbook: ${error.message}`);
    }
}
exports.cancelOrderByUuid = cancelOrderByUuid;
function applyLeverage(amount, leverage) {
    return amount * BigInt(Math.max(1, Math.floor(leverage)));
}
/**
 * Creates a new order in the order table.
 * @param order - The order object to be inserted into the table.
 * @returns A Promise that resolves when the order has been successfully inserted.
 */
async function createOrder({ userId, symbol, amount, price, cost, type, side, fee, feeCurrency, leverage, stopLossPrice, takeProfitPrice, }) {
    const currentTimestamp = new Date();
    const leveragedAmount = applyLeverage(amount, leverage);
    const query = `
    INSERT INTO ${client_1.scyllaFuturesKeyspace}.orders (
      id, "userId", symbol, type, "timeInForce", side, price, average,
      amount, filled, remaining, cost, leverage, fee, "feeCurrency", status,
      "stopLossPrice", "takeProfitPrice", "createdAt", "updatedAt"
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
  `;
    const priceTolerance = (0, blockchain_1.removeTolerance)(price);
    const amountTolerance = (0, blockchain_1.removeTolerance)(leveragedAmount); // Use leveraged amount
    const costTolerance = (0, blockchain_1.removeTolerance)(cost);
    const feeTolerance = (0, blockchain_1.removeTolerance)(fee);
    const stopLossTolerance = stopLossPrice
        ? (0, blockchain_1.removeTolerance)(stopLossPrice)
        : undefined;
    const takeProfitTolerance = takeProfitPrice
        ? (0, blockchain_1.removeTolerance)(takeProfitPrice)
        : undefined;
    const id = (0, passwords_1.makeUuid)();
    const params = [
        id,
        userId,
        symbol,
        type,
        "GTC",
        side,
        priceTolerance.toString(),
        "0", // average
        amountTolerance.toString(),
        "0", // filled
        amountTolerance.toString(), // remaining
        costTolerance.toString(),
        leverage.toString(), // leverage as string
        feeTolerance.toString(),
        feeCurrency,
        "OPEN",
        stopLossTolerance ? stopLossTolerance.toString() : null,
        takeProfitTolerance ? takeProfitTolerance.toString() : null,
        currentTimestamp,
        currentTimestamp,
    ];
    try {
        await client_1.default.execute(query, params, {
            prepare: true,
        });
        const newOrder = {
            id,
            userId,
            symbol,
            type,
            timeInForce: "GTC",
            side,
            price: priceTolerance,
            amount: amountTolerance,
            filled: BigInt(0),
            remaining: amountTolerance,
            cost: costTolerance,
            fee: feeTolerance,
            feeCurrency,
            average: BigInt(0),
            trades: "",
            status: "OPEN",
            createdAt: currentTimestamp,
            updatedAt: currentTimestamp,
            leverage,
            stopLossPrice: stopLossTolerance,
            takeProfitPrice: takeProfitTolerance,
        };
        const matchingEngine = await matchingEngine_1.FuturesMatchingEngine.getInstance();
        matchingEngine.addToQueue(newOrder);
        return newOrder;
    }
    catch (error) {
        console.error(`Failed to create futures order: ${error.message}`);
        throw new Error(`Failed to create futures order: ${error.message}`);
    }
}
exports.createOrder = createOrder;
/**
 * Retrieves all futures orders with status 'OPEN'.
 * @returns A Promise that resolves with an array of open  orders.
 */
async function getAllOpenOrders() {
    const query = `
    SELECT * FROM ${client_1.scyllaFuturesKeyspace}.open_order
    WHERE status = 'OPEN' ALLOW FILTERING;
  `;
    try {
        const result = await client_1.default.execute(query, [], { prepare: true });
        return result.rows;
    }
    catch (error) {
        console.error(`Failed to fetch all open futures orders: ${error.message}`);
        throw new Error(`Failed to fetch all open futures orders: ${error.message}`);
    }
}
exports.getAllOpenOrders = getAllOpenOrders;
function generateOrderUpdateQueries(ordersToUpdate) {
    const queries = ordersToUpdate.map((order) => {
        return {
            query: `
        UPDATE ${client_1.scyllaFuturesKeyspace}.orders
        SET filled = ?, remaining = ?, status = ?, "updatedAt" = ?, trades = ?
        WHERE "userId" = ? AND "createdAt" = ? AND id = ?;
      `,
            params: [
                (0, blockchain_1.removeTolerance)(order.filled).toString(),
                (0, blockchain_1.removeTolerance)(order.remaining).toString(),
                order.status,
                new Date(),
                JSON.stringify(order.trades),
                order.userId,
                order.createdAt,
                order.id,
            ],
        };
    });
    return queries;
}
exports.generateOrderUpdateQueries = generateOrderUpdateQueries;
async function deleteAllMarketData(symbol) {
    // Step 1: Fetch the primary keys from the materialized view for orders
    const ordersResult = await client_1.default.execute(`
      SELECT "userId", "createdAt", id
      FROM ${client_1.scyllaFuturesKeyspace}.orders_by_symbol
      WHERE symbol = ?;
    `, [symbol], { prepare: true });
    for (const row of ordersResult.rows) {
        await cancelAndRefundOrder(row.userId, row.id, row.createdAt);
    }
    const deleteOrdersQueries = ordersResult.rows.map((row) => ({
        query: `
      DELETE FROM ${client_1.scyllaFuturesKeyspace}.orders
      WHERE "userId" = ? AND "createdAt" = ? AND id = ?;
    `,
        params: [row.userId, row.createdAt, row.id],
    }));
    // Step 2: Fetch the primary keys for candles
    const candlesResult = await client_1.default.execute(`
      SELECT interval, "createdAt"
      FROM ${client_1.scyllaFuturesKeyspace}.candles
      WHERE symbol = ?;
    `, [symbol], { prepare: true });
    const deleteCandlesQueries = candlesResult.rows.map((row) => ({
        query: `
      DELETE FROM ${client_1.scyllaFuturesKeyspace}.candles
      WHERE symbol = ? AND interval = ? AND "createdAt" = ?;
    `,
        params: [symbol, row.interval, row.createdAt],
    }));
    // Step 3: Fetch the primary keys for orderbook
    const sides = ["ASKS", "BIDS"];
    const deleteOrderbookQueries = [];
    for (const side of sides) {
        const orderbookResult = await client_1.default.execute(`
        SELECT price
        FROM ${client_1.scyllaFuturesKeyspace}.orderbook
        WHERE symbol = ? AND side = ?;
      `, [symbol, side], { prepare: true });
        const queries = orderbookResult.rows.map((row) => ({
            query: `
        DELETE FROM ${client_1.scyllaFuturesKeyspace}.orderbook
        WHERE symbol = ? AND side = ? AND price = ?;
      `,
            params: [symbol, side, row.price],
        }));
        deleteOrderbookQueries.push(...queries);
    }
    // Step 4: Combine all queries in a batch
    const batchQueries = [
        ...deleteOrdersQueries,
        ...deleteCandlesQueries,
        ...deleteOrderbookQueries,
    ];
    if (batchQueries.length === 0) {
        return;
    }
    // Step 5: Execute the batch queries
    try {
        await client_1.default.batch(batchQueries, { prepare: true });
    }
    catch (err) {
        console.error(`Failed to delete all futures market data: ${err.message}`);
    }
}
exports.deleteAllMarketData = deleteAllMarketData;
async function cancelAndRefundOrder(userId, id, createdAt) {
    const order = await getOrderByUuid(userId, id, createdAt);
    if (!order) {
        console.warn(`Order not found for UUID: ${id}`);
        return;
    }
    // Skip if order is not open or fully filled
    if (order.status !== "OPEN" || BigInt(order.remaining) === BigInt(0)) {
        return;
    }
    // Calculate refund amount based on remaining amount for partially filled orders
    const refundAmount = order.side === "BUY"
        ? (0, blockchain_1.fromBigIntMultiply)(BigInt(order.remaining) + BigInt(order.fee), BigInt(order.price))
        : (0, blockchain_1.fromBigInt)(BigInt(order.remaining) + BigInt(order.fee));
    const walletCurrency = order.side === "BUY"
        ? order.symbol.split("/")[1]
        : order.symbol.split("/")[0];
    const wallet = await (0, wallet_1.getWalletByUserIdAndCurrency)(userId, walletCurrency);
    if (!wallet) {
        console.warn(`${walletCurrency} wallet not found for user ID: ${userId}`);
        return;
    }
    await (0, wallet_1.updateWalletBalance)(wallet, refundAmount, "add");
}
/**
 * Retrieves orders by user ID and symbol based on their status (open or non-open).
 * @param userId - The ID of the user whose orders are to be retrieved.
 * @param symbol - The symbol of the orders to be retrieved.
 * @param isOpen - A boolean indicating whether to fetch open orders (true) or non-open orders (false).
 * @returns A Promise that resolves with an array of orders.
 */
async function getOrders(userId, symbol, isOpen) {
    const query = `
    SELECT * FROM ${client_1.scyllaFuturesKeyspace}.orders_by_symbol
    WHERE symbol = ? AND "userId" = ?
    ORDER BY "createdAt" DESC;
  `;
    const params = [symbol, userId];
    try {
        const result = await client_1.default.execute(query, params, { prepare: true });
        return result.rows
            .map(mapRowToOrder)
            .filter((order) => isOpen ? order.status === "OPEN" : order.status !== "OPEN")
            .map((order) => ({
            ...order,
            amount: (0, blockchain_1.fromBigInt)(order.amount),
            price: (0, blockchain_1.fromBigInt)(order.price),
            cost: (0, blockchain_1.fromBigInt)(order.cost),
            fee: (0, blockchain_1.fromBigInt)(order.fee),
            filled: (0, blockchain_1.fromBigInt)(order.filled),
            remaining: (0, blockchain_1.fromBigInt)(order.remaining),
        }));
    }
    catch (error) {
        console.error(`Failed to fetch futures orders by userId and symbol: ${error.message}`);
        throw new Error(`Failed to fetch futures orders by userId and symbol: ${error.message}`);
    }
}
exports.getOrders = getOrders;
