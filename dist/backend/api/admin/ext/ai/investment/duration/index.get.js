"use strict";
// /server/api/ai/investmentDurations/index.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const constants_1 = require("@b/utils/constants");
const query_1 = require("@b/utils/query");
const utils_1 = require("./utils");
exports.metadata = {
    summary: "Lists all AI investment durations with pagination and optional filtering",
    operationId: "listAIInvestmentDurations",
    tags: ["Admin", "AI Investment Duration"],
    parameters: constants_1.crudParameters,
    responses: {
        200: {
            description: "List of AI investment durations with pagination information",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            data: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: utils_1.aiInvestmentDurationSchema,
                                },
                            },
                            pagination: constants_1.paginationSchema,
                        },
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("AI Investment Durations"),
        500: query_1.serverErrorResponse,
    },
    requiresAuth: true,
    permission: "Access AI Investment Duration Management",
};
exports.default = async (data) => {
    const { query } = data;
    return (0, query_1.getFiltered)({
        model: db_1.models.aiInvestmentDuration,
        query,
        sortField: query.sortField || "duration",
        paranoid: false,
    });
};
