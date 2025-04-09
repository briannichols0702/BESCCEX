"use strict";
// /server/api/investment/plans/index.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const constants_1 = require("@b/utils/constants");
const query_1 = require("@b/utils/query");
const utils_1 = require("./utils");
exports.metadata = {
    summary: "Lists all Investment Plans with pagination and optional filtering",
    operationId: "listInvestmentPlans",
    tags: ["Admin", "Investment", "Plans"],
    parameters: constants_1.crudParameters,
    responses: {
        200: {
            description: "List of Investment Plans with pagination information",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            data: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: utils_1.investmentPlanSchema,
                                },
                            },
                            pagination: constants_1.paginationSchema,
                        },
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("Investment Plans"),
        500: query_1.serverErrorResponse,
    },
    requiresAuth: true,
    permission: "Access Investment Plan Management",
};
exports.default = async (data) => {
    const { query } = data;
    // Using the getFiltered function which processes all CRUD parameters, including sorting and filtering
    return (0, query_1.getFiltered)({
        model: db_1.models.investmentPlan,
        query,
        sortField: query.sortField || "createdAt",
        numericFields: [
            "minProfit",
            "maxProfit",
            "minAmount",
            "maxAmount",
            "invested",
            "profitPercentage",
            "defaultProfit",
            "defaultResult",
        ],
        includeModels: [
            {
                model: db_1.models.investmentDuration,
                as: "durations",
                through: { attributes: [] },
                attributes: ["id", "duration", "timeframe"],
            },
        ],
    });
};
