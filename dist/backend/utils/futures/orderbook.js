"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyUpdatesToOrderBook = exports.updateOrderBookState = void 0;
const logger_1 = require("@b/utils/logger");
async function updateOrderBookState(symbolOrderBook, bookUpdates) {
    const sides = ["asks", "bids"];
    try {
        await Promise.all(sides.map(async (side) => {
            for (const [price, amount] of Object.entries(bookUpdates[side])) {
                const bigAmount = BigInt(amount);
                if (!symbolOrderBook[side][price]) {
                    symbolOrderBook[side][price] =
                        bigAmount > BigInt(0) ? bigAmount : BigInt(0);
                }
                else {
                    symbolOrderBook[side][price] += bigAmount;
                    if (symbolOrderBook[side][price] <= BigInt(0)) {
                        delete symbolOrderBook[side][price];
                    }
                }
            }
        }));
    }
    catch (error) {
        (0, logger_1.logError)("update_order_book_state", error, __filename);
        console.error("Failed to update order book state:", error);
    }
}
exports.updateOrderBookState = updateOrderBookState;
function applyUpdatesToOrderBook(currentOrderBook, updates) {
    const updatedOrderBook = {
        bids: { ...currentOrderBook.bids },
        asks: { ...currentOrderBook.asks },
    };
    ["bids", "asks"].forEach((side) => {
        if (!updates[side]) {
            console.error(`No updates for ${side}`);
            return;
        }
        for (const [price, updatedAmountStr] of Object.entries(updates[side])) {
            if (typeof updatedAmountStr === "undefined") {
                console.error(`Undefined amount for price ${price} in ${side}`);
                continue;
            }
            try {
                const updatedAmount = BigInt(updatedAmountStr);
                if (updatedAmount > BigInt(0)) {
                    updatedOrderBook[side][price] = updatedAmount;
                }
                else {
                    delete updatedOrderBook[side][price];
                }
            }
            catch (e) {
                (0, logger_1.logError)("apply_updates_to_order_book", e, __filename);
                console.error(`Error converting ${updatedAmountStr} to BigInt: ${e.message}`);
            }
        }
    });
    return updatedOrderBook;
}
exports.applyUpdatesToOrderBook = applyUpdatesToOrderBook;
