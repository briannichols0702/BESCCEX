"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
exports.metadata = {
    summary: "Retrieves detailed information of a specific P2P Dispute by ID",
    operationId: "getP2pDisputeById",
    tags: ["Admin", "P2P", "Disputes"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            required: true,
            description: "ID of the P2P Dispute to retrieve",
            schema: { type: "string" },
        },
    ],
    responses: {
        200: {
            description: "P2P Dispute details",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: utils_1.baseP2pDisputeSchema, // Define this schema in your utils if it's not already defined
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("P2P Dispute"),
        500: query_1.serverErrorResponse,
    },
    permission: "Access P2P Dispute Management",
    requiresAuth: true,
};
exports.default = async (data) => {
    const { params } = data;
    return await (0, query_1.getRecord)("p2pDispute", params.id, [
        {
            model: db_1.models.p2pTrade,
            as: "trade",
            attributes: ["id", "status"],
        },
        {
            model: db_1.models.user,
            as: "raisedBy",
            attributes: ["firstName", "lastName", "email", "avatar"],
        },
    ]);
};
