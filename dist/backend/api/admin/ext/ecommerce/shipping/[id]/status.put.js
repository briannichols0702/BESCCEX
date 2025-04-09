"use strict";
// /server/api/ecommerce/Shipping/[id]/status.put.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Updates the status of an E-commerce Shipping",
    operationId: "updateEcommerceShippingtatus",
    tags: ["Admin", "Ecommerce Shipping"],
    parameters: [
        {
            index: 0, // Ensuring the parameter index is specified as requested
            name: "id",
            in: "path",
            required: true,
            description: "ID of the E-commerce shipping to update",
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
                            enum: ["PENDING", "TRANSIT", "DELIVERED", "CANCELLED"],
                            description: "New status to apply",
                        },
                    },
                    required: ["status"],
                },
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("E-commerce Shipping"),
    requiresAuth: true,
    permission: "Access Ecommerce Shipping Management",
};
exports.default = async (data) => {
    const { body, params } = data;
    const { id } = params;
    const { status } = body;
    const shipping = await db_1.models.ecommerceShipping.findByPk(id);
    if (!shipping) {
        throw new Error("Shipping record not found");
    }
    await (0, query_1.updateStatus)("ecommerceShipping", id, status, "loadStatus", "Shipping", async () => {
        try {
            // Add any additional operations to be performed after status update
        }
        catch (error) {
            console.error("Failed to perform post status update operations:", error);
        }
    });
};
