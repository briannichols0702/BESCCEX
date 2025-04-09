"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
const db_1 = require("@b/db");
exports.metadata = {
    summary: "Retrieves detailed information of a specific forex investment by ID",
    operationId: "getForexInvestmentById",
    tags: ["Admin", "Forex Investments"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            required: true,
            description: "ID of the forex investment to retrieve",
            schema: { type: "string" },
        },
    ],
    responses: {
        200: {
            description: "Forex investment details",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: utils_1.baseForexInvestmentSchema, // Define this schema in your utils if it's not already defined
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("Forex Investment"),
        500: query_1.serverErrorResponse,
    },
    permission: "Access Forex Investment Management",
    requiresAuth: true,
};
exports.default = async (data) => {
    const { params } = data;
    return await (0, query_1.getRecord)("forexInvestment", params.id, [
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
    ]);
};
