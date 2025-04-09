"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const error_1 = require("@b/utils/error");
const utils_1 = require("@b/api/finance/wallet/utils");
const blockchain_1 = require("@b/utils/eco/blockchain");
const query_1 = require("@b/utils/query");
const db_1 = require("@b/db");
const wallet_1 = require("@b/utils/eco/wallet");
const order_1 = require("@b/utils/futures/queries/order");
exports.metadata = {
    summary: "Creates a new futures trading order",
    description: "Submits a new futures trading order for the logged-in user.",
    operationId: "createFuturesOrder",
    tags: ["Futures", "Orders"],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        currency: {
                            type: "string",
                            description: "Currency symbol (e.g., BTC)",
                        },
                        pair: { type: "string", description: "Pair symbol (e.g., USDT)" },
                        type: {
                            type: "string",
                            description: "Order type, e.g., limit, market",
                        },
                        side: {
                            type: "string",
                            description: "Order side, either buy or sell",
                        },
                        amount: { type: "number", description: "Amount of the order" },
                        price: {
                            type: "number",
                            description: "Price of the order (not required for market orders)",
                        },
                        leverage: {
                            type: "number",
                            description: "Leverage for the futures order",
                        },
                        stopLossPrice: {
                            type: "number",
                            description: "Stop loss price for the order",
                            nullable: true,
                        },
                        takeProfitPrice: {
                            type: "number",
                            description: "Take profit price for the order",
                            nullable: true,
                        },
                    },
                    required: ["currency", "pair", "type", "side", "amount", "leverage"],
                },
            },
        },
    },
    responses: (0, query_1.createRecordResponses)("Order"),
    requiresAuth: true,
};
exports.default = async (data) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
    const { body, user } = data;
    if (!(user === null || user === void 0 ? void 0 : user.id)) {
        throw (0, error_1.createError)({ statusCode: 401, message: "Unauthorized" });
    }
    const { currency, pair, amount, price, type, side, leverage, stopLossPrice, takeProfitPrice, } = body;
    if (!currency || !pair) {
        throw new Error("Invalid symbol");
    }
    const symbol = `${currency}/${pair}`;
    try {
        const market = (await db_1.models.futuresMarket.findOne({
            where: { currency, pair },
        }));
        if (!market) {
            throw new Error("Futures market data not found");
        }
        if (!market.metadata) {
            throw new Error("Futures market metadata not found");
        }
        const minAmount = Number(((_c = (_b = (_a = market.metadata) === null || _a === void 0 ? void 0 : _a.limits) === null || _b === void 0 ? void 0 : _b.amount) === null || _c === void 0 ? void 0 : _c.min) || 0);
        const maxAmount = Number(((_f = (_e = (_d = market.metadata) === null || _d === void 0 ? void 0 : _d.limits) === null || _e === void 0 ? void 0 : _e.amount) === null || _f === void 0 ? void 0 : _f.max) || 0);
        const minPrice = Number(((_j = (_h = (_g = market.metadata) === null || _g === void 0 ? void 0 : _g.limits) === null || _h === void 0 ? void 0 : _h.price) === null || _j === void 0 ? void 0 : _j.min) || 0);
        const maxPrice = Number(((_m = (_l = (_k = market.metadata) === null || _k === void 0 ? void 0 : _k.limits) === null || _l === void 0 ? void 0 : _l.price) === null || _m === void 0 ? void 0 : _m.max) || 0);
        const minCost = Number(((_q = (_p = (_o = market.metadata) === null || _o === void 0 ? void 0 : _o.limits) === null || _p === void 0 ? void 0 : _p.cost) === null || _q === void 0 ? void 0 : _q.min) || 0);
        const maxCost = Number(((_t = (_s = (_r = market.metadata) === null || _r === void 0 ? void 0 : _r.limits) === null || _s === void 0 ? void 0 : _s.cost) === null || _t === void 0 ? void 0 : _t.max) || 0);
        if (side === "SELL" && amount < minAmount) {
            throw new Error(`Amount is too low. You need ${minAmount} ${currency}`);
        }
        if (side === "SELL" && maxAmount > 0 && amount > maxAmount) {
            throw new Error(`Amount is too high. Maximum is ${maxAmount} ${currency}`);
        }
        if (price && price < minPrice) {
            throw new Error(`Price is too low. You need ${minPrice} ${pair}`);
        }
        if (maxPrice > 0 && price > maxPrice) {
            throw new Error(`Price is too high. Maximum is ${maxPrice} ${pair}`);
        }
        const precision = Number(side === "BUY"
            ? market.metadata.precision.amount
            : market.metadata.precision.price) || 8;
        const feeRate = side === "BUY"
            ? Number(market.metadata.taker)
            : Number(market.metadata.maker);
        const feeCalculated = (amount * price * feeRate) / 100;
        const fee = parseFloat(feeCalculated.toFixed(precision));
        const cost = amount * price;
        if (side === "BUY" && cost < minCost) {
            throw new Error(`Cost is too low. You need ${minCost} ${pair}`);
        }
        if (side === "BUY" && maxCost > 0 && cost > maxCost) {
            throw new Error(`Cost is too high. Maximum is ${maxCost} ${pair}`);
        }
        let pairWallet;
        try {
            pairWallet = await (0, utils_1.getWallet)(user.id, "FUTURES", pair);
        }
        catch (error) { }
        if (!pairWallet) {
            throw new Error(`Insufficient balance. You need ${cost + fee} ${pair}`);
        }
        // Check for sufficient balance
        if (pairWallet.balance < cost + fee) {
            throw new Error(`Insufficient balance. You need ${cost + fee} ${pair}`);
        }
        const existingOrders = await (0, order_1.getOrdersByUserId)(user.id);
        for (const existingOrder of existingOrders) {
            if (existingOrder.symbol === symbol &&
                existingOrder.leverage === leverage &&
                (0, blockchain_1.fromBigInt)(existingOrder.amount) === amount &&
                (0, blockchain_1.fromBigInt)(existingOrder.price) === price &&
                existingOrder.side !== side &&
                existingOrder.status === "OPEN" &&
                (0, blockchain_1.fromBigInt)(existingOrder.remaining) === amount) {
                // Cancel the existing order and return the balance to the user's wallet
                await (0, order_1.cancelOrderByUuid)(existingOrder.userId, existingOrder.id, existingOrder.createdAt.toISOString(), // Convert Date to string
                symbol, existingOrder.price, existingOrder.side, existingOrder.remaining);
                // Return the balance to the user's wallet
                const refundAmount = (0, blockchain_1.fromBigIntMultiply)(existingOrder.remaining + existingOrder.fee, existingOrder.price);
                await (0, wallet_1.updateWalletBalance)(pairWallet, refundAmount, "add");
                return {
                    message: "Counter order detected and existing position closed successfully",
                };
            }
        }
        const newOrder = await (0, order_1.createOrder)({
            userId: user.id,
            symbol,
            amount: (0, blockchain_1.toBigIntFloat)(amount),
            price: (0, blockchain_1.toBigIntFloat)(price),
            cost: (0, blockchain_1.toBigIntFloat)(cost),
            type,
            side,
            fee: (0, blockchain_1.toBigIntFloat)(fee),
            feeCurrency: pair,
            leverage,
            stopLossPrice: stopLossPrice ? (0, blockchain_1.toBigIntFloat)(stopLossPrice) : undefined,
            takeProfitPrice: takeProfitPrice
                ? (0, blockchain_1.toBigIntFloat)(takeProfitPrice)
                : undefined,
        });
        const order = {
            ...newOrder,
            amount: (0, blockchain_1.fromBigInt)(newOrder.amount),
            price: (0, blockchain_1.fromBigInt)(newOrder.price),
            cost: (0, blockchain_1.fromBigInt)(newOrder.cost),
            fee: (0, blockchain_1.fromBigInt)(newOrder.fee),
            remaining: (0, blockchain_1.fromBigInt)(newOrder.remaining),
            leverage,
            stopLossPrice: newOrder.stopLossPrice
                ? (0, blockchain_1.fromBigInt)(newOrder.stopLossPrice)
                : undefined,
            takeProfitPrice: newOrder.takeProfitPrice
                ? (0, blockchain_1.fromBigInt)(newOrder.takeProfitPrice)
                : undefined,
            filled: 0,
            average: 0,
        };
        // Subtract the cost and fee from the pair wallet
        await (0, wallet_1.updateWalletBalance)(pairWallet, cost + fee, "subtract");
        return {
            message: "Futures order created successfully",
            order,
        };
    }
    catch (error) {
        console.error("Error creating futures order:", error); // Log the error
        throw (0, error_1.createError)({
            statusCode: 500,
            message: `Failed to create futures order: ${error.message}`,
        });
    }
};
