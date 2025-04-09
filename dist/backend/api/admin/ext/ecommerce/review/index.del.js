"use strict";
// /server/api/ecommerce/reviews/delete.del.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Bulk deletes e-commerce reviews by IDs",
    operationId: "bulkDeleteEcommerceReviews",
    tags: ["Admin", "Ecommerce", "Reviews"],
    parameters: (0, query_1.commonBulkDeleteParams)("E-commerce Reviews"),
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
                            description: "Array of e-commerce review IDs to delete",
                        },
                    },
                    required: ["ids"],
                },
            },
        },
    },
    responses: (0, query_1.commonBulkDeleteResponses)("E-commerce Reviews"),
    requiresAuth: true,
    permission: "Access Ecommerce Review Management",
};
exports.default = async (data) => {
    const { body, query } = data;
    const { ids } = body;
    return (0, query_1.handleBulkDelete)({
        model: "ecommerceReview",
        ids,
        query,
    });
};
