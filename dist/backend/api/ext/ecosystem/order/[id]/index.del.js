"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const utils_1 = require("@b/api/finance/wallet/utils");
const blockchain_1 = require("@b/utils/eco/blockchain");
const matchingEngine_1 = require("@b/utils/eco/matchingEngine");
const queries_1 = require("@b/utils/eco/scylla/queries");
const wallet_1 = require("@b/utils/eco/wallet");
const error_1 = require("@b/utils/error");
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Cancels an existing trading order",
    description: "Cancels an open trading order and refunds the unfulfilled amount, including fee adjustments for partial fills.",
    operationId: "cancelOrder",
    tags: ["Trading", "Orders"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", description: "UUID of the order" },
        },
        {
            name: "timestamp",
            in: "query",
            required: true,
            schema: { type: "string", description: "Timestamp of the order" },
        },
    ],
    responses: {
        200: {
            description: "Order cancelled successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            message: { type: "string", description: "Success message" },
                        },
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("Order"),
        500: query_1.serverErrorResponse,
    },
    requiresAuth: true,
};
exports.default = async (data) => {
    const { params, query, user } = data;
    if (!(user === null || user === void 0 ? void 0 : user.id)) {
        throw (0, error_1.createError)({ statusCode: 401, message: "Unauthorized" });
    }
    const { id } = params;
    const { timestamp } = query;
    if (!id || !timestamp) {
        throw (0, error_1.createError)({
            statusCode: 400,
            message: "Invalid request parameters",
        });
    }
    try {
        const order = await (0, queries_1.getOrderByUuid)(user.id, id, timestamp);
        if (!order) {
            throw new Error("Order not found");
        }
        if (order.status !== "OPEN") {
            throw new Error("Order is not open");
        }
        const totalAmount = BigInt(order.amount);
        const remaining = BigInt(order.remaining);
        const totalCost = BigInt(order.cost);
        const side = order.side;
        const symbol = order.symbol;
        if (remaining === BigInt(0)) {
            // No leftover portion to cancel.
            throw new Error("Order is fully filled; nothing to cancel.");
        }
        const [currency, pair] = symbol.split("/");
        let refundAmount = 0;
        if (side === "BUY") {
            // The user locked 'totalCost' = amount*price + fee in 'pair' currency upfront.
            // Unused portion: (remaining/totalAmount) * totalCost
            const leftoverRatio = Number(remaining) / Number(totalAmount);
            refundAmount = (0, blockchain_1.fromBigInt)(totalCost) * leftoverRatio;
            // Refund is in 'pair' currency.
        }
        else {
            // side === "SELL"
            // The user locked 'amount' of the base currency upfront and did not pay fee upfront.
            // Unused portion: (remaining/totalAmount) * amount
            const leftoverRatio = Number(remaining) / Number(totalAmount);
            refundAmount = (0, blockchain_1.fromBigInt)(totalAmount) * leftoverRatio;
            // Refund is in 'currency' (base) since that's what was locked.
        }
        const refundCurrency = side === "BUY" ? pair : currency;
        const wallet = await (0, utils_1.getWallet)(user.id, "ECO", refundCurrency);
        if (!wallet) {
            throw new Error(`${refundCurrency} wallet not found`);
        }
        // Update order status to CANCELED and remaining to 0, as we are cancelling the leftover portion.
        // After cancellation, the order no longer has any active portion on the orderbook.
        await (0, queries_1.cancelOrderByUuid)(user.id, id, timestamp, symbol, BigInt(order.price), side, totalAmount);
        // Refund the leftover funds
        await (0, wallet_1.updateWalletBalance)(wallet, refundAmount, "add");
        // Remove from orderbook and internal queues
        const matchingEngine = await matchingEngine_1.MatchingEngine.getInstance();
        await matchingEngine.handleOrderCancellation(id, symbol);
        return {
            message: "Order cancelled and leftover balance refunded successfully",
        };
    }
    catch (error) {
        throw (0, error_1.createError)({
            statusCode: 500,
            message: `Failed to cancel order: ${error.message}`,
        });
    }
};
