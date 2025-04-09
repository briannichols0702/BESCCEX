"use strict";
// /api/admin/ecommerce/categories/store.post.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("./utils");
exports.metadata = {
    summary: "Stores a new E-commerce Category",
    operationId: "storeEcommerceCategory",
    tags: ["Admin", "Ecommerce Categories"],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: utils_1.ecommerceCategoryUpdateSchema,
            },
        },
    },
    responses: (0, query_1.storeRecordResponses)(utils_1.ecommerceCategoryStoreSchema, "E-commerce Category"),
    requiresAuth: true,
    permission: "Access Ecommerce Category Management",
};
exports.default = async (data) => {
    const { body } = data;
    const { name, description, image, status } = body;
    return await (0, query_1.storeRecord)({
        model: "ecommerceCategory",
        data: {
            name,
            description,
            image,
            status,
        },
    });
};
