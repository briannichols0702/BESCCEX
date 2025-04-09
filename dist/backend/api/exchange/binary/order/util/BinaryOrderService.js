"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreateOrderInput = exports.BinaryOrderService = void 0;
const db_1 = require("@b/db");
const error_1 = require("@b/utils/error");
const emails_1 = require("@b/utils/emails");
const notifications_1 = require("@b/utils/notifications");
const Websocket_1 = require("@b/handler/Websocket");
const utils_1 = require("../utils");
// Dynamic profit margins per type
const binaryRiseFallProfit = (0, utils_1.validateBinaryProfit)(process.env.NEXT_PUBLIC_BINARY_PROFIT);
const binaryHigherLowerProfit = (0, utils_1.validateBinaryProfit)(process.env.NEXT_PUBLIC_BINARY_HIGHER_LOWER_PROFIT);
const binaryTouchNoTouchProfit = (0, utils_1.validateBinaryProfit)(process.env.NEXT_PUBLIC_BINARY_TOUCH_NO_TOUCH_PROFIT);
const binaryCallPutProfit = (0, utils_1.validateBinaryProfit)(process.env.NEXT_PUBLIC_BINARY_CALL_PUT_PROFIT);
const binaryTurboProfit = (0, utils_1.validateBinaryProfit)(process.env.NEXT_PUBLIC_BINARY_TURBO_PROFIT);
class BinaryOrderService {
    static async createOrder({ userId, currency, pair, amount, side, type, durationType = "TIME", barrier, strikePrice, payoutPerPoint, closedAt, isDemo, }) {
        var _a, _b, _c, _d, _e, _f;
        validateCreateOrderInput({
            side,
            type,
            barrier,
            strikePrice,
            payoutPerPoint,
            durationType,
        });
        const market = (await db_1.models.exchangeMarket.findOne({
            where: { currency, pair },
        }));
        if (!market || !market.metadata) {
            throw (0, error_1.createError)({ statusCode: 404, message: "Market data not found" });
        }
        const minAmount = Number(((_c = (_b = (_a = market.metadata) === null || _a === void 0 ? void 0 : _a.limits) === null || _b === void 0 ? void 0 : _b.amount) === null || _c === void 0 ? void 0 : _c.min) || 0);
        const maxAmount = Number(((_f = (_e = (_d = market.metadata) === null || _d === void 0 ? void 0 : _d.limits) === null || _e === void 0 ? void 0 : _e.amount) === null || _f === void 0 ? void 0 : _f.max) || 0);
        if (amount < minAmount || amount > maxAmount) {
            throw (0, error_1.createError)({
                statusCode: 400,
                message: `Amount must be between ${minAmount} and ${maxAmount} ${currency}`,
            });
        }
        // Ensure closedAt is in the future
        const closeAtDate = new Date(closedAt);
        if (closeAtDate.getTime() <= Date.now()) {
            throw (0, error_1.createError)({
                statusCode: 400,
                message: "closedAt must be a future time",
            });
        }
        await (0, utils_1.ensureNotBanned)();
        return await db_1.sequelize.transaction(async (t) => {
            let wallet;
            if (!isDemo) {
                wallet = await db_1.models.wallet.findOne({
                    where: {
                        userId: userId,
                        currency: pair,
                        type: "SPOT",
                    },
                    transaction: t,
                    lock: t.LOCK.UPDATE,
                });
                if (!wallet) {
                    throw (0, error_1.createError)({ statusCode: 404, message: "Wallet not found" });
                }
                const newBalance = wallet.balance - amount;
                if (newBalance < 0) {
                    throw (0, error_1.createError)({
                        statusCode: 400,
                        message: "Insufficient balance",
                    });
                }
                await db_1.models.wallet.update({ balance: newBalance }, { where: { id: wallet.id }, transaction: t });
            }
            const exchange = await (0, utils_1.ensureExchange)();
            await (0, utils_1.ensureNotBanned)();
            let ticker;
            try {
                ticker = await exchange.fetchTicker(`${currency}/${pair}`);
            }
            catch (err) {
                console.error(`Error fetching market data for ${currency}/${pair}:`, err);
                throw (0, error_1.createError)({
                    statusCode: 500,
                    message: "Error fetching market data from exchange",
                });
            }
            const price = ticker === null || ticker === void 0 ? void 0 : ticker.last;
            if (!price) {
                throw (0, error_1.createError)({
                    statusCode: 500,
                    message: "Error fetching ticker data (price unavailable)",
                });
            }
            const finalOrder = await db_1.models.binaryOrder.create({
                userId: userId,
                symbol: `${currency}/${pair}`,
                type: type,
                side: side,
                status: "PENDING",
                price: price,
                profit: 0,
                amount: amount,
                isDemo: isDemo,
                closedAt: closeAtDate,
                barrier: ["HIGHER_LOWER", "TOUCH_NO_TOUCH", "TURBO"].includes(type)
                    ? barrier
                    : null,
                strikePrice: type === "CALL_PUT" ? strikePrice : null,
                payoutPerPoint: type === "CALL_PUT" || type === "TURBO" ? payoutPerPoint : null,
                durationType: type === "TURBO" ? durationType : "TIME",
            }, { transaction: t });
            if (!isDemo) {
                await db_1.models.transaction.create({
                    userId: userId,
                    walletId: wallet.id,
                    type: "BINARY_ORDER",
                    status: "PENDING",
                    amount: amount,
                    fee: 0,
                    description: `Binary Position | Market: ${currency}/${pair} | Amount: ${amount} ${currency} | Price: ${price} | Side: ${side} | Expiration: ${closeAtDate.toLocaleString()} | Type: ${type} | DurationType: ${durationType}`,
                    referenceId: finalOrder.id,
                }, { transaction: t });
            }
            this.scheduleOrderProcessing(finalOrder, userId);
            return finalOrder;
        });
    }
    static async processOrder(userId, orderId, symbol) {
        try {
            await (0, utils_1.ensureNotBanned)();
            const exchange = await (0, utils_1.ensureExchange)();
            const order = await (0, utils_1.getBinaryOrder)(userId, orderId);
            if (!order) {
                console.error(`Order ${orderId} not found for user ${userId}.`);
                return;
            }
            const ticker = await exchange.fetchTicker(symbol);
            const closePrice = ticker === null || ticker === void 0 ? void 0 : ticker.last;
            if (closePrice == null) {
                console.error(`No close price found for ${symbol}. Order: ${orderId}`);
                return;
            }
            // Idempotency check
            if (order.status !== "PENDING") {
                console.error(`Order ${orderId} already processed with status ${order.status}. Skipping.`);
                return;
            }
            let touched = false;
            if (order.type === "TOUCH_NO_TOUCH" &&
                order.barrier != null &&
                order.createdAt) {
                touched = await this.checkIfBarrierTouched(exchange, order.symbol, order.createdAt, order.closedAt, order.barrier);
            }
            let turboBreached = false;
            if (order.type === "TURBO" &&
                order.barrier != null &&
                (order.side === "UP" || order.side === "DOWN") &&
                order.createdAt) {
                turboBreached = await this.checkTurboBarrierBreach(exchange, order.symbol, order.createdAt, order.closedAt, order.barrier, order.side);
            }
            const updateData = this.determineOrderStatus(order, closePrice, touched, turboBreached);
            await this.updateBinaryOrder(orderId, updateData);
            this.orderIntervals.delete(orderId);
        }
        catch (error) {
            console.error(`Error processing order ${orderId}:`, error);
        }
    }
    static async checkTurboBarrierBreach(exchange, symbol, start, end, barrier, side) {
        const timeframe = "1m";
        const since = start.getTime();
        const until = end.getTime();
        let breached = false;
        let from = since;
        const limit = 1000;
        try {
            while (!breached && from < until) {
                const ohlcv = await exchange.fetchOHLCV(symbol, timeframe, from, limit);
                if (!ohlcv || ohlcv.length === 0) {
                    console.warn(`No OHLCV data for ${symbol} between ${new Date(from)} and ${new Date(until)}. Assuming no more data.`);
                    break;
                }
                for (const candle of ohlcv) {
                    const [timestamp, , high, low] = candle;
                    if (side === "UP" && low < barrier) {
                        breached = true;
                        break;
                    }
                    else if (side === "DOWN" && high > barrier) {
                        breached = true;
                        break;
                    }
                    if (timestamp > until) {
                        break;
                    }
                }
                const lastCandleTime = ohlcv[ohlcv.length - 1][0];
                if (lastCandleTime <= from) {
                    console.warn("No progress in OHLCV time. Stopping fetch loop.");
                    break;
                }
                from = lastCandleTime + 60000;
            }
        }
        catch (err) {
            console.error(`Error fetching OHLC data for TURBO check:`, err);
            breached = true;
        }
        return breached;
    }
    static async checkIfBarrierTouched(exchange, symbol, start, end, barrier) {
        const timeframe = "1m";
        const since = start.getTime();
        const until = end.getTime();
        let touched = false;
        let from = since;
        const limit = 1000;
        try {
            while (!touched && from < until) {
                const ohlcv = await exchange.fetchOHLCV(symbol, timeframe, from, limit);
                if (!ohlcv || ohlcv.length === 0) {
                    console.warn(`No OHLCV data for ${symbol} between ${new Date(from)} and ${new Date(until)}.`);
                    break;
                }
                for (const candle of ohlcv) {
                    const [timestamp, , high, low] = candle;
                    if (high >= barrier && low <= barrier) {
                        touched = true;
                        break;
                    }
                    if (timestamp > until)
                        break;
                }
                const lastCandleTime = ohlcv[ohlcv.length - 1][0];
                if (lastCandleTime <= from) {
                    console.warn("No progress in OHLCV time. Stopping fetch loop.");
                    break;
                }
                from = lastCandleTime + 60000;
            }
        }
        catch (err) {
            console.error(`Error fetching OHLC data for TOUCH_NO_TOUCH:`, err);
        }
        return touched;
    }
    static async cancelOrder(userId, orderId, percentage) {
        const order = await (0, utils_1.getBinaryOrder)(userId, orderId);
        if (!order) {
            throw (0, error_1.createError)(404, "Order not found");
        }
        if (["CANCELED", "WIN", "LOSS", "DRAW"].includes(order.status)) {
            console.error(`Order ${orderId} is already ${order.status}. Cannot cancel again.`);
            return { message: "Order already processed or canceled." };
        }
        await (0, utils_1.ensureNotBanned)();
        const exchange = await (0, utils_1.ensureExchange)();
        const ticker = await exchange.fetchTicker(order.symbol);
        const currentPrice = ticker.last;
        if (!currentPrice) {
            throw (0, error_1.createError)(500, "Error fetching current price for the order symbol");
        }
        const now = Date.now();
        const expiryTime = new Date(order.closedAt).getTime();
        if (order.type === "CALL_PUT") {
            if (expiryTime - now <= 60000) {
                throw (0, error_1.createError)(400, "Cannot sell the CALL/PUT contract within 60 seconds of expiry.");
            }
        }
        else if (order.type === "TURBO") {
            if (order.durationType === "TICKS") {
                throw (0, error_1.createError)(400, "Cannot sell a TURBO contract with TICKS duration early.");
            }
            if (expiryTime - now <= 15000) {
                throw (0, error_1.createError)(400, "Cannot sell the TURBO contract within 15 seconds of expiry.");
            }
        }
        await this.processStandardCancel(order, currentPrice, percentage);
        return { message: "Order cancelled" };
    }
    static async processStandardCancel(order, currentPrice, percentage) {
        await db_1.sequelize.transaction(async (t) => {
            if (!order.isDemo) {
                const transactionRecord = await db_1.models.transaction.findOne({
                    where: { referenceId: order.id },
                    transaction: t,
                    lock: t.LOCK.UPDATE,
                });
                if (!transactionRecord) {
                    throw (0, error_1.createError)(404, "Transaction not found");
                }
                const wallet = await db_1.models.wallet.findOne({
                    where: { id: transactionRecord.walletId },
                    transaction: t,
                    lock: t.LOCK.UPDATE,
                });
                if (!wallet) {
                    throw (0, error_1.createError)(404, "Wallet not found");
                }
                let partialReturn = order.amount;
                if (percentage !== undefined) {
                    const cutAmount = order.amount * (Math.abs(percentage) / 100);
                    partialReturn = order.amount - cutAmount;
                    if (partialReturn < 0)
                        partialReturn = 0;
                }
                const newBalance = wallet.balance + partialReturn;
                await db_1.models.wallet.update({ balance: newBalance }, { where: { id: wallet.id }, transaction: t });
                await db_1.models.transaction.destroy({
                    where: { id: transactionRecord.id },
                    force: true,
                    transaction: t,
                });
            }
            if (this.orderIntervals.has(order.id)) {
                clearTimeout(this.orderIntervals.get(order.id));
                this.orderIntervals.delete(order.id);
            }
            await db_1.models.binaryOrder.update({ status: "CANCELED", closePrice: currentPrice, profit: 0 }, { where: { id: order.id }, transaction: t });
        });
    }
    static async processPendingOrders() {
        try {
            const pendingOrders = await (0, utils_1.getBinaryOrdersByStatus)("PENDING");
            const currentTime = Date.now();
            const unmonitoredOrders = pendingOrders.filter((order) => {
                const closedAtTime = new Date(order.closedAt).getTime();
                return (closedAtTime <= currentTime && !this.orderIntervals.has(order.id));
            });
            const exchange = await (0, utils_1.ensureExchange)();
            for (const order of unmonitoredOrders) {
                if (order.status !== "PENDING") {
                    console.error(`Order ${order.id} already processed as ${order.status}. Skipping.`);
                    continue;
                }
                const timeframe = "1m";
                let closePrice;
                try {
                    const ohlcv = await exchange.fetchOHLCV(order.symbol, timeframe, Number(order.closedAt) - 60000, 2);
                    if (ohlcv && ohlcv.length > 1) {
                        closePrice = ohlcv[1][4];
                    }
                    else {
                        console.warn(`Not enough OHLCV data for order ${order.id} to determine closePrice. Using ticker.`);
                        const ticker = await exchange.fetchTicker(order.symbol);
                        closePrice = ticker.last;
                    }
                }
                catch (err) {
                    console.error(`Error fetching OHLCV for pending order ${order.id}:`, err);
                    const ticker = await exchange.fetchTicker(order.symbol);
                    closePrice = ticker.last;
                }
                if (closePrice === undefined) {
                    console.error(`Unable to determine closePrice for order ${order.id}. Skipping.`);
                    continue;
                }
                const updateData = this.determineOrderStatus(order, closePrice);
                await this.updateBinaryOrder(order.id, updateData);
            }
        }
        catch (error) {
            console.error("Error in processPendingOrders:", error);
            throw error;
        }
    }
    static determineOrderStatus(order, closePrice, touched, turboBreached) {
        const updateData = {
            closePrice,
            profit: 0,
        };
        switch (order.type) {
            case "RISE_FALL":
                return determineRiseFallStatus(order, closePrice, updateData);
            case "HIGHER_LOWER":
                return determineHigherLowerStatus(order, closePrice, updateData);
            case "TOUCH_NO_TOUCH":
                return determineTouchNoTouchStatus(order, touched, updateData);
            case "CALL_PUT":
                return determineCallPutStatus(order, closePrice, updateData);
            case "TURBO":
                return determineTurboStatus(order, closePrice, turboBreached, updateData);
            default:
                updateData.status = "LOSS";
                return updateData;
        }
    }
    static async updateBinaryOrder(orderId, updateData) {
        await db_1.sequelize.transaction(async (t) => {
            await db_1.models.binaryOrder.update(updateData, {
                where: { id: orderId },
                transaction: t,
            });
            const order = (await db_1.models.binaryOrder.findOne({
                where: { id: orderId },
                transaction: t,
            }));
            if (!order)
                throw new Error("Order not found after update");
            if (!order.isDemo && ["WIN", "LOSS", "DRAW"].includes(order.status)) {
                const transactionRecord = await db_1.models.transaction.findOne({
                    where: { referenceId: orderId },
                    transaction: t,
                });
                if (!transactionRecord) {
                    throw new Error("Transaction not found for completed order");
                }
                await db_1.models.transaction.update({ status: "COMPLETED" }, { where: { id: transactionRecord.id }, transaction: t });
                const wallet = await db_1.models.wallet.findOne({
                    where: { id: transactionRecord.walletId },
                    transaction: t,
                    lock: t.LOCK.UPDATE,
                });
                if (!wallet)
                    throw new Error("Wallet not found to update balance");
                let { balance } = wallet;
                balance = applyFinalPayout(order, balance);
                await db_1.models.wallet.update({ balance }, { where: { id: wallet.id }, transaction: t });
            }
            if (["WIN", "LOSS", "DRAW"].includes(order.status)) {
                await (0, Websocket_1.sendMessageToRoute)("/api/exchange/binary/order", { type: "order", symbol: order.symbol, userId: order.userId }, {
                    type: "ORDER_COMPLETED",
                    order,
                });
                const user = await db_1.models.user.findOne({
                    where: { id: order.userId },
                    transaction: t,
                });
                if (user) {
                    try {
                        await (0, emails_1.sendBinaryOrderEmail)(user, order);
                        await (0, notifications_1.handleNotification)({
                            userId: user.id,
                            title: "Binary Order Completed",
                            message: `Your binary order for ${order.symbol} has been completed with a status of ${order.status}`,
                            type: "ACTIVITY",
                        });
                    }
                    catch (error) {
                        console.error(`Error sending binary order email for user ${user.id}, order ${order.id}:`, error);
                    }
                }
            }
        });
    }
    static scheduleOrderProcessing(order, userId) {
        const currentTimeUtc = Date.now();
        const closedAt = order.closedAt.getTime();
        const delay = closedAt - currentTimeUtc;
        if (delay < 0) {
            console.warn(`Order ${order.id} closedAt is in the past. Processing immediately.`);
            this.processOrder(userId, order.id, order.symbol);
            return;
        }
        const timer = setTimeout(() => {
            this.processOrder(userId, order.id, order.symbol);
        }, delay);
        this.orderIntervals.set(order.id, timer);
    }
}
exports.BinaryOrderService = BinaryOrderService;
BinaryOrderService.orderIntervals = new Map();
function applyFinalPayout(order, balance) {
    // After resolution:
    // WIN: return initial balance + amount + profit
    // LOSS: no addition (already deducted at creation)
    // DRAW: return initial balance + amount (profit=0)
    switch (order.status) {
        case "WIN":
            return balance + order.amount + order.profit;
        case "LOSS":
            return balance;
        case "DRAW":
            return balance + order.amount;
        default:
            return balance;
    }
}
// Determination functions
function determineRiseFallStatus(order, closePrice, updateData) {
    if (order.side === "RISE") {
        // RISE wins if closePrice > order.price
        if (closePrice > order.price) {
            updateData.status = "WIN";
            updateData.profit = order.amount * (binaryRiseFallProfit / 100);
        }
        else if (closePrice === order.price) {
            updateData.status = "DRAW";
        }
        else {
            // closePrice < order.price
            updateData.status = "LOSS";
        }
    }
    else {
        // side = FALL
        // FALL wins if closePrice < order.price
        if (closePrice < order.price) {
            updateData.status = "WIN";
            updateData.profit = order.amount * (binaryRiseFallProfit / 100);
        }
        else if (closePrice === order.price) {
            updateData.status = "DRAW";
        }
        else {
            // closePrice > order.price
            updateData.status = "LOSS";
        }
    }
    return updateData;
}
function determineHigherLowerStatus(order, closePrice, updateData) {
    const hlBarrier = order.barrier;
    if (order.side === "HIGHER") {
        // HIGHER wins if closePrice > barrier
        if (closePrice > hlBarrier) {
            updateData.status = "WIN";
            updateData.profit = order.amount * (binaryHigherLowerProfit / 100);
        }
        else if (closePrice === hlBarrier) {
            updateData.status = "DRAW";
        }
        else {
            // closePrice < barrier
            updateData.status = "LOSS";
        }
    }
    else {
        // side = LOWER
        // LOWER wins if closePrice < barrier
        if (closePrice < hlBarrier) {
            updateData.status = "WIN";
            updateData.profit = order.amount * (binaryHigherLowerProfit / 100);
        }
        else if (closePrice === hlBarrier) {
            updateData.status = "DRAW";
        }
        else {
            // closePrice > barrier
            updateData.status = "LOSS";
        }
    }
    return updateData;
}
function determineTouchNoTouchStatus(order, touched, updateData) {
    if (order.side === "TOUCH") {
        // TOUCH wins if touched == true
        if (touched) {
            updateData.status = "WIN";
            updateData.profit = order.amount * (binaryTouchNoTouchProfit / 100);
        }
        else {
            updateData.status = "LOSS";
        }
    }
    else {
        // side = NO_TOUCH
        // NO_TOUCH wins if not touched
        if (!touched) {
            updateData.status = "WIN";
            updateData.profit = order.amount * (binaryTouchNoTouchProfit / 100);
        }
        else {
            updateData.status = "LOSS";
        }
    }
    return updateData;
}
function determineCallPutStatus(order, closePrice, updateData) {
    const { strikePrice } = order;
    if (!strikePrice) {
        console.error(`CALL_PUT order ${order.id} missing strikePrice. Defaulting to LOSS.`);
        updateData.status = "LOSS";
        return updateData;
    }
    if (order.side === "CALL") {
        // CALL wins if closePrice > strikePrice
        if (closePrice > strikePrice) {
            updateData.status = "WIN";
            updateData.profit = order.amount * (binaryCallPutProfit / 100);
        }
        else if (closePrice === strikePrice) {
            updateData.status = "DRAW";
        }
        else {
            // closePrice < strikePrice
            updateData.status = "LOSS";
        }
    }
    else {
        // side = PUT
        // PUT wins if closePrice < strikePrice
        if (closePrice < strikePrice) {
            updateData.status = "WIN";
            updateData.profit = order.amount * (binaryCallPutProfit / 100);
        }
        else if (closePrice === strikePrice) {
            updateData.status = "DRAW";
        }
        else {
            // closePrice > strikePrice
            updateData.status = "LOSS";
        }
    }
    return updateData;
}
function determineTurboStatus(order, closePrice, turboBreached, updateData) {
    const { barrier, payoutPerPoint } = order;
    if (!barrier || !payoutPerPoint) {
        console.error(`TURBO order ${order.id} missing barrier or payoutPerPoint. Defaulting to LOSS.`);
        updateData.status = "LOSS";
        return updateData;
    }
    if (turboBreached) {
        updateData.status = "LOSS";
        return updateData;
    }
    let payoutValue = 0;
    if (order.side === "UP") {
        if (closePrice > barrier) {
            payoutValue = (closePrice - barrier) * payoutPerPoint;
            if (payoutValue > order.amount) {
                updateData.status = "WIN";
                updateData.profit = payoutValue - order.amount;
            }
            else if (payoutValue === order.amount) {
                updateData.status = "DRAW";
            }
            else {
                updateData.status = "LOSS";
            }
        }
        else if (closePrice === barrier) {
            updateData.status = "DRAW";
        }
        else {
            updateData.status = "LOSS";
        }
    }
    else {
        // side = DOWN
        if (closePrice < barrier) {
            payoutValue = (barrier - closePrice) * payoutPerPoint;
            if (payoutValue > order.amount) {
                updateData.status = "WIN";
                updateData.profit = payoutValue - order.amount;
            }
            else if (payoutValue === order.amount) {
                updateData.status = "DRAW";
            }
            else {
                updateData.status = "LOSS";
            }
        }
        else if (closePrice === barrier) {
            updateData.status = "DRAW";
        }
        else {
            updateData.status = "LOSS";
        }
    }
    return updateData;
}
// Validation
function validateIsPositiveNumber(value, fieldName, errors) {
    if (typeof value !== "number" || isNaN(value) || value <= 0) {
        errors.push(`${fieldName} is required and must be a positive number`);
    }
}
function validateAllowedValues(value, allowedValues, fieldName, errors) {
    if (!allowedValues.includes(value)) {
        errors.push(`Invalid ${fieldName}: ${value}`);
    }
}
const typeConfig = {
    RISE_FALL: { validSides: ["RISE", "FALL"] },
    HIGHER_LOWER: {
        validSides: ["HIGHER", "LOWER"],
        requiresBarrier: true,
    },
    TOUCH_NO_TOUCH: {
        validSides: ["TOUCH", "NO_TOUCH"],
        requiresBarrier: true,
    },
    CALL_PUT: {
        validSides: ["CALL", "PUT"],
        requiresStrikePrice: true,
        requiresPayoutPerPoint: true,
    },
    TURBO: {
        validSides: ["UP", "DOWN"],
        requiresBarrier: true,
        requiresPayoutPerPoint: true,
        requiresDurationType: ["TIME", "TICKS"],
    },
};
function validateCreateOrderInput(params) {
    const { side, type, barrier, strikePrice, payoutPerPoint, durationType } = params;
    const errors = [];
    if (!(type in typeConfig)) {
        throw (0, error_1.createError)({ statusCode: 400, message: `Invalid type: ${type}` });
    }
    const config = typeConfig[type];
    // Validate side
    validateAllowedValues(side, config.validSides, "side", errors);
    // Validate barrier if required
    if (config.requiresBarrier) {
        validateIsPositiveNumber(barrier, "barrier", errors);
    }
    // Validate strikePrice if required
    if (config.requiresStrikePrice) {
        validateIsPositiveNumber(strikePrice, "strikePrice", errors);
    }
    // Validate payoutPerPoint if required
    if (config.requiresPayoutPerPoint) {
        validateIsPositiveNumber(payoutPerPoint, "payoutPerPoint", errors);
    }
    // Validate durationType if required
    if (config.requiresDurationType) {
        if (!durationType) {
            errors.push("durationType is required");
        }
        else {
            validateAllowedValues(durationType, config.requiresDurationType, "durationType", errors);
        }
    }
    if (errors.length > 0) {
        const errorMessage = errors.join(", ");
        throw (0, error_1.createError)({ statusCode: 400, message: errorMessage });
    }
}
exports.validateCreateOrderInput = validateCreateOrderInput;
