"use strict";
// /server/api/forex/investments/index.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const constants_1 = require("@b/utils/constants");
const query_1 = require("@b/utils/query");
const utils_1 = require("./utils");
exports.metadata = {
    summary: "Lists all Forex Investments with pagination and optional filtering",
    operationId: "listForexInvestments",
    tags: ["Admin", "Forex", "Investments"],
    parameters: constants_1.crudParameters,
    responses: {
        200: {
            description: "List of Forex Investments with pagination information",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            data: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: utils_1.forexInvestmentSchema,
                                },
                            },
                            pagination: constants_1.paginationSchema,
                        },
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("Forex Investments"),
        500: query_1.serverErrorResponse,
    },
    requiresAuth: true,
    permission: "Access Forex Investment Management",
};
exports.default = async (data) => {
    const { query } = data;
    return (0, query_1.getFiltered)({
        model: db_1.models.forexInvestment,
        query,
        sortField: query.sortField || "createdAt",
        includeModels: [
            {
                model: db_1.models.user,
                as: "user",
                attributes: ["firstName", "lastName", "email", "avatar"],
            },
            {
                model: db_1.models.forexPlan,
                as: "plan",
                attributes: ["id", "title"],
            },
            {
                model: db_1.models.forexDuration,
                as: "duration",
                attributes: ["id", "duration", "timeframe"],
            },
        ],
        numericFields: ["amount", "profit"],
    });
};
