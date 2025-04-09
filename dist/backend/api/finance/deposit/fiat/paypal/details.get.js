"use strict";
// /server/api/deposit/paypal/details.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const utils_1 = require("./utils");
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Fetches PayPal order details",
    description: "Retrieves details for a specific PayPal order by its ID.",
    operationId: "getPayPalOrderDetails",
    tags: ["Finance", "Deposit"],
    parameters: [
        {
            name: "orderId",
            in: "query",
            description: "PayPal order ID",
            required: true,
            schema: { type: "string" },
        },
    ],
    responses: {
        200: {
            description: "PayPal order details fetched successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            id: { type: "string", description: "Order ID" },
                            status: { type: "string", description: "Order status" },
                            purchase_units: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        amount: {
                                            type: "object",
                                            properties: {
                                                currency_code: { type: "string" },
                                                value: { type: "string" },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("Paypal"),
        500: query_1.serverErrorResponse,
    },
    requiresAuth: true,
};
exports.default = async (data) => {
    const { user, query } = data;
    if (!user)
        throw new Error("User not authenticated");
    const { orderId } = query;
    if (!orderId)
        throw new Error("Order ID is required");
    const client = (0, utils_1.paypalClient)();
    const request = new utils_1.paypalOrders.OrdersGetRequest(orderId);
    try {
        const order = await client.execute(request);
        return order.result; // Adjust based on the structure of the order details you want to return
    }
    catch (error) {
        throw new Error(`Error getting PayPal order details: ${error.message}`);
    }
};
