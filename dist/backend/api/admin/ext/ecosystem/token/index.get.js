"use strict";
// /server/api/ecosystem/tokens/index.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const constants_1 = require("@b/utils/constants");
const query_1 = require("@b/utils/query");
const utils_1 = require("./utils");
exports.metadata = {
    summary: "Lists all ecosystem tokens with pagination and optional filtering",
    operationId: "listEcosystemTokens",
    tags: ["Admin", "Ecosystem", "Tokens"],
    parameters: constants_1.crudParameters,
    responses: {
        200: {
            description: "List of ecosystem tokens with optional details",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            data: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: utils_1.ecosystemTokenSchema,
                                },
                            },
                            pagination: constants_1.paginationSchema,
                        },
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("Ecosystem Tokens"),
        500: query_1.serverErrorResponse,
    },
    requiresAuth: true,
    permission: "Access Ecosystem Token Management",
};
exports.default = async (data) => {
    const { query } = data;
    return (0, query_1.getFiltered)({
        model: db_1.models.ecosystemToken,
        query,
        sortField: query.sortField || "name",
        numericFields: ["decimals", "precision", "fee"],
    });
};
