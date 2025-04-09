"use strict";
// /server/api/ecommerce/wishlists/delete.del.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Bulk deletes e-commerce wishlist entries by IDs",
    operationId: "bulkDeleteEcommerceWishlists",
    tags: ["Admin", "Ecommerce", "Wishlists"],
    parameters: (0, query_1.commonBulkDeleteParams)("E-commerce Wishlist Entries"),
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
                            description: "Array of e-commerce wishlist entry IDs to delete",
                        },
                    },
                    required: ["ids"],
                },
            },
        },
    },
    responses: (0, query_1.commonBulkDeleteResponses)("E-commerce Wishlist Entries"),
    requiresAuth: true,
    permission: "Access Ecommerce Wishlist Management",
};
exports.default = async (data) => {
    const { body, query } = data;
    const { ids } = body;
    return (0, query_1.handleBulkDelete)({
        model: "ecommerceWishlist",
        ids,
        query,
    });
};
