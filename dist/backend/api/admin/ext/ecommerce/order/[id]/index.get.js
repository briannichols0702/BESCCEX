"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
const db_1 = require("@b/db");
exports.metadata = {
    summary: "Retrieves detailed information of a specific ecommerce order by ID",
    operationId: "getEcommerceOrderById",
    tags: ["Admin", "Ecommerce Orders"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            required: true,
            description: "ID of the ecommerce order to retrieve",
            schema: { type: "string" },
        },
    ],
    responses: {
        200: {
            description: "Ecommerce order details",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: utils_1.baseEcommerceOrderSchema, // Define this schema in your utils if it's not already defined
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("Ecommerce Order"),
        500: query_1.serverErrorResponse,
    },
    permission: "Access Ecommerce Order Management",
    requiresAuth: true,
};
exports.default = async (data) => {
    const { params } = data;
    const order = await (0, query_1.getRecord)("ecommerceOrder", params.id, [
        {
            model: db_1.models.ecommerceProduct,
            as: "products",
            through: {
                attributes: ["quantity", "key", "filePath", "id"],
            },
            attributes: [
                "name",
                "price",
                "status",
                "type",
                "image",
                "currency",
                "walletType",
            ],
            includeModels: [
                {
                    model: db_1.models.ecommerceCategory,
                    as: "category",
                    attributes: ["name"],
                },
            ],
        },
        {
            model: db_1.models.user,
            as: "user",
            attributes: ["id", "firstName", "lastName", "email", "avatar"],
        },
        {
            model: db_1.models.ecommerceShippingAddress,
            as: "shippingAddress",
        },
        {
            model: db_1.models.ecommerceShipping,
            as: "shipping",
        },
    ]);
    // shpments not "DELIVERED" | "CANCELLED"
    const shipments = await db_1.models.ecommerceShipping.findAll({
        where: {
            loadStatus: "PENDING",
        },
    });
    return {
        order,
        shipments: shipments.map((shipment) => shipment.get({ plain: true })),
    };
};
