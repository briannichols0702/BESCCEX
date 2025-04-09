"use strict";
// /server/api/p2p/offers/index.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const constants_1 = require("@b/utils/constants");
const query_1 = require("@b/utils/query");
const utils_1 = require("./utils");
exports.metadata = {
    summary: "Lists P2P offers with pagination and optional filtering",
    operationId: "listP2POffers",
    tags: ["P2P", "Offers"],
    parameters: constants_1.crudParameters,
    responses: {
        200: {
            description: "List of P2P offers with pagination information",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            data: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: utils_1.p2pOfferSchema,
                                },
                            },
                            pagination: constants_1.paginationSchema,
                        },
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("P2P Offers"),
        500: query_1.serverErrorResponse,
    },
};
exports.default = async (data) => {
    const { query } = data;
    // Call the generic fetch function
    return (0, query_1.getFiltered)({
        model: db_1.models.p2pOffer,
        query,
        where: { status: "ACTIVE" },
        sortField: query.sortField || "createdAt",
        includeModels: [
            {
                model: db_1.models.p2pTrade,
                as: "p2pTrades",
                attributes: ["id", "status"],
            },
            {
                model: db_1.models.user,
                as: "user",
                attributes: ["firstName", "lastName", "avatar"],
            },
            {
                model: db_1.models.p2pPaymentMethod,
                as: "paymentMethod",
                attributes: ["id", "name", "image", "currency"],
            },
            {
                model: db_1.models.p2pReview,
                as: "p2pReviews",
                attributes: ["id", "rating"],
            },
        ],
        numericFields: ["amount", "price", "rating"],
    });
};
