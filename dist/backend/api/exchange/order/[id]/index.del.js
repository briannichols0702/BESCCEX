"use strict";
// /server/api/exchange/orders/cancel.del.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const exchange_1 = __importDefault(require("@b/utils/exchange"));
const index_get_1 = require("./index.get");
const db_1 = require("@b/db");
const utils_1 = require("../utils");
const query_1 = require("@b/utils/query");
const utils_2 = require("@b/api/finance/wallet/utils");
const index_ws_1 = require("../index.ws");
const error_1 = require("@b/utils/error");
const utils_3 = require("../../utils");
exports.metadata = {
    summary: "Cancel Order",
    operationId: "cancelOrder",
    tags: ["Exchange", "Orders"],
    description: "Cancels a specific order for the authenticated user.",
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            required: true,
            description: "ID of the order to cancel.",
            schema: { type: "string" },
        },
    ],
    responses: {
        200: {
            description: "Order canceled successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            message: {
                                type: "string",
                                example: "Order canceled successfully",
                            },
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
    const { user, params } = data;
    if (!(user === null || user === void 0 ? void 0 : user.id))
        throw (0, error_1.createError)(401, "Unauthorized");
    const { id } = params;
    try {
        // Check for ban status
        const unblockTime = await (0, utils_3.loadBanStatus)();
        if (await (0, utils_3.handleBanStatus)(unblockTime)) {
            const waitTime = unblockTime - Date.now();
            throw (0, error_1.createError)(503, `Service temporarily unavailable. Please try again in ${(0, utils_3.formatWaitTime)(waitTime)}.`);
        }
        const order = await (0, index_get_1.getOrder)(id);
        if (!order)
            throw (0, error_1.createError)(404, "Order not found");
        if (order.status === "CANCELED")
            throw (0, error_1.createError)(400, "Order already canceled");
        if (order.userId !== user.id)
            throw (0, error_1.createError)(401, "Unauthorized");
        const exchange = await exchange_1.default.startExchange();
        if (!exchange)
            throw (0, error_1.createError)(503, "Service currently unavailable");
        try {
            // Fetch the latest order data from the exchange
            let orderData;
            if (exchange.has["fetchOrder"]) {
                orderData = await exchange.fetchOrder(order.referenceId, order.symbol);
            }
            else {
                const orders = await exchange.fetchOrders(order.symbol);
                orderData = orders.find((o) => o.id === order.referenceId);
            }
            if (!orderData || !orderData.id)
                throw (0, error_1.createError)(404, "Order not found");
            // Update the order in your database with the latest status
            await (0, utils_1.updateOrderData)(id, {
                status: orderData.status.toUpperCase(),
                filled: orderData.filled,
                remaining: orderData.remaining,
                cost: orderData.cost,
                fee: orderData.fee,
                trades: JSON.stringify(orderData.trades),
            });
            if (orderData.status !== "open")
                throw (0, error_1.createError)(400, "Order is not open");
            const [currency, pair] = order.symbol.split("/");
            const currencyWallet = await (0, utils_2.getWallet)(user.id, "SPOT", currency);
            const pairWallet = await (0, utils_2.getWallet)(user.id, "SPOT", pair);
            if (!currencyWallet || !pairWallet)
                throw (0, error_1.createError)(500, "Failed to fetch wallets");
            // Refund the amount initially deducted
            await exchange.cancelOrder(order.referenceId, order.symbol);
            await db_1.sequelize.transaction(async (transaction) => {
                if (order.side.toUpperCase() === "BUY") {
                    // Refund cost to pairWallet (e.g., USDT)
                    const cost = Number(order.amount) * Number(order.price);
                    await db_1.models.wallet.update({ balance: pairWallet.balance + cost }, { where: { id: pairWallet.id }, transaction });
                }
                else {
                    // Refund amount to currencyWallet (e.g., BTC)
                    await db_1.models.wallet.update({ balance: currencyWallet.balance + Number(order.amount) }, { where: { id: currencyWallet.id }, transaction });
                }
                // delete the order
                await db_1.models.exchangeOrder.destroy({
                    where: { id },
                    force: true,
                    transaction,
                });
            });
            (0, index_ws_1.removeOrderFromTrackedOrders)(user.id, id);
            return {
                message: "Order cancelled successfully",
            };
        }
        catch (error) {
            console.error("Error:", error);
            throw new Error(error.message);
        }
    }
    catch (error) {
        console.error("Error:", error);
        if (error.statusCode === 503) {
            throw error;
        }
        else {
            throw (0, error_1.createError)(500, "Unable to process your request at this time");
        }
    }
};
