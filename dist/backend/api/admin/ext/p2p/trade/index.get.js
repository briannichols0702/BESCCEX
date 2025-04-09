"use strict";
// /server/api/p2p/trades/index.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const constants_1 = require("@b/utils/constants");
const query_1 = require("@b/utils/query");
const utils_1 = require("./utils");
exports.metadata = {
    summary: "Lists P2P trades with pagination and optional filtering",
    operationId: "listP2PTrades",
    tags: ["Admin", "P2P", "Trades"],
    parameters: constants_1.crudParameters,
    responses: {
        200: {
            description: "List of P2P trades with pagination information",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            data: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: utils_1.p2pTradeSchema,
                                },
                            },
                            pagination: constants_1.paginationSchema,
                        },
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("P2P Trades"),
        500: query_1.serverErrorResponse,
    },
    requiresAuth: true,
    permission: "Access P2P Trade Management",
};
exports.default = async (data) => {
    const { query } = data;
    // Call the generic fetch function
    return (0, query_1.getFiltered)({
        model: db_1.models.p2pTrade,
        query,
        sortField: query.sortField || "createdAt",
        includeModels: [
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
        ],
        numericFields: ["amount"],
    });
};
