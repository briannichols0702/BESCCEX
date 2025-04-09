"use strict";
// /server/api/p2p/commissions/index.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const constants_1 = require("@b/utils/constants");
const query_1 = require("@b/utils/query");
const utils_1 = require("./utils");
exports.metadata = {
    summary: "Lists P2P Commissions with pagination and optional filtering",
    operationId: "listP2PCommissions",
    tags: ["Admin", "P2P", "Commissions"],
    parameters: constants_1.crudParameters,
    responses: {
        200: {
            description: "List of P2P Commissions with pagination information",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            data: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: utils_1.p2pCommissionSchema,
                                },
                            },
                            pagination: constants_1.paginationSchema,
                        },
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("P2P Commissions"),
        500: query_1.serverErrorResponse,
    },
    requiresAuth: true,
    permission: "Access P2P Commission Management",
};
exports.default = async (data) => {
    const { query } = data;
    // Call the generic fetch function
    return (0, query_1.getFiltered)({
        model: db_1.models.p2pCommission,
        query,
        sortField: query.sortField || "createdAt",
        includeModels: [
            {
                model: db_1.models.p2pTrade,
                as: "trade",
                attributes: ["id", "status"],
            },
        ],
        // Assuming sensitive fields might be hidden
    });
};
