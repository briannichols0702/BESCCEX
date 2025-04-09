"use strict";
// /server/api/p2p/reviews/index.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const constants_1 = require("@b/utils/constants");
const query_1 = require("@b/utils/query");
const utils_1 = require("./utils");
exports.metadata = {
    summary: "Lists P2P reviews with pagination and optional filtering",
    operationId: "listP2PReviews",
    tags: ["Admin", "P2P", "Reviews"],
    parameters: constants_1.crudParameters,
    responses: {
        200: {
            description: "List of P2P reviews with pagination information",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            data: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: utils_1.p2pReviewSchema,
                                },
                            },
                            pagination: constants_1.paginationSchema,
                        },
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("P2P Reviews"),
        500: query_1.serverErrorResponse,
    },
    requiresAuth: true,
    permission: "Access P2P Review Management",
};
exports.default = async (data) => {
    const { query } = data;
    // Call the generic fetch function
    return (0, query_1.getFiltered)({
        model: db_1.models.p2pReview,
        query,
        sortField: query.sortField || "createdAt",
        includeModels: [
            {
                model: db_1.models.p2pOffer,
                as: "offer",
                attributes: ["id", "status", "currency"],
            },
            {
                model: db_1.models.user,
                as: "reviewer",
                attributes: ["firstName", "lastName", "email", "avatar"],
            },
            {
                model: db_1.models.user,
                as: "reviewed",
                attributes: ["firstName", "lastName", "email", "avatar"],
            },
        ],
        // Assuming sensitive fields might be hidden
    });
};
