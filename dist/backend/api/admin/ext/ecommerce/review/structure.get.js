"use strict";
// /api/admin/ecommerceReviews/structure.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.ecommerceReviewStructure = exports.metadata = void 0;
const constants_1 = require("@b/utils/constants");
const db_1 = require("@b/db");
exports.metadata = {
    summary: "Get form structure for E-commerce Reviews",
    operationId: "getEcommerceReviewStructure",
    tags: ["Admin", "Ecommerce Reviews"],
    responses: {
        200: {
            description: "Form structure for managing E-commerce Reviews",
            content: constants_1.structureSchema,
        },
    },
    permission: "Access Ecommerce Review Management",
};
const ecommerceReviewStructure = async () => {
    const products = await db_1.models.ecommerceProduct.findAll();
    const productId = {
        type: "select",
        label: "Product",
        name: "productId",
        options: products.map((product) => ({
            value: product.id,
            label: product.name,
        })),
        placeholder: "Select the product related to the review",
    };
    const userId = {
        type: "input",
        label: "User",
        name: "userId",
        placeholder: "Enter the user ID",
        icon: "lets-icons:user-duotone",
    };
    const rating = {
        type: "input",
        label: "Rating",
        name: "rating",
        placeholder: "Rate the product (1 to 5)",
        min: 1,
        max: 5,
        step: 1,
        ts: "number",
    };
    const comment = {
        type: "textarea",
        label: "Comment",
        name: "comment",
        placeholder: "Enter any additional comments",
    };
    const status = {
        type: "select",
        label: "Status",
        name: "status",
        options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
        ],
        ts: "boolean",
    };
    return {
        productId,
        userId,
        rating,
        comment,
        status,
    };
};
exports.ecommerceReviewStructure = ecommerceReviewStructure;
exports.default = async () => {
    const { productId, userId, rating, comment, status } = await (0, exports.ecommerceReviewStructure)();
    return {
        set: [[userId, productId], [rating, status], comment],
    };
};
