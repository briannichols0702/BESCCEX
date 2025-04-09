"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
const db_1 = require("@b/db");
exports.metadata = {
    summary: "Retrieves detailed information of a specific AI Investment by ID",
    operationId: "getAIInvestmentById",
    tags: ["Admin", "AI Investments"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            required: true,
            description: "ID of the AI Investment to retrieve",
            schema: { type: "string" },
        },
    ],
    responses: {
        200: {
            description: "AI Investment details",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: utils_1.baseAIInvestmentSchema, // Define this schema in your utils if it's not already defined
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("AI Investment"),
        500: query_1.serverErrorResponse,
    },
    permission: "Access AI Investment Management",
    requiresAuth: true,
};
exports.default = async (data) => {
    const { params } = data;
    return await (0, query_1.getRecord)("aiInvestment", params.id, [
        {
            model: db_1.models.user,
            as: "user",
            attributes: ["firstName", "lastName", "email", "avatar"],
        },
        {
            model: db_1.models.aiInvestmentPlan,
            as: "plan",
            attributes: ["title", "image"],
        },
        {
            model: db_1.models.aiInvestmentDuration,
            as: "duration",
            attributes: ["duration", "timeframe"],
        },
    ]);
};
