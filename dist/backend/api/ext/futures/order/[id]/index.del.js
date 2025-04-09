"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const utils_1 = require("@b/api/finance/wallet/utils");
const blockchain_1 = require("@b/utils/eco/blockchain");
const matchingEngine_1 = require("@b/utils/futures/matchingEngine");
const wallet_1 = require("@b/utils/eco/wallet");
const error_1 = require("@b/utils/error");
const query_1 = require("@b/utils/query");
const order_1 = require("@b/utils/futures/queries/order");
exports.metadata = {
    summary: "Cancels an existing futures trading order",
    description: "Cancels an open futures trading order and refunds the unfulfilled amount.",
    operationId: "cancelFuturesOrder",
    tags: ["Futures", "Orders"],
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
        const order = await (0, order_1.getOrderByUuid)(user.id, id, timestamp);
        if (!order) {
            throw (0, error_1.createError)({
                statusCode: 404,
                message: "Order not found",
            });
        }
        if (order.status !== "OPEN") {
            throw (0, error_1.createError)({
                statusCode: 400,
                message: "Order is not open",
            });
        }
        await (0, order_1.cancelOrderByUuid)(user.id, id, timestamp, order.symbol, BigInt(order.price), order.side, BigInt(order.amount));
        const [currency, pair] = order.symbol.split("/");
        const refundAmount = (0, blockchain_1.fromBigInt)(order.cost) + (0, blockchain_1.fromBigInt)(order.fee); // Refund the cost and fee
        const walletCurrency = order.side === "BUY" ? pair : currency;
        const wallet = await (0, utils_1.getWallet)(user.id, "FUTURES", walletCurrency);
        if (!wallet) {
            throw (0, error_1.createError)({
                statusCode: 404,
                message: `${walletCurrency} wallet not found`,
            });
        }
        await (0, wallet_1.updateWalletBalance)(wallet, refundAmount, "add");
        const matchingEngine = await matchingEngine_1.FuturesMatchingEngine.getInstance();
        await matchingEngine.handleOrderCancellation(id, order.symbol);
        return { message: "Order cancelled and balance refunded successfully" };
    }
    catch (error) {
        throw (0, error_1.createError)({
            statusCode: 500,
            message: `Failed to cancel order: ${error.message}`,
        });
    }
};
