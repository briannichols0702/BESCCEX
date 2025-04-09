"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const affiliate_1 = require("@b/utils/affiliate");
const emails_1 = require("@b/utils/emails");
const error_1 = require("@b/utils/error");
const notifications_1 = require("@b/utils/notifications");
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Creates a new order",
    description: "Processes a new order for the logged-in user, checking inventory, wallet balance, and applying any available discounts.",
    operationId: "createEcommerceOrder",
    tags: ["Ecommerce", "Orders"],
    requiresAuth: true,
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        productId: { type: "string", description: "Product ID to order" },
                        discountId: {
                            type: "string",
                            description: "Discount ID applied to the order",
                            nullable: true,
                        },
                        amount: {
                            type: "number",
                            description: "Quantity of the product to purchase",
                        },
                        shippingAddress: {
                            type: "object",
                            properties: {
                                name: { type: "string" },
                                email: { type: "string" },
                                phone: { type: "string" },
                                street: { type: "string" },
                                city: { type: "string" },
                                state: { type: "string" },
                                postalCode: { type: "string" },
                                country: { type: "string" },
                            },
                            required: [
                                "name",
                                "email",
                                "phone",
                                "street",
                                "city",
                                "state",
                                "postalCode",
                                "country",
                            ],
                        },
                    },
                    required: ["productId", "amount"],
                },
            },
        },
    },
    responses: (0, query_1.createRecordResponses)("Order"),
};
exports.default = async (data) => {
    const { user, body } = data;
    if (!(user === null || user === void 0 ? void 0 : user.id)) {
        throw (0, error_1.createError)({ statusCode: 401, message: "Unauthorized" });
    }
    const { productId, discountId, amount, shippingAddress } = body;
    const transaction = await db_1.sequelize.transaction();
    const userPk = await db_1.models.user.findByPk(user.id);
    if (!userPk) {
        throw new Error("User not found");
    }
    const product = await db_1.models.ecommerceProduct.findByPk(productId);
    if (!product) {
        throw new Error("Product not found");
    }
    // Calculate total cost with discount if applicable
    let cost = product.price * amount;
    let userDiscount = null;
    if (discountId && discountId !== "null") {
        userDiscount = await db_1.models.ecommerceUserDiscount.findOne({
            where: {
                userId: user.id,
                discountId: discountId,
            },
            include: [
                {
                    model: db_1.models.ecommerceDiscount,
                    as: "discount",
                },
            ],
        });
        if (!userDiscount) {
            throw new Error("Discount not found");
        }
        cost -= cost * (userDiscount.discount.percentage / 100);
    }
    // Check user wallet balance
    const wallet = await db_1.models.wallet.findOne({
        where: {
            userId: user.id,
            type: product.walletType,
            currency: product.currency,
        },
    });
    if (!wallet || wallet.balance < cost) {
        throw new Error("Insufficient balance");
    }
    const newBalance = wallet.balance - cost;
    // Create order and order items
    const order = await db_1.models.ecommerceOrder.create({
        userId: user.id,
        status: "PENDING",
    }, { transaction });
    await db_1.models.ecommerceOrderItem.create({
        orderId: order.id,
        productId: productId,
        quantity: amount,
    }, { transaction });
    // Update product inventory and user wallet balance
    await product.update({ inventoryQuantity: db_1.sequelize.literal(`inventoryQuantity - ${amount}`) }, { transaction });
    await wallet.update({ balance: newBalance }, { transaction });
    // Create a transaction record
    await db_1.models.transaction.create({
        userId: user.id,
        walletId: wallet.id,
        type: "PAYMENT",
        status: "COMPLETED",
        amount: cost,
        description: `Purchase of ${product.name} x${amount} for ${cost} ${product.currency}`,
        referenceId: order.id,
    }, { transaction });
    // Update discount status if applicable
    if (userDiscount) {
        await userDiscount.update({ status: true }, { transaction });
    }
    // Create shipping address if product is physical
    if (product.type !== "DOWNLOADABLE" && shippingAddress) {
        await db_1.models.ecommerceShippingAddress.create({
            userId: user.id,
            orderId: order.id,
            ...shippingAddress,
        }, { transaction });
    }
    await transaction.commit();
    // Send order confirmation email
    try {
        await (0, emails_1.sendOrderConfirmationEmail)(userPk, order, product);
        await (0, notifications_1.handleNotification)({
            userId: user.id,
            title: "Order Confirmation",
            message: `Your order for ${product.name} x${amount} has been confirmed`,
            type: "ACTIVITY",
        });
    }
    catch (error) {
        console.error("Error sending order confirmation email:", error);
    }
    // Process rewards if applicable
    if (product.type === "DOWNLOADABLE") {
        try {
            await (0, affiliate_1.processRewards)(user.id, cost, "ECOMMERCE_PURCHASE", wallet.currency);
        }
        catch (error) {
            console.error(`Error processing rewards: ${error.message}`);
        }
    }
    return {
        id: order.id,
        message: "Order created successfully",
    };
};
