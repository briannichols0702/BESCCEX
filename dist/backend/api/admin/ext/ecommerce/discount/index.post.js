"use strict";
// /api/admin/ecommerce/discounts/store.post.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("./utils");
exports.metadata = {
    summary: "Stores a new E-commerce Discount",
    operationId: "storeEcommerceDiscount",
    tags: ["Admin", "Ecommerce Discounts"],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: utils_1.discountUpdateSchema,
            },
        },
    },
    responses: (0, query_1.storeRecordResponses)(utils_1.discountStoreSchema, "E-commerce Discount"),
    requiresAuth: true,
    permission: "Access Ecommerce Discount Management",
};
exports.default = async (data) => {
    const { body } = data;
    const { code, percentage, validUntil, productId, status } = body;
    return await (0, query_1.storeRecord)({
        model: "ecommerceDiscount",
        data: {
            code,
            percentage,
            validUntil,
            productId,
            status,
        },
    });
};
