"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOrderStatusUpdateEmail = exports.ecommerceOrderUpdateSchema = exports.baseEcommerceOrderSchema = exports.ecommerceOrderSchema = void 0;
const db_1 = require("@b/db");
const emails_1 = require("@b/utils/emails");
const schema_1 = require("@b/utils/schema");
const id = (0, schema_1.baseStringSchema)("ID of the e-commerce order");
const userId = (0, schema_1.baseStringSchema)("User ID associated with the order");
const status = (0, schema_1.baseEnumSchema)("Status of the order", [
    "PENDING",
    "COMPLETED",
    "CANCELLED",
    "REJECTED",
]);
const createdAt = (0, schema_1.baseDateTimeSchema)("Creation date of the order", true);
const updatedAt = (0, schema_1.baseDateTimeSchema)("Last update date of the order", true);
const deletedAt = (0, schema_1.baseDateTimeSchema)("Deletion date of the order", true);
exports.ecommerceOrderSchema = {
    id,
    userId,
    status,
    createdAt,
    updatedAt,
    deletedAt,
};
exports.baseEcommerceOrderSchema = {
    id,
    userId,
    status,
    createdAt,
    deletedAt,
    updatedAt,
};
exports.ecommerceOrderUpdateSchema = {
    type: "object",
    properties: {
        status,
    },
    required: ["status"],
};
async function sendOrderStatusUpdateEmail(user, order, status) {
    // Retrieve all products in the order
    const orderItems = await db_1.models.ecommerceOrderItem.findAll({
        where: { orderId: order.id },
        include: [
            {
                model: db_1.models.ecommerceProduct,
                as: "product",
                attributes: ["name", "price", "currency"],
            },
        ],
    });
    // Construct the product details string
    const productDetails = orderItems
        .map((item) => `
    <li>Product Name: ${item.product.name}</li>
    <li>Quantity: ${item.quantity}</li>
    <li>Price: ${item.product.price} ${item.product.currency}</li>
  `)
        .join("");
    const emailData = {
        TO: user.email,
        CUSTOMER_NAME: user.firstName,
        ORDER_NUMBER: order.id,
        ORDER_STATUS: status,
        PRODUCT_DETAILS: productDetails, // Replacing product-specific placeholders with this
    };
    await emails_1.emailQueue.add({ emailData, emailType: "OrderStatusUpdate" });
}
exports.sendOrderStatusUpdateEmail = sendOrderStatusUpdateEmail;
