"use strict";
// /api/admin/ecommerceWishlists/structure.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.ecommerceWishlistStructure = exports.metadata = void 0;
const constants_1 = require("@b/utils/constants");
const db_1 = require("@b/db");
exports.metadata = {
    summary: "Get form structure for E-commerce Wishlists",
    operationId: "getEcommerceWishlistStructure",
    tags: ["Admin", "Ecommerce Wishlists"],
    responses: {
        200: {
            description: "Form structure for managing E-commerce Wishlists",
            content: constants_1.structureSchema,
        },
    },
    permission: "Access Ecommerce Wishlist Management",
};
const ecommerceWishlistStructure = async () => {
    const users = await db_1.models.user.findAll();
    const products = await db_1.models.ecommerceProduct.findAll();
    const userId = {
        type: "input",
        label: "User",
        name: "userId",
        placeholder: "Enter the user ID",
        icon: "lets-icons:user-duotone",
    };
    const productId = {
        type: "select",
        label: "Product",
        name: "productId",
        options: products.map((product) => ({
            value: product.id,
            label: product.name,
        })),
        placeholder: "Select the product",
    };
    return {
        userId,
        productId,
    };
};
exports.ecommerceWishlistStructure = ecommerceWishlistStructure;
exports.default = async () => {
    const { userId, productId } = await (0, exports.ecommerceWishlistStructure)();
    return {};
};
