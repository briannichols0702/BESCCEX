"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
exports.metadata = {
    summary: "Updates a specific ecommerce discount",
    operationId: "updateEcommerceDiscount",
    tags: ["Admin", "Ecommerce", "Discounts"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            description: "ID of the ecommerce discount to update",
            required: true,
            schema: {
                type: "string",
            },
        },
    ],
    requestBody: {
        description: "New data for the ecommerce discount",
        content: {
            "application/json": {
                schema: utils_1.discountUpdateSchema,
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("Ecommerce Discount"),
    requiresAuth: true,
    permission: "Access Ecommerce Discount Management",
};
exports.default = async (data) => {
    const { body, params } = data;
    const { id } = params;
    const { code, percentage, validUntil, productId, status } = body;
    return await (0, query_1.updateRecord)("ecommerceDiscount", id, {
        code,
        percentage,
        validUntil,
        productId,
        status,
    });
};
