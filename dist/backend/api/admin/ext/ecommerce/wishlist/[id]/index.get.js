"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
const db_1 = require("@b/db");
exports.metadata = {
    summary: "Retrieves detailed information of a specific ecommerce wishlist item by ID",
    operationId: "getEcommerceWishlistById",
    tags: ["Admin", "Ecommerce Wishlist"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            required: true,
            description: "ID of the ecommerce wishlist item to retrieve",
            schema: { type: "string" },
        },
    ],
    responses: {
        200: {
            description: "Ecommerce wishlist item details",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: utils_1.baseEcommerceWishlistSchema, // Define this schema in your utils if it's not already defined
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("Ecommerce Wishlist"),
        500: query_1.serverErrorResponse,
    },
    permission: "Access Ecommerce Wishlist Management",
    requiresAuth: true,
};
exports.default = async (data) => {
    const { params } = data;
    return await (0, query_1.getRecord)("ecommerceWishlist", params.id, [
        {
            model: db_1.models.ecommerceProduct,
            as: "products",
            through: {
                model: db_1.models.ecommerceWishlistItem,
                attributes: [],
            },
            attributes: ["name", "price", "status"],
        },
        {
            model: db_1.models.user,
            as: "user",
            attributes: ["firstName", "lastName", "email", "avatar"],
        },
    ]);
};
