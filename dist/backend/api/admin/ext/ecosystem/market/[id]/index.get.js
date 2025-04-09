"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const utils_1 = require("@b/api/exchange/market/utils");
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Retrieves detailed information of a specific ecosystem market by ID",
    operationId: "getEcosystemMarketById",
    tags: ["Admin", "Ecosystem Markets"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            required: true,
            description: "ID of the ecosystem market to retrieve",
            schema: { type: "string" },
        },
    ],
    responses: {
        200: {
            description: "Ecosystem market details",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: utils_1.baseMarketSchema, // Define this schema in your utils if it's not already defined
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("Ecosystem Market"),
        500: query_1.serverErrorResponse,
    },
    permission: "Access Ecosystem Market Management",
    requiresAuth: true,
};
exports.default = async (data) => {
    const { params } = data;
    return await (0, query_1.getRecord)("ecosystemMarket", params.id);
};
