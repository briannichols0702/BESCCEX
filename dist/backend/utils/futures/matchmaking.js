"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortOrders = exports.validateOrder = exports.filterAndSortOrders = exports.addTradeToOrder = exports.processMatchedOrders = exports.matchAndCalculateOrders = void 0;
const blockchain_1 = require("@b/utils/eco/blockchain");
const ws_1 = require("./ws");
const logger_1 = require("@b/utils/logger");
const position_1 = require("./position");
const matchAndCalculateOrders = async (orders, currentOrderBook) => {
    const matchedOrders = [];
    const bookUpdates = { bids: {}, asks: {} };
    const processedOrders = new Set();
    const buyOrders = (0, exports.filterAndSortOrders)(orders, "BUY", true);
    const sellOrders = (0, exports.filterAndSortOrders)(orders, "SELL", false);
    let buyIndex = 0, sellIndex = 0;
    while (buyIndex < buyOrders.length && sellIndex < sellOrders.length) {
        const buyOrder = buyOrders[buyIndex];
        const sellOrder = sellOrders[sellIndex];
        if (processedOrders.has(buyOrder.id) || processedOrders.has(sellOrder.id)) {
            if (processedOrders.has(buyOrder.id))
                buyIndex++;
            if (processedOrders.has(sellOrder.id))
                sellIndex++;
            continue;
        }
        let matchFound = false;
        if (buyOrder.type === "LIMIT" && sellOrder.type === "LIMIT") {
            matchFound =
                (buyOrder.side === "BUY" && buyOrder.price >= sellOrder.price) ||
                    (buyOrder.side === "SELL" && sellOrder.price >= buyOrder.price);
        }
        else if (buyOrder.type === "MARKET" || sellOrder.type === "MARKET") {
            matchFound = true;
        }
        if (matchFound) {
            processedOrders.add(buyOrder.id);
            processedOrders.add(sellOrder.id);
            try {
                const matchedPrice = buyOrder.type === "MARKET"
                    ? sellOrder.price
                    : sellOrder.type === "MARKET"
                        ? buyOrder.price
                        : sellOrder.price; // Use the sell order's price for matching
                await (0, exports.processMatchedOrders)(buyOrder, sellOrder, currentOrderBook, bookUpdates, matchedPrice);
            }
            catch (error) {
                (0, logger_1.logError)("match_calculate_orders", error, __filename);
                console.error(`Failed to process matched orders: ${error}`);
            }
            matchedOrders.push(buyOrder, sellOrder);
            if (buyOrder.type === "LIMIT" && buyOrder.remaining === BigInt(0)) {
                buyIndex++;
            }
            if (sellOrder.type === "LIMIT" && sellOrder.remaining === BigInt(0)) {
                sellIndex++;
            }
            if (buyOrder.type === "MARKET" && buyOrder.remaining > BigInt(0)) {
                processedOrders.delete(buyOrder.id);
            }
            if (sellOrder.type === "MARKET" && sellOrder.remaining > BigInt(0)) {
                processedOrders.delete(sellOrder.id);
            }
        }
        else {
            if (buyOrder.type !== "MARKET" &&
                BigInt(buyOrder.price) < BigInt(sellOrder.price)) {
                buyIndex++;
            }
            if (sellOrder.type !== "MARKET" &&
                BigInt(sellOrder.price) > BigInt(buyOrder.price)) {
                sellIndex++;
            }
        }
    }
    return { matchedOrders, bookUpdates };
};
exports.matchAndCalculateOrders = matchAndCalculateOrders;
const processMatchedOrders = async (buyOrder, sellOrder, currentOrderBook, bookUpdates, matchedPrice) => {
    const amountToFill = BigInt(buyOrder.remaining) < BigInt(sellOrder.remaining)
        ? BigInt(buyOrder.remaining)
        : BigInt(sellOrder.remaining);
    updateOrderBook(bookUpdates, buyOrder, currentOrderBook, amountToFill);
    updateOrderBook(bookUpdates, sellOrder, currentOrderBook, amountToFill);
    [buyOrder, sellOrder].forEach((order) => {
        order.filled += amountToFill;
        order.remaining -= amountToFill;
        order.status = order.remaining === BigInt(0) ? "CLOSED" : "OPEN";
    });
    try {
        await (0, position_1.updatePositions)(buyOrder, sellOrder, amountToFill, matchedPrice);
    }
    catch (error) {
        (0, logger_1.logError)("process_matched_orders", error, __filename);
        console.error(`Failed to update wallet balances: ${error}`);
    }
    const buyTradeDetail = {
        id: `${buyOrder.id}`,
        amount: (0, blockchain_1.fromBigInt)(amountToFill),
        price: (0, blockchain_1.fromBigInt)(matchedPrice),
        cost: (0, blockchain_1.fromBigIntMultiply)(amountToFill, matchedPrice),
        side: buyOrder.side,
        timestamp: Date.now(),
    };
    const sellTradeDetail = {
        id: `${sellOrder.id}`,
        amount: (0, blockchain_1.fromBigInt)(amountToFill),
        price: (0, blockchain_1.fromBigInt)(matchedPrice),
        cost: (0, blockchain_1.fromBigIntMultiply)(amountToFill, matchedPrice),
        side: sellOrder.side,
        timestamp: Date.now(),
    };
    addTradeToOrder(buyOrder, buyTradeDetail);
    addTradeToOrder(sellOrder, sellTradeDetail);
    const trades = [buyTradeDetail, sellTradeDetail];
    (0, ws_1.handleTradesBroadcast)(buyOrder.symbol, trades);
    // Handle stop loss and take profit
    await handleStopLossTakeProfit(buyOrder, matchedPrice);
    await handleStopLossTakeProfit(sellOrder, matchedPrice);
};
exports.processMatchedOrders = processMatchedOrders;
const handleStopLossTakeProfit = async (order, finalPrice) => {
    const currentPrice = finalPrice;
    if (order.stopLossPrice && order.remaining > BigInt(0)) {
        const stopLossTrigger = order.side === "BUY"
            ? currentPrice <= order.stopLossPrice
            : currentPrice >= order.stopLossPrice;
        if (stopLossTrigger) {
            order.status = "CLOSED";
            order.remaining = BigInt(0);
            (0, ws_1.handleTradesBroadcast)(order.symbol, [
                {
                    ...order,
                    status: "STOP_LOSS_TRIGGERED",
                    timestamp: Date.now(),
                },
            ]);
        }
    }
    if (order.takeProfitPrice && order.remaining > BigInt(0)) {
        const takeProfitTrigger = order.side === "BUY"
            ? currentPrice >= order.takeProfitPrice
            : currentPrice <= order.takeProfitPrice;
        if (takeProfitTrigger) {
            order.status = "CLOSED";
            order.remaining = BigInt(0);
            (0, ws_1.handleTradesBroadcast)(order.symbol, [
                {
                    ...order,
                    status: "TAKE_PROFIT_TRIGGERED",
                    timestamp: Date.now(),
                },
            ]);
        }
    }
};
function addTradeToOrder(order, trade) {
    let trades = [];
    if (order.trades) {
        try {
            if (typeof order.trades === "string") {
                trades = JSON.parse(order.trades);
                if (!Array.isArray(trades) && typeof trades === "string") {
                    trades = JSON.parse(trades);
                }
            }
            else if (Array.isArray(order.trades)) {
                trades = order.trades;
            }
            else {
                (0, logger_1.logError)("add_trade_to_order", new Error("Invalid trades format"), __filename);
                console.error("Invalid trades format, resetting trades:", order.trades);
                trades = [];
            }
        }
        catch (e) {
            (0, logger_1.logError)("add_trade_to_order", e, __filename);
            console.error("Error parsing trades", e);
            trades = [];
        }
    }
    const mergedTrades = [...trades, trade].sort((a, b) => a.timestamp - b.timestamp);
    order.trades = JSON.stringify(mergedTrades, blockchain_1.BigIntReplacer);
    return order.trades;
}
exports.addTradeToOrder = addTradeToOrder;
const updateOrderBook = (bookUpdates, order, currentOrderBook, amount) => {
    const priceStr = order.price.toString();
    const bookSide = order.side === "BUY" ? "bids" : "asks";
    if (currentOrderBook[bookSide][priceStr]) {
        currentOrderBook[bookSide][priceStr] -= amount;
    }
    bookUpdates[bookSide][priceStr] = currentOrderBook[bookSide][priceStr];
};
const filterAndSortOrders = (orders, side, isBuy) => {
    return orders
        .filter((o) => o.side === side)
        .sort((a, b) => {
        if (isBuy) {
            return (Number(b.price) - Number(a.price) ||
                a.createdAt.getTime() - b.createdAt.getTime());
        }
        else {
            return (Number(a.price) - Number(b.price) ||
                a.createdAt.getTime() - b.createdAt.getTime());
        }
    })
        .filter((order) => !isBuy || BigInt(order.price) >= BigInt(0));
};
exports.filterAndSortOrders = filterAndSortOrders;
function validateOrder(order) {
    if (!order ||
        !order.id ||
        !order.userId ||
        !order.symbol ||
        !order.type ||
        !order.side ||
        typeof order.price !== "bigint" ||
        typeof order.amount !== "bigint" ||
        typeof order.filled !== "bigint" ||
        typeof order.remaining !== "bigint" ||
        typeof order.cost !== "bigint" ||
        typeof order.fee !== "bigint" ||
        !order.feeCurrency ||
        !order.status ||
        !(order.createdAt instanceof Date) ||
        !(order.updatedAt instanceof Date)) {
        (0, logger_1.logError)("validate_order", new Error("Order validation failed"), __filename);
        console.error("Order validation failed: ", order);
        return false;
    }
    return true;
}
exports.validateOrder = validateOrder;
function sortOrders(orders, isBuy) {
    return orders.sort((a, b) => {
        const priceComparison = isBuy
            ? Number(b.price - a.price)
            : Number(a.price - b.price);
        if (priceComparison !== 0)
            return priceComparison;
        if (a.createdAt < b.createdAt)
            return -1;
        if (a.createdAt > b.createdAt)
            return 1;
        return 0;
    });
}
exports.sortOrders = sortOrders;
