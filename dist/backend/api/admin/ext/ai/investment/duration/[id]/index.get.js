"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
exports.metadata = {
    summary: "Retrieves detailed information of a specific AI Investment Duration by ID",
    operationId: "getAIInvestmentDurationById",
    tags: ["Admin", "AI Investment Durations"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            required: true,
            description: "ID of the AI Investment Duration to retrieve",
            schema: { type: "string" },
        },
    ],
    responses: {
        200: {
            description: "AI Investment Duration details",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: utils_1.baseAIInvestmentDurationSchema, // Define this schema in your utils if it's not already defined
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("AI Investment Duration"),
        500: query_1.serverErrorResponse,
    },
    permission: "Access AI Investment Duration Management",
    requiresAuth: true,
};
exports.default = async (data) => {
    const { params } = data;
    return await (0, query_1.getRecord)("aiInvestmentDuration", params.id);
};
