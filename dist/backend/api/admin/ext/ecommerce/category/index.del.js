"use strict";
// /server/api/ecommerce/categories/delete.del.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Bulk deletes e-commerce categories by IDs",
    operationId: "bulkDeleteEcommerceCategories",
    tags: ["Admin", "Ecommerce", "Categories"],
    parameters: (0, query_1.commonBulkDeleteParams)("E-commerce Categories"),
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
                            description: "Array of e-commerce category IDs to delete",
                        },
                    },
                    required: ["ids"],
                },
            },
        },
    },
    responses: (0, query_1.commonBulkDeleteResponses)("E-commerce Categories"),
    requiresAuth: true,
    permission: "Access Ecommerce Category Management",
};
exports.default = async (data) => {
    const { body, query } = data;
    const { ids } = body;
    return (0, query_1.handleBulkDelete)({
        model: "ecommerceCategory",
        ids,
        query,
    });
};
