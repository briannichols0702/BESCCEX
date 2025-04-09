"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseWishlistItemSchema = exports.baseProductReviewSchema = exports.baseProductSchema = exports.baseReviewSchema = exports.baseUserSchema = exports.baseOrderSchema = exports.baseOrderItemSchema = exports.baseDiscountSchema = void 0;
const schema_1 = require("@b/utils/schema");
exports.baseDiscountSchema = {
    id: (0, schema_1.baseStringSchema)("The unique identifier for the discount"),
    code: (0, schema_1.baseStringSchema)("The discount code applied"),
    status: (0, schema_1.baseStringSchema)("The current status of the discount (e.g., ACTIVE, INACTIVE)"),
};
exports.baseOrderItemSchema = {
    productId: (0, schema_1.baseStringSchema)("Product ID of the item"),
    quantity: (0, schema_1.baseNumberSchema)("Quantity of the product ordered"),
    product: {
        type: "object",
        description: "Details of the product ordered",
        properties: {
            name: (0, schema_1.baseStringSchema)("Name of the product"),
            price: (0, schema_1.baseNumberSchema)("Price of the product"),
            image: (0, schema_1.baseStringSchema)("Product image URL", 255, 0, true),
        },
        required: ["name", "price"],
    },
};
exports.baseOrderSchema = {
    id: (0, schema_1.baseStringSchema)("The unique identifier for the order"),
    status: (0, schema_1.baseStringSchema)("Status of the order"),
    orderItems: {
        type: "array",
        description: "List of items in the order",
        items: {
            type: "object",
            properties: exports.baseOrderItemSchema,
            required: ["productId", "quantity", "product"],
        },
    },
};
exports.baseUserSchema = {
    id: (0, schema_1.baseStringSchema)("User's UUID"),
    firstName: (0, schema_1.baseStringSchema)("User's first name"),
    lastName: (0, schema_1.baseStringSchema)("User's last name"),
    avatar: (0, schema_1.baseStringSchema)("User's avatar", 255, 0, true),
};
exports.baseReviewSchema = {
    id: (0, schema_1.baseStringSchema)("Review ID"),
    comment: (0, schema_1.baseStringSchema)("Review comment"),
    user: {
        type: "object",
        description: "User who made the review",
        properties: exports.baseUserSchema,
        required: ["id", "firstName", "lastName"],
    },
};
exports.baseProductSchema = {
    id: (0, schema_1.baseStringSchema)("The unique identifier for the product"),
    name: (0, schema_1.baseStringSchema)("Name of the product"),
    description: (0, schema_1.baseStringSchema)("Description of the product"),
    type: (0, schema_1.baseStringSchema)("Type of the product"),
    price: (0, schema_1.baseNumberSchema)("Price of the product"),
    categoryId: (0, schema_1.baseStringSchema)("Category ID of the product"),
    inventoryQuantity: (0, schema_1.baseNumberSchema)("Inventory quantity available"),
    image: (0, schema_1.baseStringSchema)("URL of the product image", 255, 0, true),
    currency: (0, schema_1.baseStringSchema)("Currency of the price"),
    walletType: (0, schema_1.baseStringSchema)("Wallet type for the transaction"),
    createdAt: (0, schema_1.baseStringSchema)("Timestamp when the product was created", undefined, undefined, false, "date-time"),
    category: {
        type: "object",
        description: "Category details",
        properties: {
            id: (0, schema_1.baseStringSchema)("Category ID"),
            name: (0, schema_1.baseStringSchema)("Category name"),
        },
        required: ["id", "name"],
    },
    reviews: {
        type: "array",
        description: "List of reviews for the product",
        items: {
            type: "object",
            properties: exports.baseReviewSchema,
            required: ["id", "comment", "user"],
        },
    },
};
exports.baseProductReviewSchema = {
    uuid: (0, schema_1.baseStringSchema)("User's UUID"),
    firstName: (0, schema_1.baseStringSchema)("User's first name"),
    lastName: (0, schema_1.baseStringSchema)("User's last name"),
    avatar: (0, schema_1.baseStringSchema)("User's avatar", 255, 0, true),
};
exports.baseWishlistItemSchema = {
    productId: (0, schema_1.baseStringSchema)("Product ID in the wishlist"),
    product: {
        type: "object",
        description: "Details of the product",
        properties: exports.baseProductSchema,
        required: ["name"],
    },
};
