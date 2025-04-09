"use strict";
// /server/api/ecommerce/products/delete.del.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Bulk deletes e-commerce products by IDs",
    operationId: "bulkDeleteEcommerceProducts",
    tags: ["Admin", "Ecommerce", "Products"],
    parameters: (0, query_1.commonBulkDeleteParams)("E-commerce Products"),
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
                            description: "Array of e-commerce product IDs to delete",
                        },
                    },
                    required: ["ids"],
                },
            },
        },
    },
    responses: (0, query_1.commonBulkDeleteResponses)("E-commerce Products"),
    requiresAuth: true,
    permission: "Access Ecommerce Product Management",
};
exports.default = async (data) => {
    const { body, query } = data;
    const { ids } = body;
    return (0, query_1.handleBulkDelete)({
        model: "ecommerceProduct",
        ids,
        query,
    });
};
