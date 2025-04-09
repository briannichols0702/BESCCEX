"use strict";
// /server/api/ecommerce/Shipping/[id].put.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
exports.metadata = {
    summary: "Updates a specific ecommerce shipping",
    operationId: "updateEcommerceShipping",
    tags: ["Admin", "Ecommerce", "Shipping"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            description: "ID of the ecommerce shipping to update",
            required: true,
            schema: {
                type: "string",
            },
        },
    ],
    requestBody: {
        description: "New data for the ecommerce shipping",
        content: {
            "application/json": {
                schema: utils_1.ecommerceShippingUpdateSchema,
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("Ecommerce Shipping"),
    requiresAuth: true,
    permission: "Access Ecommerce Shipping Management",
};
exports.default = async (data) => {
    const { body, params } = data;
    const { id } = params;
    return await (0, query_1.updateRecord)("ecommerceShipping", id, {
        ...body,
    });
};
