"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const error_1 = require("@b/utils/error");
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Adds download details to an order item",
    description: "Adds or updates the download details for a specific order item.",
    operationId: "addDownloadDetails",
    tags: ["Admin", "Ecommerce Orders"],
    requiresAuth: true,
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        orderItemId: { type: "string", description: "Order Item ID" },
                        key: { type: "string", description: "License Key", nullable: true },
                        filePath: {
                            type: "string",
                            description: "Download File Path",
                            nullable: true,
                        },
                    },
                    required: ["orderItemId"],
                },
            },
        },
    },
    responses: (0, query_1.createRecordResponses)("Order Item"),
    permission: "Access Ecommerce Order Management",
};
exports.default = async (data) => {
    const { body } = data;
    const { orderItemId, key, filePath } = body;
    const transaction = await db_1.sequelize.transaction();
    try {
        const orderItem = await db_1.models.ecommerceOrderItem.findByPk(orderItemId);
        if (!orderItem) {
            throw (0, error_1.createError)({ statusCode: 404, message: "Order item not found" });
        }
        await orderItem.update({ key, filePath }, { transaction });
        await transaction.commit();
        return { message: "Download details added/updated successfully" };
    }
    catch (error) {
        await transaction.rollback();
        throw (0, error_1.createError)({ statusCode: 500, message: error.message });
    }
};
