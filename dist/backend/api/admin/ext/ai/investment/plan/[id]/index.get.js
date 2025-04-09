"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
const db_1 = require("@b/db");
exports.metadata = {
    summary: "Retrieves detailed information of a specific AI Investment Plan by ID",
    operationId: "getAIInvestmentPlanById",
    tags: ["Admin", "AI Investment Plans"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            required: true,
            description: "ID of the AI Investment Plan to retrieve",
            schema: { type: "string" },
        },
    ],
    responses: {
        200: {
            description: "AI Investment Plan details",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: utils_1.baseAIInvestmentPlanSchema, // Define this schema in your utils if it's not already defined
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("AI Investment Plan"),
        500: query_1.serverErrorResponse,
    },
    permission: "Access AI Investment Plan Management",
    requiresAuth: true,
};
exports.default = async (data) => {
    const { params } = data;
    return await (0, query_1.getRecord)("aiInvestmentPlan", params.id, [
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
    ]);
};
