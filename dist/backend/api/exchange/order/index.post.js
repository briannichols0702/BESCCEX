"use strict";
// /server/api/exchange/orders/store.post.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrder = exports.updateWalletQuery = exports.metadata = void 0;
const db_1 = require("@b/db");
const utils_1 = require("../utils");
const exchange_1 = __importDefault(require("@b/utils/exchange"));
const index_ws_1 = require("./index.ws");
const query_1 = require("@b/utils/query");
const utils_2 = require("./utils");
exports.metadata = {
    summary: "Create Order",
    operationId: "createOrder",
    tags: ["Exchange", "Orders"],
    description: "Creates a new order for the authenticated user.",
    requestBody: {
        description: "Order creation data.",
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        currency: {
                            type: "string",
                            description: "Base currency symbol (e.g., BTC)",
                        },
                        pair: {
                            type: "string",
                            description: "Quote currency symbol (e.g., USDT)",
                        },
                        type: {
                            type: "string",
                            description: "Order type (limit or market)",
                        },
                        side: {
                            type: "string",
                            description: "BUY or SELL",
                        },
                        amount: {
                            type: "number",
                            description: "Amount of base currency to buy or sell (or cost in quote if using approach #2 on certain providers)",
                        },
                        price: {
                            type: "number",
                            description: "Order price, required for limit orders",
                        },
                    },
                    required: ["currency", "pair", "type", "side", "amount"],
                },
            },
        },
        required: true,
    },
    responses: (0, query_1.createRecordResponses)("Order"),
    requiresAuth: true,
};
exports.default = async (data) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
    const { user, body } = data;
    if (!user) {
        throw new Error("User not found");
    }
    try {
        // Step 1: Check for ban status
        const unblockTime = await (0, utils_1.loadBanStatus)();
        if (await (0, utils_1.handleBanStatus)(unblockTime)) {
            const waitTime = unblockTime - Date.now();
            throw new Error(`Service temporarily unavailable. Please try again in ${(0, utils_1.formatWaitTime)(waitTime)}.`);
        }
        // Step 2: Validate input data
        const { currency, pair, amount, price, type } = body;
        const side = (_a = body.side) === null || _a === void 0 ? void 0 : _a.toUpperCase();
        if (!currency || !pair || !type || !side || amount == null) {
            throw new Error("Missing required parameters");
        }
        if (!["BUY", "SELL"].includes(side)) {
            throw new Error("Invalid order side. Must be 'buy' or 'sell'");
        }
        if (amount <= 0) {
            throw new Error("Amount must be greater than zero");
        }
        if (type.toLowerCase() === "limit" && (price == null || price <= 0)) {
            throw new Error("Price must be greater than zero for limit orders");
        }
        // Step 3: Fetch market data and metadata
        const symbol = `${currency}/${pair}`;
        const market = await db_1.models.exchangeMarket.findOne({
            where: { currency, pair },
        });
        if (!market || !market.metadata) {
            throw new Error("Market data not found");
        }
        const metadataObj = typeof market.metadata === "string"
            ? JSON.parse(market.metadata)
            : market.metadata;
        const minAmount = Number(((_c = (_b = metadataObj === null || metadataObj === void 0 ? void 0 : metadataObj.limits) === null || _b === void 0 ? void 0 : _b.amount) === null || _c === void 0 ? void 0 : _c.min) || 0);
        const maxAmount = Number(((_e = (_d = metadataObj === null || metadataObj === void 0 ? void 0 : metadataObj.limits) === null || _d === void 0 ? void 0 : _d.amount) === null || _e === void 0 ? void 0 : _e.max) || 0);
        const minPrice = Number(((_g = (_f = metadataObj === null || metadataObj === void 0 ? void 0 : metadataObj.limits) === null || _f === void 0 ? void 0 : _f.price) === null || _g === void 0 ? void 0 : _g.min) || 0);
        const maxPrice = Number(((_j = (_h = metadataObj === null || metadataObj === void 0 ? void 0 : metadataObj.limits) === null || _h === void 0 ? void 0 : _h.price) === null || _j === void 0 ? void 0 : _j.max) || 0);
        const minCost = Number(((_l = (_k = metadataObj === null || metadataObj === void 0 ? void 0 : metadataObj.limits) === null || _k === void 0 ? void 0 : _k.cost) === null || _l === void 0 ? void 0 : _l.min) || 0);
        const maxCost = Number(((_o = (_m = metadataObj === null || metadataObj === void 0 ? void 0 : metadataObj.limits) === null || _m === void 0 ? void 0 : _m.cost) === null || _o === void 0 ? void 0 : _o.max) || 0);
        const amountPrecision = Number((_p = metadataObj.precision) === null || _p === void 0 ? void 0 : _p.amount) || 8;
        const pricePrecision = Number((_q = metadataObj.precision) === null || _q === void 0 ? void 0 : _q.price) || 8;
        // Step 4: Validate amount and price vs. min/max
        if (side === "SELL" && amount < minAmount) {
            throw new Error(`Amount is too low, you need at least ${minAmount.toFixed(amountPrecision)} ${currency}`);
        }
        if (side === "SELL" && maxAmount > 0 && amount > maxAmount) {
            throw new Error(`Amount is too high, maximum is ${maxAmount.toFixed(amountPrecision)} ${currency}`);
        }
        if (price && price < minPrice) {
            throw new Error(`Price is too low, you need at least ${minPrice.toFixed(pricePrecision)} ${pair}`);
        }
        if (maxPrice > 0 && price > maxPrice) {
            throw new Error(`Price is too high, maximum is ${maxPrice.toFixed(pricePrecision)} ${pair}`);
        }
        // Step 5: Initialize exchange
        const exchange = await exchange_1.default.startExchange();
        const provider = await exchange_1.default.getProvider();
        if (!exchange) {
            throw new Error("Exchange service is currently unavailable");
        }
        // Step 6: If "market" order, get last price for validations/cost calc
        let orderPrice = price;
        if (type.toLowerCase() === "market") {
            const ticker = await exchange.fetchTicker(symbol);
            if (!ticker || !ticker.last) {
                throw new Error("Unable to fetch current market price");
            }
            orderPrice = ticker.last;
        }
        // Step 7: Calculate cost the usual way (base * price)
        const formattedAmount = parseFloat(amount.toFixed(amountPrecision));
        const formattedPrice = parseFloat(orderPrice.toFixed(pricePrecision));
        const cost = parseFloat((formattedAmount * formattedPrice).toFixed(pricePrecision));
        // Step 8: Validate cost if buying
        if (side === "BUY" && cost < minCost) {
            throw new Error(`Cost is too low, you need at least ${minCost.toFixed(pricePrecision)} ${pair}`);
        }
        if (side === "BUY" && maxCost > 0 && cost > maxCost) {
            throw new Error(`Cost is too high, maximum is ${maxCost.toFixed(pricePrecision)} ${pair}`);
        }
        // Step 9: Fetch wallets and check balances
        const currencyWallet = await getOrCreateWallet(user.id, currency);
        const pairWallet = await getOrCreateWallet(user.id, pair);
        if (side === "BUY" && pairWallet.balance < cost) {
            throw new Error(`Insufficient balance. You need at least ${cost.toFixed(pricePrecision)} ${pair}`);
        }
        if (side === "SELL" && currencyWallet.balance < amount) {
            throw new Error(`Insufficient balance. You need at least ${amount.toFixed(amountPrecision)} ${currency}`);
        }
        // Step 10: Fee rate & currency
        const feeRate = side === "BUY" ? Number(metadataObj.taker) : Number(metadataObj.maker);
        const feeCurrency = side === "BUY" ? currency : pair;
        // Step 11: Create order with provider
        let order;
        try {
            // Approach #2 for "market BUY" only if provider is 'xt'
            // We'll pass the total 'cost' in the 'amount' param with createMarketBuyOrderRequiresPrice: false
            if (type.toLowerCase() === "market" &&
                side === "BUY" &&
                provider === "xt" // or whichever property identifies XT
            ) {
                // If user specified base amount, we have already computed the cost => pass cost as the 'amount'
                order = await exchange.createOrder(symbol, "market", // type
                "buy", // side
                cost, // pass cost as the 'amount'
                undefined, {
                    createMarketBuyOrderRequiresPrice: false,
                });
            }
            else {
                // Otherwise, do the normal approach (Approach #1)
                // For market buys, pass price as well so that the exchange can calculate cost itself
                const finalPrice = type.toLowerCase() === "limit"
                    ? formattedPrice
                    : side === "BUY"
                        ? formattedPrice
                        : undefined;
                order = await exchange.createOrder(symbol, type.toLowerCase(), side.toLowerCase(), formattedAmount, finalPrice);
            }
        }
        catch (error) {
            throw new Error(`Unable to process order: ${(0, utils_1.sanitizeErrorMessage)(error.message)}`);
        }
        if (!order || !order.id) {
            throw new Error("Unable to process order");
        }
        // Step 12: Fetch and adjust order data
        let orderData = await exchange.fetchOrder(order.id, symbol);
        if (!orderData) {
            throw new Error("Failed to fetch order");
        }
        // Our custom function that cleans up and normalizes the order object
        orderData = (0, utils_2.adjustOrderData)(orderData, provider, feeRate);
        // Step 13: Perform Sequelize transaction for wallet + DB updates
        const response = await db_1.sequelize.transaction(async (transaction) => {
            if (side === "BUY") {
                // Subtract cost from the user’s quote wallet
                await updateWalletQuery(pairWallet.id, pairWallet.balance - cost, transaction);
                // If fully filled, credit base currency
                if (["closed", "filled"].includes(orderData.status)) {
                    const netAmount = Number(orderData.amount) - Number(orderData.fee || 0);
                    await updateWalletQuery(currencyWallet.id, currencyWallet.balance + netAmount, transaction);
                }
            }
            else {
                // SELL: subtract from base currency
                await updateWalletQuery(currencyWallet.id, currencyWallet.balance - formattedAmount, transaction);
                // If fully filled, credit the quote currency
                if (["closed", "filled"].includes(orderData.status)) {
                    const proceeds = Number(orderData.amount) * Number(orderData.price);
                    const netProceeds = proceeds - Number(orderData.fee || 0);
                    await updateWalletQuery(pairWallet.id, pairWallet.balance + netProceeds, transaction);
                }
            }
            // Persist the order in DB
            const dbOrder = await createOrder(user.id, {
                ...orderData,
                referenceId: order.id,
                fee: Number(orderData.fee || 0),
                feeCurrency,
            }, transaction);
            return dbOrder;
        });
        // Push to any watchers
        (0, index_ws_1.addOrderToTrackedOrders)(user.id, {
            id: response.id,
            status: response.status,
            price: orderData.price,
            amount: orderData.amount,
            filled: orderData.filled,
            remaining: orderData.remaining,
            timestamp: orderData.timestamp,
            cost: orderData.cost,
        });
        (0, index_ws_1.addUserToWatchlist)(user.id);
        return { message: "Order created successfully" };
    }
    catch (error) {
        console.error("Error creating order:", {
            userId: user.id,
            body,
            error: error.message,
        });
        throw new Error((0, utils_1.sanitizeErrorMessage)(error.message));
    }
};
// ------------------------
// Helpers
// ------------------------
async function getOrCreateWallet(userId, currency) {
    let wallet = await db_1.models.wallet.findOne({
        where: {
            userId,
            currency,
            type: "SPOT",
        },
    });
    if (!wallet) {
        wallet = await createWallet(userId, currency);
    }
    return wallet;
}
const createWallet = async (userId, currency) => {
    return await db_1.models.wallet.create({
        userId,
        type: "SPOT",
        currency,
        balance: 0,
    });
};
async function updateWalletQuery(id, balance, transaction) {
    const wallet = await db_1.models.wallet.findByPk(id, {
        transaction,
        lock: transaction ? transaction.LOCK.UPDATE : undefined,
    });
    if (!wallet) {
        throw new Error("Wallet not found");
    }
    if (balance < 0) {
        throw new Error("Invalid operation: balance cannot go below zero");
    }
    await wallet.update({ balance }, transaction ? { transaction } : {});
    return wallet.get({ plain: true });
}
exports.updateWalletQuery = updateWalletQuery;
async function createOrder(userId, order, transaction) {
    const mappedOrder = mapOrderData(order);
    const newOrder = await db_1.models.exchangeOrder.create({
        ...mappedOrder,
        userId: userId,
    }, { transaction });
    return newOrder.get({ plain: true });
}
exports.createOrder = createOrder;
const mapOrderData = (order) => {
    return {
        referenceId: order.referenceId,
        status: order.status ? order.status.toUpperCase() : undefined,
        symbol: order.symbol,
        type: order.type ? order.type.toUpperCase() : undefined,
        timeInForce: order.timeInForce
            ? order.timeInForce.toUpperCase()
            : undefined,
        side: order.side ? order.side.toUpperCase() : undefined,
        price: Number(order.price),
        average: order.average != null ? Number(order.average) : undefined,
        amount: Number(order.amount),
        filled: Number(order.filled),
        remaining: Number(order.remaining),
        cost: Number(order.cost),
        trades: JSON.stringify(order.trades),
        fee: Number(order.fee || 0),
        feeCurrency: order.feeCurrency,
    };
};
