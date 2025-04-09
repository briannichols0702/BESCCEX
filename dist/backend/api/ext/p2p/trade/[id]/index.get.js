"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
const db_1 = require("@b/db");
exports.metadata = {
    summary: "Retrieves detailed information of a specific P2P Trade by ID",
    operationId: "getP2pTradeById",
    tags: ["P2P", "Trade"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            required: true,
            description: "ID of the P2P Trade to retrieve",
            schema: { type: "string" },
        },
    ],
    responses: {
        200: {
            description: "P2P Trade details",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: utils_1.baseP2pTradeSchema, // Define this schema in your utils if it's not already defined
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("P2P Trade"),
        500: query_1.serverErrorResponse,
    },
    requiresAuth: true,
};
exports.default = async (data) => {
    const { params } = data;
    return await (0, query_1.getRecord)("p2pTrade", params.id, [
        {
            model: db_1.models.user,
            as: "user",
            attributes: ["id", "firstName", "lastName", "email", "avatar"],
        },
        {
            model: db_1.models.user,
            as: "seller",
            attributes: ["id", "firstName", "lastName", "email", "avatar"],
        },
        {
            model: db_1.models.p2pOffer,
            as: "offer",
            attributes: ["id", "status", "currency"],
            includeModels: [
                {
                    model: db_1.models.p2pPaymentMethod,
                    as: "paymentMethod",
                },
                {
                    model: db_1.models.p2pReview,
                    as: "p2pReviews",
                    attributes: ["id", "rating", "comment", "createdAt"],
                    includeModels: [
                        {
                            model: db_1.models.user,
                            as: "reviewer",
                            attributes: ["id", "firstName", "lastName", "email", "avatar"],
                        },
                    ],
                },
            ],
        },
        {
            model: db_1.models.p2pDispute,
            as: "p2pDisputes",
            attributes: ["id", "status", "resolution", "reason"],
            includeModels: [
                {
                    model: db_1.models.user,
                    as: "raisedBy",
                    attributes: ["id", "firstName", "lastName", "email", "avatar"],
                },
            ],
        },
    ]);
};
