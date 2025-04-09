"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const query_1 = require("@b/utils/query");
const utils_1 = require("./utils");
exports.metadata = {
    summary: "Bulk updates the status of ecommerce orders",
    operationId: "bulkUpdateEcommerceOrderStatus",
    tags: ["Admin", "Ecommerce Orders"],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        ids: {
                            type: "array",
                            description: "Array of ecommerce order IDs to update",
                            items: { type: "string" },
                        },
                        status: {
                            type: "string",
                            enum: ["PENDING", "COMPLETED", "CANCELLED", "REJECTED"],
                            description: "New status to apply to the ecommerce orders",
                        },
                    },
                    required: ["ids", "status"],
                },
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("Ecommerce Order"),
    requiresAuth: true,
    permission: "Access Ecommerce Order Management",
};
exports.default = async (data) => {
    const { body } = data;
    const { ids, status } = body;
    const orders = await db_1.models.ecommerceOrder.findAll({
        where: { id: ids },
    });
    if (!orders.length) {
        throw new Error("Orders not found");
    }
    await db_1.sequelize.transaction(async (t) => {
        for (const order of orders) {
            if (order.status !== "PENDING") {
                throw new Error(`Order ${order.id} status is not PENDING`);
            }
            const transaction = await db_1.models.transaction.findOne({
                where: { referenceId: order.id },
            });
            if (!transaction) {
                throw new Error(`Transaction not found for order ${order.id}`);
            }
            const wallet = await db_1.models.wallet.findByPk(transaction.walletId);
            if (!wallet) {
                throw new Error(`Wallet not found for transaction ${transaction.id}`);
            }
            order.status = status;
            await order.save({ transaction: t });
            if (status === "CANCELLED" || status === "REJECTED") {
                wallet.balance += transaction.amount;
                await wallet.save({ transaction: t });
            }
        }
        await Promise.all(orders.map(async (order) => {
            const user = await db_1.models.user.findByPk(order.userId);
            await (0, utils_1.sendOrderStatusUpdateEmail)(user, order, status);
        }));
    });
};
