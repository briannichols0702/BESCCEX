"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Deletes a specific e-commerce wishlist entry",
    operationId: "deleteEcommerceWishlist",
    tags: ["Admin", "Ecommerce", "Wishlists"],
    parameters: (0, query_1.deleteRecordParams)("E-commerce wishlist entry"),
    responses: (0, query_1.deleteRecordResponses)("E-commerce wishlist entry"),
    permission: "Access Ecommerce Wishlist Management",
    requiresAuth: true,
};
exports.default = async (data) => {
    const { params, query } = data;
    return (0, query_1.handleSingleDelete)({
        model: "ecommerceWishlist",
        id: params.id,
        query,
    });
};
