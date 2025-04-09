"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
const db_1 = require("@b/db");
exports.metadata = {
    summary: "Retrieves detailed information of a specific P2P Offer by ID",
    operationId: "getP2pOfferById",
    tags: ["P2P", "Offer"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            required: true,
            description: "ID of the P2P Offer to retrieve",
            schema: { type: "string" },
        },
    ],
    responses: {
        200: {
            description: "P2P Offer details",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: utils_1.baseP2pOfferSchema, // Define this schema in your utils if it's not already defined
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("P2P Offer"),
        500: query_1.serverErrorResponse,
    },
};
exports.default = async (data) => {
    const { params } = data;
    return await (0, query_1.getRecord)("p2pOffer", params.id, [
        {
            model: db_1.models.p2pTrade,
            as: "p2pTrades",
            attributes: ["id", "status", "amount"],
        },
        {
            model: db_1.models.user,
            as: "user",
            attributes: ["firstName", "lastName", "avatar"],
        },
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
                    attributes: ["firstName", "lastName", "avatar"],
                },
            ],
        },
    ]);
};
