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
exports.updatePositionStatus = exports.updatePositionInDB = exports.createPosition = exports.getAllOpenPositions = exports.getPositions = exports.getPosition = void 0;
const client_1 = __importStar(require("@b/utils/eco/scylla/client"));
const passwords_1 = require("@b/utils/passwords");
const order_1 = require("./order");
async function getPosition(userId, symbol, side) {
    const query = `
    SELECT * FROM ${client_1.scyllaFuturesKeyspace}.positions_by_symbol
    WHERE symbol = ? AND "userId" = ? AND side = ? AND status = 'OPEN' ALLOW FILTERING;
  `;
    const params = [symbol, userId, side];
    try {
        const result = await client_1.default.execute(query, params, { prepare: true });
        if (result.rows.length > 0) {
            const row = result.rows[0];
            return {
                id: (0, order_1.uuidToString)(row.id),
                userId: (0, order_1.uuidToString)(row.userId),
                symbol: row.symbol,
                side: row.side,
                entryPrice: BigInt(row.entryPrice),
                amount: BigInt(row.amount),
                leverage: Number(row.leverage),
                unrealizedPnl: BigInt(row.unrealizedPnl),
                stopLossPrice: row.stopLossPrice
                    ? BigInt(row.stopLossPrice)
                    : undefined,
                takeProfitPrice: row.takeProfitPrice
                    ? BigInt(row.takeProfitPrice)
                    : undefined,
                status: row.status,
                createdAt: new Date(row.createdAt),
                updatedAt: new Date(row.updatedAt),
            };
        }
        return null;
    }
    catch (error) {
        console.error(`Failed to fetch position: ${error.message}`);
        throw new Error(`Failed to fetch position: ${error.message}`);
    }
}
exports.getPosition = getPosition;
async function getPositions(userId, symbol, status) {
    let query = `
    SELECT * FROM ${client_1.scyllaFuturesKeyspace}.position
    WHERE "userId" = ?
  `;
    const params = [userId];
    if (symbol) {
        query += ` AND symbol = ?`;
        params.push(symbol);
    }
    if (status) {
        query += ` AND status = ?`;
        params.push(status);
    }
    query += ` ALLOW FILTERING;`;
    try {
        const result = await client_1.default.execute(query, params, { prepare: true });
        return result.rows.map((row) => ({
            id: (0, order_1.uuidToString)(row.id),
            userId: (0, order_1.uuidToString)(row.userId),
            symbol: row.symbol,
            side: row.side,
            entryPrice: BigInt(row.entryPrice),
            amount: BigInt(row.amount),
            leverage: Number(row.leverage),
            unrealizedPnl: BigInt(row.unrealizedPnl),
            stopLossPrice: row.stopLossPrice ? BigInt(row.stopLossPrice) : undefined,
            takeProfitPrice: row.takeProfitPrice
                ? BigInt(row.takeProfitPrice)
                : undefined,
            status: row.status,
            createdAt: new Date(row.createdAt),
            updatedAt: new Date(row.updatedAt),
        }));
    }
    catch (error) {
        console.error(`Failed to fetch positions: ${error.message}`);
        throw new Error(`Failed to fetch positions: ${error.message}`);
    }
}
exports.getPositions = getPositions;
async function getAllOpenPositions() {
    const query = `
    SELECT * FROM ${client_1.scyllaFuturesKeyspace}.position WHERE status = 'OPEN' ALLOW FILTERING;
  `;
    try {
        const result = await client_1.default.execute(query, [], { prepare: true });
        return result.rows.map((row) => ({
            id: (0, order_1.uuidToString)(row.id),
            userId: (0, order_1.uuidToString)(row.userId),
            symbol: row.symbol,
            side: row.side,
            entryPrice: BigInt(row.entryPrice),
            amount: BigInt(row.amount),
            leverage: Number(row.leverage),
            unrealizedPnl: BigInt(row.unrealizedPnl),
            stopLossPrice: row.stopLossPrice ? BigInt(row.stopLossPrice) : undefined,
            takeProfitPrice: row.takeProfitPrice
                ? BigInt(row.takeProfitPrice)
                : undefined,
            status: row.status,
            createdAt: new Date(row.createdAt),
            updatedAt: new Date(row.updatedAt),
        }));
    }
    catch (error) {
        console.error(`Failed to fetch open positions: ${error.message}`);
        throw new Error(`Failed to fetch open positions: ${error.message}`);
    }
}
exports.getAllOpenPositions = getAllOpenPositions;
async function createPosition(userId, symbol, side, entryPrice, amount, leverage, unrealizedPnl, stopLossPrice, takeProfitPrice) {
    const query = `
    INSERT INTO ${client_1.scyllaFuturesKeyspace}.position (id, "userId", symbol, side, "entryPrice", amount, leverage, "unrealizedPnl", "stopLossPrice", "takeProfitPrice", status, "createdAt", "updatedAt")
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'OPEN', ?, ?);
  `;
    const params = [
        (0, passwords_1.makeUuid)(),
        userId,
        symbol,
        side,
        entryPrice.toString(),
        amount.toString(),
        leverage,
        unrealizedPnl.toString(),
        (stopLossPrice === null || stopLossPrice === void 0 ? void 0 : stopLossPrice.toString()) || null,
        (takeProfitPrice === null || takeProfitPrice === void 0 ? void 0 : takeProfitPrice.toString()) || null,
        new Date(),
        new Date(),
    ];
    try {
        await client_1.default.execute(query, params, { prepare: true });
    }
    catch (error) {
        console.error(`Failed to create position: ${error.message}`);
        throw new Error(`Failed to create position: ${error.message}`);
    }
}
exports.createPosition = createPosition;
async function updatePositionInDB(userId, id, entryPrice, amount, unrealizedPnl, stopLossPrice, takeProfitPrice) {
    const query = `
    UPDATE ${client_1.scyllaFuturesKeyspace}.position
    SET "entryPrice" = ?, amount = ?, "unrealizedPnl" = ?, "stopLossPrice" = ?, "takeProfitPrice" = ?, "updatedAt" = ?
    WHERE "userId" = ? AND id = ?;
  `;
    const params = [
        entryPrice.toString(),
        amount.toString(),
        unrealizedPnl.toString(),
        (stopLossPrice === null || stopLossPrice === void 0 ? void 0 : stopLossPrice.toString()) || null,
        (takeProfitPrice === null || takeProfitPrice === void 0 ? void 0 : takeProfitPrice.toString()) || null,
        new Date(),
        userId,
        id,
    ];
    try {
        await client_1.default.execute(query, params, { prepare: true });
    }
    catch (error) {
        console.error(`Failed to update position: ${error.message}`);
        throw new Error(`Failed to update position: ${error.message}`);
    }
}
exports.updatePositionInDB = updatePositionInDB;
async function updatePositionStatus(userId, id, status) {
    const query = `
    UPDATE ${client_1.scyllaFuturesKeyspace}.position
    SET status = ?, "updatedAt" = ?
    WHERE "userId" = ? AND id = ?;
  `;
    const params = [status, new Date(), userId, id];
    try {
        await client_1.default.execute(query, params, { prepare: true });
    }
    catch (error) {
        console.error(`Failed to update position status: ${error.message}`);
        throw new Error(`Failed to update position status: ${error.message}`);
    }
}
exports.updatePositionStatus = updatePositionStatus;
