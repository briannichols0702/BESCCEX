"use strict";
// /server/api/ecommerce/Shipping/status.put.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Bulk updates the status of ecommerce Shipping",
    operationId: "bulkUpdateEcommerceShippingtatus",
    tags: ["Admin", "Ecommerce Shipping"],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        ids: {
                            type: "array",
                            description: "Array of ecommerce shipping IDs to update",
                            items: { type: "string" },
                        },
                        status: {
                            type: "string",
                            enum: ["PENDING", "TRANSIT", "DELIVERED", "CANCELLED"],
                            description: "New status to apply to the ecommerce Shipping",
                        },
                    },
                    required: ["ids", "status"],
                },
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("Ecommerce Shipping"),
    requiresAuth: true,
    permission: "Access Ecommerce Shipping Management",
};
exports.default = async (data) => {
    const { body } = data;
    const { ids, status } = body;
    const Shipping = await db_1.models.ecommerceShipping.findAll({
        where: { id: ids },
    });
    if (!Shipping.length) {
        throw new Error("Shipping not found");
    }
    return (0, query_1.updateStatus)("ecommerceShipping", ids, status, "loadStatus", "Shipping", async () => {
        try {
            // Add any additional operations to be performed after status update
        }
        catch (error) {
            console.error("Failed to perform post status update operations:", error);
        }
    });
};
