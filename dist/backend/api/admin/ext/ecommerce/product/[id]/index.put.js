"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
exports.metadata = {
    summary: "Updates a specific ecommerce product",
    operationId: "updateEcommerceProduct",
    tags: ["Admin", "Ecommerce", "Products"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            description: "ID of the ecommerce product to update",
            required: true,
            schema: {
                type: "string",
            },
        },
    ],
    requestBody: {
        description: "New data for the ecommerce product",
        content: {
            "application/json": {
                schema: utils_1.ecommerceProductUpdateSchema,
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("Ecommerce Product"),
    requiresAuth: true,
    permission: "Access Ecommerce Product Management",
};
exports.default = async (data) => {
    const { body, params } = data;
    const { id } = params;
    const { name, description, shortDescription, type, price, status, image, currency, walletType, inventoryQuantity, } = body;
    return await (0, query_1.updateRecord)("ecommerceProduct", id, {
        name,
        description,
        shortDescription,
        type,
        price,
        status,
        image,
        currency,
        walletType,
        inventoryQuantity,
    });
};
