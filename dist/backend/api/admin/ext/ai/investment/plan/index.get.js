"use strict";
// /server/api/ai/investmentPlans/index.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const constants_1 = require("@b/utils/constants");
const query_1 = require("@b/utils/query");
const utils_1 = require("./utils");
exports.metadata = {
    summary: "Lists all AI investment plans with pagination and optional filtering",
    operationId: "listAIInvestmentPlans",
    tags: ["Admin", "AI Investment Plan"],
    parameters: constants_1.crudParameters,
    responses: {
        200: {
            description: "List of AI investment plans with detailed information and pagination",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            data: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: utils_1.aiInvestmentPlanSchema,
                                },
                            },
                            pagination: constants_1.paginationSchema,
                        },
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("AI Investment Plans"),
        500: query_1.serverErrorResponse,
    },
    requiresAuth: true,
    permission: "Access AI Investment Plan Management",
};
exports.default = async (data) => {
    const { query } = data;
    return (0, query_1.getFiltered)({
        model: db_1.models.aiInvestmentPlan,
        query,
        sortField: query.sortField || "name",
        includeModels: [
            {
                model: db_1.models.aiInvestment,
                as: "investments",
                attributes: ["id", "amount", "profit", "status"],
            },
            {
                model: db_1.models.aiInvestmentDuration,
                as: "durations",
                through: { attributes: [] },
                attributes: ["id", "duration", "timeframe"],
            },
        ],
    });
};
