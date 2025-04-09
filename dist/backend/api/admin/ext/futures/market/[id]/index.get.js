"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const utils_1 = require("@b/api/exchange/market/utils");
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Retrieves detailed information of a specific futures market by ID",
    operationId: "getFuturesMarketById",
    tags: ["Admin", "Futures Markets"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            required: true,
            description: "ID of the futures market to retrieve",
            schema: { type: "string" },
        },
    ],
    responses: {
        200: {
            description: "Futures market details",
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
        404: (0, query_1.notFoundMetadataResponse)("Futures Market"),
        500: query_1.serverErrorResponse,
    },
    permission: "Access Futures Market Management",
    requiresAuth: true,
};
exports.default = async (data) => {
    const { params } = data;
    return await (0, query_1.getRecord)("futuresMarket", params.id);
};
