"use strict";
// /api/admin/ecommerceDiscounts/structure.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.ecommerceDiscountStructure = exports.metadata = void 0;
const constants_1 = require("@b/utils/constants");
const db_1 = require("@b/db");
exports.metadata = {
    summary: "Get form structure for E-commerce Discounts",
    operationId: "getEcommerceDiscountStructure",
    tags: ["Admin", "Ecommerce Discounts"],
    responses: {
        200: {
            description: "Form structure for managing E-commerce Discounts",
            content: constants_1.structureSchema,
        },
    },
    permission: "Access Ecommerce Discount Management",
};
const ecommerceDiscountStructure = async () => {
    const products = await db_1.models.ecommerceProduct.findAll();
    const code = {
        type: "input",
        label: "Discount Code",
        name: "code",
        placeholder: "Enter the discount code",
    };
    const percentage = {
        type: "input",
        label: "Discount Percentage",
        name: "percentage",
        placeholder: "Enter discount percentage (0-100)",
        ts: "number",
    };
    const validUntil = {
        type: "datetime",
        label: "Valid Until",
        name: "validUntil",
        placeholder: "Select expiration date and time",
    };
    const productId = {
        type: "select",
        label: "Associated Product",
        name: "productId",
        options: products.map((product) => ({
            value: product.id,
            label: product.name,
        })),
        placeholder: "Select the product this discount applies to",
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
        code,
        percentage,
        validUntil,
        productId,
        status,
    };
};
exports.ecommerceDiscountStructure = ecommerceDiscountStructure;
exports.default = async () => {
    const { code, percentage, validUntil, productId, status } = await (0, exports.ecommerceDiscountStructure)();
    return {
        get: [productId, code, percentage, validUntil, status],
        set: [productId, [code, percentage], [validUntil, status]],
    };
};
