"use strict";
// /server/api/p2p/trades/index.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const constants_1 = require("@b/utils/constants");
const query_1 = require("@b/utils/query");
const utils_1 = require("./utils");
const sequelize_1 = require("sequelize");
exports.metadata = {
    summary: "Lists P2P trades with pagination and optional filtering",
    operationId: "listP2PTrades",
    tags: ["P2P", "Trades"],
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
};
exports.default = async (data) => {
    const { user, query } = data;
    if (!user) {
        throw new Error("Unauthorized");
    }
    // Call the generic fetch function
    return (0, query_1.getFiltered)({
        model: db_1.models.p2pTrade,
        query,
        where: {
            [sequelize_1.Op.or]: [{ userId: user.id }, { sellerId: user.id }],
        },
        sortField: query.sortField || "createdAt",
        includeModels: [
            {
                model: db_1.models.user,
                as: "user",
                attributes: ["firstName", "lastName", "email", "avatar"],
            },
            {
                model: db_1.models.user,
                as: "seller",
                attributes: ["firstName", "lastName", "email", "avatar"],
            },
            {
                model: db_1.models.p2pOffer,
                as: "offer",
                attributes: ["id", "status", "currency", "chain", "walletType"],
            },
            {
                model: db_1.models.p2pDispute,
                as: "p2pDisputes",
                attributes: ["id", "status"],
            },
        ],
        numericFields: ["amount"],
    });
};
