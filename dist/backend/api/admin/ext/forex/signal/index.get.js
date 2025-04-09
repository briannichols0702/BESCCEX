"use strict";
// /server/api/forex/signals/index.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const constants_1 = require("@b/utils/constants");
const query_1 = require("@b/utils/query");
const utils_1 = require("./utils");
exports.metadata = {
    summary: "Lists all Forex Signals with pagination and optional filtering",
    operationId: "listForexSignals",
    tags: ["Admin", "Forex", "Signals"],
    parameters: constants_1.crudParameters,
    responses: {
        200: {
            description: "List of Forex Signals with pagination information",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            data: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: utils_1.forexSignalSchema,
                                },
                            },
                            pagination: constants_1.paginationSchema,
                        },
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("Forex Signals"),
        500: query_1.serverErrorResponse,
    },
    requiresAuth: true,
    permission: "Access Forex Signal Management",
};
exports.default = async (data) => {
    const { query } = data;
    // Using the getFiltered function which processes all CRUD parameters, including sorting and filtering
    return (0, query_1.getFiltered)({
        model: db_1.models.forexSignal,
        query,
        sortField: query.sortField || "createdAt",
        // Assuming deletedAt should not be shown
    });
};
