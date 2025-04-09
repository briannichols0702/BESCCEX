"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const error_1 = require("@b/utils/error");
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Assigns a shipment to an order",
    description: "Assigns a specific shipment to an order.",
    operationId: "assignShipmentToOrder",
    tags: ["Admin", "Ecommerce Orders"],
    requiresAuth: true,
    parameters: [
        {
            index: 0,
            in: "path",
            name: "id",
            required: true,
            description: "Order ID",
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
                        shipmentId: { type: "string", description: "Shipment ID" },
                    },
                    required: ["shipmentId"],
                },
            },
        },
    },
    responses: (0, query_1.createRecordResponses)("Shipment Assignment"),
    permission: "Access Ecommerce Order Management",
};
exports.default = async (data) => {
    const { body, params } = data;
    const { id } = params;
    const { shipmentId } = body;
    const transaction = await db_1.sequelize.transaction();
    try {
        const order = await db_1.models.ecommerceOrder.findByPk(id);
        if (!order) {
            throw (0, error_1.createError)({ statusCode: 404, message: "Order not found" });
        }
        const shipment = await db_1.models.ecommerceShipping.findByPk(shipmentId);
        if (!shipment) {
            throw (0, error_1.createError)({ statusCode: 404, message: "Shipment not found" });
        }
        await order.update({ shippingId: shipmentId }, { transaction });
        await transaction.commit();
        return { message: "Shipment assigned to order successfully" };
    }
    catch (error) {
        await transaction.rollback();
        throw (0, error_1.createError)({ statusCode: 500, message: error.message });
    }
};
