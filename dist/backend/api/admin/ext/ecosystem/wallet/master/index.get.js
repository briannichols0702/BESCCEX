"use strict";
// /server/api/ecosystem/masterWallets/index.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const constants_1 = require("@b/utils/constants");
const query_1 = require("@b/utils/query");
const utils_1 = require("./utils");
exports.metadata = {
    summary: "Lists all ecosystem master wallets with pagination and optional filtering",
    operationId: "listEcosystemMasterWallets",
    tags: ["Admin", "Ecosystem", "Master Wallets"],
    parameters: constants_1.crudParameters,
    responses: {
        200: {
            description: "List of ecosystem master wallets with optional details on custodial wallets",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            data: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: utils_1.ecosystemMasterWalletSchema,
                                },
                            },
                            pagination: constants_1.paginationSchema,
                        },
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("Ecosystem Master Wallets"),
        500: query_1.serverErrorResponse,
    },
    requiresAuth: true,
    permission: "Access Ecosystem Master Wallet Management",
};
exports.default = async (data) => {
    const { query } = data;
    return (0, query_1.getFiltered)({
        model: db_1.models.ecosystemMasterWallet,
        query,
        sortField: query.sortField || "chain",
        timestamps: false,
        includeModels: [
            {
                model: db_1.models.ecosystemCustodialWallet,
                as: "ecosystemCustodialWallets",
                attributes: ["id", "address", "status"],
            },
        ],
    });
};
