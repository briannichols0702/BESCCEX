"use strict";
// backend/api/ext/ecommerce/wishlist/[id]/index.del.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const error_1 = require("@b/utils/error");
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Removes a product from the user's wishlist",
    description: "Allows a user to remove a product from their wishlist.",
    operationId: "removeFromEcommerceWishlist",
    tags: ["Ecommerce", "Wishlist"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            required: true,
            schema: {
                type: "string",
                description: "Product ID to be removed from the wishlist",
            },
        },
    ],
    responses: (0, query_1.deleteRecordResponses)("Wishlist"),
    requiresAuth: true,
};
exports.default = async (data) => {
    const { user, params } = data;
    if (!(user === null || user === void 0 ? void 0 : user.id)) {
        throw (0, error_1.createError)({ statusCode: 401, message: "Unauthorized" });
    }
    const { id } = params;
    // Find the user's wishlist
    const wishlist = await db_1.models.ecommerceWishlist.findOne({
        where: { userId: user.id },
    });
    if (!wishlist) {
        throw (0, error_1.createError)({
            statusCode: 404,
            message: "Wishlist not found",
        });
    }
    // Remove the product from the wishlist
    const result = await db_1.models.ecommerceWishlistItem.destroy({
        where: { wishlistId: wishlist.id, productId: id },
        force: true,
    });
    if (!result) {
        throw (0, error_1.createError)({
            statusCode: 404,
            message: "Product not found in wishlist",
        });
    }
    // Check if the wishlist is empty
    const remainingItems = await db_1.models.ecommerceWishlistItem.findAll({
        where: { wishlistId: wishlist.id },
    });
    if (remainingItems.length === 0) {
        // Remove the empty wishlist
        await db_1.models.ecommerceWishlist.destroy({
            where: { id: wishlist.id },
            force: true,
        });
    }
    return { message: "Product removed from wishlist successfully" };
};
