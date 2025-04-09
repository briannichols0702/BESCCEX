"use strict";
// backend\api\ext\ecosystem\order\index.post.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const error_1 = require("@b/utils/error");
const wallet_1 = require("@b/utils/eco/wallet");
const queries_1 = require("@b/utils/eco/scylla/queries");
const blockchain_1 = require("@b/utils/eco/blockchain");
const query_1 = require("@b/utils/query");
const db_1 = require("@b/db");
exports.metadata = {
    summary: "Creates a new trading order",
    description: "Submits a new trading order for the logged-in user.",
    operationId: "createOrder",
    tags: ["Trading", "Orders"],
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
                            description: "Order type, limit or market",
                        },
                        side: { type: "string", description: "Order side, buy or sell" },
                        amount: { type: "number", description: "Amount of the order" },
                        price: {
                            type: "number",
                            description: "Price of the order (required if limit)",
                        },
                    },
                    required: ["currency", "pair", "type", "side", "amount"],
                },
            },
        },
    },
    responses: (0, query_1.createRecordResponses)("Order"),
    requiresAuth: true,
};
// Helper: Get the best price from the order book for a given side.
async function getBestPriceFromOrderBook(symbol, side) {
    const { asks, bids } = await (0, queries_1.getOrderBook)(symbol);
    if (side.toUpperCase() === "BUY") {
        // best buy price is lowest ask
        if (!asks || asks.length === 0)
            return null;
        return asks[0][0];
    }
    else {
        // best sell price is highest bid
        if (!bids || bids.length === 0)
            return null;
        return bids[0][0];
    }
}
exports.default = async (data) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
    const { body, user } = data;
    if (!(user === null || user === void 0 ? void 0 : user.id)) {
        throw (0, error_1.createError)({ statusCode: 401, message: "Unauthorized" });
    }
    const { currency, pair, amount, price, type, side } = body;
    // Basic validations
    if (!amount || Number(amount) <= 0) {
        throw (0, error_1.createError)({
            statusCode: 422,
            message: "Amount must be greater than zero.",
        });
    }
    if (!type) {
        throw (0, error_1.createError)({
            statusCode: 422,
            message: "Order type (limit/market) is required.",
        });
    }
    if (!currency || !pair) {
        throw (0, error_1.createError)({
            statusCode: 422,
            message: "Invalid currency/pair symbol.",
        });
    }
    const symbol = `${currency}/${pair}`;
    try {
        const market = (await db_1.models.ecosystemMarket.findOne({
            where: { currency, pair },
        }));
        if (!market || !market.metadata) {
            throw (0, error_1.createError)({
                statusCode: 422,
                message: "Market data not found or incomplete.",
            });
        }
        if (!market.metadata.precision ||
            !market.metadata.precision.amount ||
            !market.metadata.precision.price) {
            throw (0, error_1.createError)({
                statusCode: 422,
                message: "Market metadata missing precision details.",
            });
        }
        if (!market.metadata.maker || !market.metadata.taker) {
            throw (0, error_1.createError)({
                statusCode: 422,
                message: "Market metadata missing fee rates.",
            });
        }
        const minAmount = Number(((_c = (_b = (_a = market.metadata) === null || _a === void 0 ? void 0 : _a.limits) === null || _b === void 0 ? void 0 : _b.amount) === null || _c === void 0 ? void 0 : _c.min) || 0);
        const maxAmount = Number(((_f = (_e = (_d = market.metadata) === null || _d === void 0 ? void 0 : _d.limits) === null || _e === void 0 ? void 0 : _e.amount) === null || _f === void 0 ? void 0 : _f.max) || 0);
        const minPrice = Number(((_j = (_h = (_g = market.metadata) === null || _g === void 0 ? void 0 : _g.limits) === null || _h === void 0 ? void 0 : _h.price) === null || _j === void 0 ? void 0 : _j.min) || 0);
        const maxPrice = Number(((_m = (_l = (_k = market.metadata) === null || _k === void 0 ? void 0 : _k.limits) === null || _l === void 0 ? void 0 : _l.price) === null || _m === void 0 ? void 0 : _m.max) || 0);
        const minCost = Number(((_q = (_p = (_o = market.metadata) === null || _o === void 0 ? void 0 : _o.limits) === null || _p === void 0 ? void 0 : _p.cost) === null || _q === void 0 ? void 0 : _q.min) || 0);
        const maxCost = Number(((_t = (_s = (_r = market.metadata) === null || _r === void 0 ? void 0 : _r.limits) === null || _s === void 0 ? void 0 : _s.cost) === null || _t === void 0 ? void 0 : _t.max) || 0);
        if (side.toUpperCase() === "SELL" && amount < minAmount) {
            throw (0, error_1.createError)({
                statusCode: 422,
                message: `Amount is too low, you need at least ${minAmount} ${currency}`,
            });
        }
        // Optional check for BUY minimum amount:
        if (side.toUpperCase() === "BUY" && amount < minAmount) {
            throw (0, error_1.createError)({
                statusCode: 422,
                message: `Amount is too low, minimum is ${minAmount} ${currency}`,
            });
        }
        if (side.toUpperCase() === "SELL" && maxAmount > 0 && amount > maxAmount) {
            throw (0, error_1.createError)({
                statusCode: 422,
                message: `Amount is too high, maximum is ${maxAmount} ${currency}`,
            });
        }
        // For limit orders, price must be provided and > 0
        if (type.toLowerCase() === "limit" && (!price || price <= 0)) {
            throw (0, error_1.createError)({
                statusCode: 422,
                message: "Price must be greater than zero for limit orders.",
            });
        }
        let effectivePrice = price;
        // Market order: derive price from orderbook
        if (type.toLowerCase() === "market") {
            const bestPrice = await getBestPriceFromOrderBook(symbol, side);
            if (!bestPrice) {
                throw (0, error_1.createError)({
                    statusCode: 422,
                    message: "Cannot execute market order: no price available.",
                });
            }
            effectivePrice = bestPrice;
        }
        if (effectivePrice && effectivePrice < minPrice) {
            throw (0, error_1.createError)({
                statusCode: 422,
                message: `Price is too low, you need at least ${minPrice} ${pair}`,
            });
        }
        if (maxPrice > 0 && effectivePrice && effectivePrice > maxPrice) {
            throw (0, error_1.createError)({
                statusCode: 422,
                message: `Price is too high, maximum is ${maxPrice} ${pair}`,
            });
        }
        const precision = Number(side.toUpperCase() === "BUY"
            ? market.metadata.precision.amount
            : market.metadata.precision.price) || 8;
        const feeRate = side.toUpperCase() === "BUY"
            ? Number(market.metadata.taker)
            : Number(market.metadata.maker);
        if (isNaN(feeRate) || feeRate < 0) {
            throw (0, error_1.createError)({
                statusCode: 422,
                message: "Invalid fee rate from market metadata.",
            });
        }
        if (!effectivePrice || isNaN(effectivePrice)) {
            throw (0, error_1.createError)({
                statusCode: 422,
                message: "No valid price determined for the order.",
            });
        }
        const feeCalculated = (amount * effectivePrice * feeRate) / 100;
        const fee = parseFloat(feeCalculated.toFixed(precision));
        const costCalculated = side.toUpperCase() === "BUY" ? amount * effectivePrice + fee : amount;
        const cost = parseFloat(costCalculated.toFixed(precision));
        if (side.toUpperCase() === "BUY" && (isNaN(cost) || cost <= 0)) {
            throw (0, error_1.createError)({
                statusCode: 422,
                message: "Calculated cost is invalid. Check your price and amount.",
            });
        }
        if (side.toUpperCase() === "BUY" && cost < minCost) {
            throw (0, error_1.createError)({
                statusCode: 422,
                message: `Cost is too low, you need at least ${minCost} ${pair}`,
            });
        }
        if (side.toUpperCase() === "BUY" && maxCost > 0 && cost > maxCost) {
            throw (0, error_1.createError)({
                statusCode: 422,
                message: `Cost is too high, maximum is ${maxCost} ${pair}`,
            });
        }
        const [currencyWallet, pairWallet] = await Promise.all([
            (0, wallet_1.getWalletByUserIdAndCurrency)(user.id, currency),
            (0, wallet_1.getWalletByUserIdAndCurrency)(user.id, pair),
        ]);
        if (side.toUpperCase() === "SELL") {
            if (!currencyWallet ||
                parseFloat(currencyWallet.balance.toString()) < amount) {
                throw (0, error_1.createError)({
                    statusCode: 400,
                    message: `Insufficient balance. You need ${amount} ${currency}`,
                });
            }
        }
        else {
            // BUY
            if (!pairWallet || parseFloat(pairWallet.balance.toString()) < cost) {
                throw (0, error_1.createError)({
                    statusCode: 400,
                    message: `Insufficient balance. You need ${cost} ${pair}`,
                });
            }
        }
        // SELF-MATCH PREVENTION LOGIC
        const userOpenOrders = await (0, queries_1.getOrders)(user.id, symbol, true);
        // For a SELL order, check if there's any BUY order at >= effectivePrice
        if (side.toUpperCase() === "SELL") {
            const conflictingBuy = userOpenOrders.find((o) => o.side === "BUY" && o.price >= effectivePrice);
            if (conflictingBuy) {
                throw (0, error_1.createError)({
                    statusCode: 400,
                    message: `You already have a BUY order at ${conflictingBuy.price} or higher, cannot place SELL at ${effectivePrice} or lower.`,
                });
            }
        }
        // For a BUY order, check if there's any SELL order at <= effectivePrice
        if (side.toUpperCase() === "BUY") {
            const conflictingSell = userOpenOrders.find((o) => o.side === "SELL" && o.price <= effectivePrice);
            if (conflictingSell) {
                throw (0, error_1.createError)({
                    statusCode: 400,
                    message: `You already have a SELL order at ${conflictingSell.price} or lower, cannot place BUY at ${effectivePrice} or higher.`,
                });
            }
        }
        // END SELF-MATCH PREVENTION
        // Create the order
        const newOrder = await (0, queries_1.createOrder)({
            userId: user.id,
            symbol,
            amount: (0, blockchain_1.toBigIntFloat)(amount),
            price: (0, blockchain_1.toBigIntFloat)(effectivePrice),
            cost: (0, blockchain_1.toBigIntFloat)(cost),
            type,
            side,
            fee: (0, blockchain_1.toBigIntFloat)(fee),
            feeCurrency: pair,
        });
        const order = {
            ...newOrder,
            amount: (0, blockchain_1.fromBigInt)(newOrder.amount),
            price: (0, blockchain_1.fromBigInt)(newOrder.price),
            cost: (0, blockchain_1.fromBigInt)(newOrder.cost),
            fee: (0, blockchain_1.fromBigInt)(newOrder.fee),
            remaining: (0, blockchain_1.fromBigInt)(newOrder.remaining),
            filled: 0,
            average: 0,
        };
        // Atomicity: Update wallet after order creation
        try {
            if (side.toUpperCase() === "BUY") {
                await (0, wallet_1.updateWalletBalance)(pairWallet, order.cost, "subtract");
            }
            else {
                await (0, wallet_1.updateWalletBalance)(currencyWallet, order.amount, "subtract");
            }
        }
        catch (e) {
            await (0, queries_1.rollbackOrderCreation)(newOrder.id, user.id, newOrder.createdAt);
            throw (0, error_1.createError)({
                statusCode: 500,
                message: "Failed to update wallet balance. Order rolled back.",
            });
        }
        return {
            message: "Order created successfully",
            order: order,
        };
    }
    catch (error) {
        throw (0, error_1.createError)({
            statusCode: error.statusCode || 400,
            message: `Failed to create order: ${error.message}`,
        });
    }
};
