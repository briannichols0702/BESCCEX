"use strict";
// /api/admin/ecommerce/products/store.post.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("./utils");
const db_1 = require("@b/db");
exports.metadata = {
    summary: "Stores a new E-commerce Product",
    operationId: "storeEcommerceProduct",
    tags: ["Admin", "Ecommerce Products"],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: utils_1.ecommerceProductUpdateSchema,
            },
        },
    },
    responses: (0, query_1.storeRecordResponses)(utils_1.ecommerceProductStoreSchema, "E-commerce Product"),
    requiresAuth: true,
    permission: "Access Ecommerce Product Management",
};
exports.default = async (data) => {
    const { body } = data;
    const { name, description, shortDescription, type, price, categoryId, inventoryQuantity, filePath, status, image, currency, walletType, } = body;
    const existingProduct = await db_1.models.ecommerceProduct.findOne({
        where: { name },
    });
    if (existingProduct) {
        throw new Error("Product with this name already exists");
    }
    return await (0, query_1.storeRecord)({
        model: "ecommerceProduct",
        data: {
            name,
            description,
            shortDescription,
            type,
            price,
            categoryId,
            inventoryQuantity,
            filePath,
            status,
            image,
            currency,
            walletType,
        },
    });
};
