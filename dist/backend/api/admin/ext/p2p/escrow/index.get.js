"use strict";
// /server/api/p2p/escrows/index.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const constants_1 = require("@b/utils/constants");
const query_1 = require("@b/utils/query");
const utils_1 = require("./utils");
exports.metadata = {
    summary: "Lists P2P escrows with pagination and optional filtering",
    operationId: "listP2PEscrows",
    tags: ["Admin", "P2P", "Escrows"],
    parameters: constants_1.crudParameters,
    responses: {
        200: {
            description: "List of P2P escrow records with pagination information",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            data: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: utils_1.p2pEscrowSchema,
                                },
                            },
                            pagination: constants_1.paginationSchema,
                        },
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("P2P Escrows"),
        500: query_1.serverErrorResponse,
    },
    requiresAuth: true,
    permission: "Access P2P Escrow Management",
};
exports.default = async (data) => {
    const { query } = data;
    // Call the generic fetch function
    return (0, query_1.getFiltered)({
        model: db_1.models.p2pEscrow,
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
