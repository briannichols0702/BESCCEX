"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Updates the status of an exchange order",
    operationId: "updateExchangeOrderStatus",
    tags: ["Admin", "Exchange Order"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            required: true,
            description: "ID of the exchange order to update",
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
                            description: "New status to apply",
                            enum: ["OPEN", "CLOSED", "CANCELLED", "PARTIALLY_FILLED"], // Assuming these are valid statuses for exchange orders
                        },
                    },
                    required: ["status"],
                },
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("Exchange Order"),
    requiresAuth: true,
    permission: "Access Exchange Order Management",
};
exports.default = async (data) => {
    const { body, params } = data;
    const { id } = params;
    const { status } = body;
    return (0, query_1.updateStatus)("exchangeOrder", id, status);
};
