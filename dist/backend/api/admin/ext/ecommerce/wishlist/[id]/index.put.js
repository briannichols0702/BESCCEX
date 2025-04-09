"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
exports.metadata = {
    summary: "Updates a specific ecommerce wishlist entry",
    operationId: "updateEcommerceWishlist",
    tags: ["Admin", "Ecommerce", "Wishlist"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            description: "ID of the wishlist entry to update",
            required: true,
            schema: {
                type: "string",
            },
        },
    ],
    requestBody: {
        description: "New data for the wishlist entry",
        content: {
            "application/json": {
                schema: utils_1.wishlistUpdateSchema,
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("Ecommerce Wishlist"),
    requiresAuth: true,
    permission: "Access Ecommerce Wishlist Management",
};
exports.default = async (data) => {
    const { body, params } = data;
    const { id } = params;
    const { userId, productId } = body;
    return await (0, query_1.updateRecord)("ecommerceWishlist", id, {
        userId,
        productId,
    });
};
