"use strict";
// /server/api/forex/accounts/index.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const constants_1 = require("@b/utils/constants");
const query_1 = require("@b/utils/query");
const utils_1 = require("./utils");
exports.metadata = {
    summary: "Lists all Forex accounts with pagination and optional details",
    operationId: "listForexAccounts",
    tags: ["Admin", "Forex"],
    parameters: constants_1.crudParameters,
    responses: {
        200: {
            description: "List of Forex accounts",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            data: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: utils_1.forexAccountSchema,
                                },
                            },
                            pagination: constants_1.paginationSchema,
                        },
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("Forex Accounts"),
        500: query_1.serverErrorResponse,
    },
    requiresAuth: true,
    permission: "Access Forex Account Management",
};
exports.default = async (data) => {
    const { query } = data;
    return (0, query_1.getFiltered)({
        model: db_1.models.forexAccount,
        query,
        sortField: query.sortField || "createdAt",
        includeModels: [
            {
                model: db_1.models.user,
                as: "user",
                attributes: ["firstName", "lastName", "email", "avatar"],
            },
        ],
        numericFields: ["balance", "leverage", "mt"],
    });
};
