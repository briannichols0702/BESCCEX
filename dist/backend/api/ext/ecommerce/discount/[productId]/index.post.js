"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const error_1 = require("@b/utils/error");
const sequelize_1 = require("sequelize");
const query_1 = require("@b/utils/query");
const utils_1 = require("../../utils");
exports.metadata = {
    summary: "Applies a discount code to a product",
    description: "Allows a user to apply a discount code to a product if the discount is active and has not expired.",
    operationId: "applyEcommerceDiscount",
    tags: ["Ecommerce", "Discounts"],
    requiresAuth: true,
    parameters: [
        {
            index: 0,
            name: "productId",
            in: "path",
            required: true,
            schema: {
                type: "string",
                description: "Product ID to which the discount is applied",
            },
        },
    ],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        code: { type: "string", description: "Discount code" },
                    },
                    required: ["code"],
                },
            },
        },
    },
    responses: {
        200: {
            description: "Discount applied successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: utils_1.baseDiscountSchema,
                        required: ["id", "code", "status"],
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("Ecommerce Discount"),
        500: query_1.serverErrorResponse,
    },
};
exports.default = async (data) => {
    const { user, params, body } = data;
    if (!(user === null || user === void 0 ? void 0 : user.id)) {
        throw (0, error_1.createError)({ statusCode: 401, message: "Unauthorized" });
    }
    const { productId } = params;
    const { code } = body;
    const discount = await db_1.models.ecommerceDiscount.findOne({
        where: {
            productId: productId,
            code,
            status: true,
            validUntil: {
                [sequelize_1.Op.gte]: new Date(),
            },
        },
    });
    if (!discount) {
        throw (0, error_1.createError)({
            statusCode: 404,
            message: "Discount not found or has expired",
        });
    }
    // Check if user already has this discount applied
    const existingDiscount = await db_1.models.ecommerceUserDiscount.findOne({
        where: {
            userId: user.id,
            discountId: discount.id,
        },
    });
    if (existingDiscount && existingDiscount.status) {
        throw (0, error_1.createError)({
            statusCode: 400,
            message: "Discount already applied and is no longer active",
        });
    }
    if (!existingDiscount) {
        await db_1.models.ecommerceUserDiscount.create({
            userId: user.id,
            discountId: discount.id,
            status: false,
        });
    }
    return {
        id: discount.id,
        code: discount.code,
        status: discount.status,
        percentage: discount.percentage,
    };
};
