"use strict";
// /server/api/ecommerce/orders/delete.del.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Bulk deletes e-commerce orders by IDs",
    operationId: "bulkDeleteEcommerceOrders",
    tags: ["Admin", "Ecommerce", "Orders"],
    parameters: (0, query_1.commonBulkDeleteParams)("E-commerce Orders"),
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        ids: {
                            type: "array",
                            items: { type: "string" },
                            description: "Array of e-commerce order IDs to delete",
                        },
                    },
                    required: ["ids"],
                },
            },
        },
    },
    responses: (0, query_1.commonBulkDeleteResponses)("E-commerce Orders"),
    requiresAuth: true,
    permission: "Access Ecommerce Order Management",
};
exports.default = async (data) => {
    const { body, query } = data;
    const { ids } = body;
    return (0, query_1.handleBulkDelete)({
        model: "ecommerceOrder",
        ids,
        query,
    });
};
