"use strict";
// /server/api/ecosystem/privateLedgers/index.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const constants_1 = require("@b/utils/constants");
const query_1 = require("@b/utils/query");
const utils_1 = require("./utils");
exports.metadata = {
    summary: "Lists all ecosystem private ledger entries with pagination and optional filtering",
    operationId: "listEcosystemPrivateLedgers",
    tags: ["Admin", "Ecosystem", "Private Ledgers"],
    parameters: constants_1.crudParameters,
    responses: {
        200: {
            description: "List of ecosystem private ledger entries with details about the wallet",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            data: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: utils_1.ecosystemPrivateLedgerSchema,
                                },
                            },
                            pagination: constants_1.paginationSchema,
                        },
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("Ecosystem Private Ledgers"),
        500: query_1.serverErrorResponse,
    },
    requiresAuth: true,
    permission: "Access Ecosystem Private Ledger Management",
};
exports.default = async (data) => {
    const { query } = data;
    return (0, query_1.getFiltered)({
        model: db_1.models.ecosystemPrivateLedger,
        query,
        sortField: query.sortField || "createdAt",
        includeModels: [
            {
                model: db_1.models.wallet,
                as: "wallet",
                attributes: ["currency", "address", "balance"],
                includeModels: [
                    {
                        model: db_1.models.user,
                        as: "user",
                        attributes: ["avatar", "firstName", "lastName", "email"],
                    },
                ],
            },
        ],
    });
    // TODO: custom filtering
    // return ledgers.filter(
    //   (ledger) => ledger.network === process.env[`${ledger.chain}_NETWORK`],
    // ) as unknown as EcosystemPrivateLedger[]
};
