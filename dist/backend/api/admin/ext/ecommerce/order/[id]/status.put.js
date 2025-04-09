"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
exports.metadata = {
    summary: "Updates the status of an E-commerce Order",
    operationId: "updateEcommerceOrderStatus",
    tags: ["Admin", "Ecommerce Orders"],
    parameters: [
        {
            index: 0, // Ensuring the parameter index is specified as requested
            name: "id",
            in: "path",
            required: true,
            description: "ID of the E-commerce order to update",
            schema: { type: "string" },
        },
    ],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        status: {
                            type: "string",
                            enum: ["PENDING", "COMPLETED", "CANCELLED", "REJECTED"],
                            description: "New status to apply",
                        },
                    },
                    required: ["status"],
                },
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("E-commerce Order"),
    requiresAuth: true,
    permission: "Access Ecommerce Order Management",
};
exports.default = async (data) => {
    const { body, params } = data;
    const { id } = params;
    const { status } = body;
    const order = await db_1.models.ecommerceOrder.findByPk(id);
    if (!order) {
        throw new Error("Order not found");
    }
    if (order.status !== "PENDING") {
        throw new Error("Order status is not PENDING");
    }
    const transaction = await db_1.models.transaction.findOne({
        where: { referenceId: order.id },
    });
    if (!transaction) {
        throw new Error("Transaction not found");
    }
    const wallet = await db_1.models.wallet.findByPk(transaction.walletId);
    if (!wallet) {
        throw new Error("Wallet not found");
    }
    await db_1.sequelize.transaction(async (t) => {
        order.status = status;
        await order.save({ transaction: t });
        if (status === "CANCELLED" || status === "REJECTED") {
            wallet.balance += transaction.amount;
            wallet.save({ transaction: t });
        }
        return order;
    });
    try {
        const user = await db_1.models.user.findByPk(order.userId);
        await (0, utils_1.sendOrderStatusUpdateEmail)(user, order, status);
    }
    catch (error) {
        console.error("Failed to send order status update email:", error);
    }
};
