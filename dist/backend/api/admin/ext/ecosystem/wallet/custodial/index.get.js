"use strict";
// /server/api/ecosystem/custodialWallets/index.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const constants_1 = require("@b/utils/constants");
const query_1 = require("@b/utils/query");
const utils_1 = require("./utils");
exports.metadata = {
    summary: "Lists all ecosystem custodial wallets with pagination and optional filtering",
    operationId: "listEcosystemCustodialWallets",
    tags: ["Admin", "Ecosystem", "Custodial Wallets"],
    parameters: constants_1.crudParameters,
    responses: {
        200: {
            description: "List of ecosystem custodial wallets with details about the master wallet",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            data: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: utils_1.ecosystemCustodialWalletSchema,
                                },
                            },
                            pagination: constants_1.paginationSchema,
                        },
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("Ecosystem Custodial Wallets"),
        500: query_1.serverErrorResponse,
    },
    requiresAuth: true,
    permission: "Access Ecosystem Custodial Wallet Management",
};
exports.default = async (data) => {
    const { query } = data;
    return (0, query_1.getFiltered)({
        model: db_1.models.ecosystemCustodialWallet,
        query,
        sortField: query.sortField || "chain",
        includeModels: [
            {
                model: db_1.models.ecosystemMasterWallet,
                as: "masterWallet",
                attributes: ["id", "chain", "address"],
            },
        ],
    });
};
