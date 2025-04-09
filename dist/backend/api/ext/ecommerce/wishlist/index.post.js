"use strict";
// backend/api/ext/ecommerce/wishlist/index.post.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const error_1 = require("@b/utils/error");
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Adds a product to the user's wishlist",
    description: "Allows a user to add a product to their wishlist if it's not already included.",
    operationId: "addToEcommerceWishlist",
    tags: ["Ecommerce", "Wishlist"],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        productId: {
                            type: "string",
                            description: "Product ID to be added to the wishlist",
                        },
                    },
                    required: ["productId"],
                },
            },
        },
    },
    responses: (0, query_1.createRecordResponses)("Wishlist"),
    requiresAuth: true,
};
exports.default = async (data) => {
    const { user, body } = data;
    if (!(user === null || user === void 0 ? void 0 : user.id)) {
        throw (0, error_1.createError)({ statusCode: 401, message: "Unauthorized" });
    }
    const { productId } = body;
    // Find or create the user's wishlist
    const [wishlist] = await db_1.models.ecommerceWishlist.findOrCreate({
        where: { userId: user.id },
    });
    // Check if the product is already in the wishlist
    const existingWishlistItem = await db_1.models.ecommerceWishlistItem.findOne({
        where: { wishlistId: wishlist.id, productId },
    });
    if (existingWishlistItem) {
        throw (0, error_1.createError)({
            statusCode: 400,
            message: "Product already in wishlist",
        });
    }
    // Add the product to the wishlist
    await db_1.models.ecommerceWishlistItem.create({
        wishlistId: wishlist.id,
        productId,
    });
    return {
        message: "Product added to wishlist successfully",
    };
};
