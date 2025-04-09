"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
const db_1 = require("@b/db");
exports.metadata = {
    summary: "Retrieves detailed information of a specific P2P Escrow by ID",
    operationId: "getP2pEscrowById",
    tags: ["Admin", "P2P", "Escrow"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            required: true,
            description: "ID of the P2P Escrow to retrieve",
            schema: { type: "string" },
        },
    ],
    responses: {
        200: {
            description: "P2P Escrow details",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: utils_1.baseP2pEscrowSchema, // Define this schema in your utils if it's not already defined
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("P2P Escrow"),
        500: query_1.serverErrorResponse,
    },
    permission: "Access P2P Escrow Management",
    requiresAuth: true,
};
exports.default = async (data) => {
    const { params } = data;
    return await (0, query_1.getRecord)("p2pEscrow", params.id, [
        {
            model: db_1.models.p2pTrade,
            as: "trade",
            attributes: ["id", "status"],
        },
    ]);
};
