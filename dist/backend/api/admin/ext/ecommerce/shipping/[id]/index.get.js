"use strict";
// /server/api/ecommerce/Shipping/[id].get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const db_1 = require("@b/db");
const utils_1 = require("../utils");
exports.metadata = {
    summary: "Retrieves detailed information of a specific ecommerce shipping by ID",
    operationId: "getEcommerceShippingById",
    tags: ["Admin", "Ecommerce Shipping"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            required: true,
            description: "ID of the ecommerce shipping to retrieve",
            schema: { type: "string" },
        },
    ],
    responses: {
        200: {
            description: "Ecommerce shipping details",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: utils_1.ecommerceShippingchema, // Define this schema in your utils if it's not already defined
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("Ecommerce Shipping"),
        500: query_1.serverErrorResponse,
    },
    permission: "Access Ecommerce Shipping Management",
    requiresAuth: true,
};
exports.default = async (data) => {
    const { params } = data;
    return await (0, query_1.getRecord)("ecommerceShipping", params.id, [
        {
            model: db_1.models.ecommerceOrder,
            as: "ecommerceOrders",
            includeModels: [
                {
                    model: db_1.models.ecommerceOrderItem,
                    as: "ecommerceOrderItems",
                    attributes: ["orderId", "productId", "quantity"],
                },
            ],
        },
    ]);
};
