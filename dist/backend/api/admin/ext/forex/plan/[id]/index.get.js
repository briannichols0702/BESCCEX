"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
const db_1 = require("@b/db");
exports.metadata = {
    summary: "Retrieves detailed information of a specific forex plan by ID",
    operationId: "getForexPlanById",
    tags: ["Admin", "Forex Plans"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            required: true,
            description: "ID of the forex plan to retrieve",
            schema: { type: "string" },
        },
    ],
    responses: {
        200: {
            description: "Forex plan details",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: utils_1.baseForexPlanSchema, // Define this schema in your utils if it's not already defined
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("Forex Plan"),
        500: query_1.serverErrorResponse,
    },
    permission: "Access Forex Plan Management",
    requiresAuth: true,
};
exports.default = async (data) => {
    const { params } = data;
    return await (0, query_1.getRecord)("forexPlan", params.id, [
        {
            model: db_1.models.forexDuration,
            as: "durations",
            through: { attributes: [] },
            attributes: ["id", "duration", "timeframe"],
        },
    ]);
};
