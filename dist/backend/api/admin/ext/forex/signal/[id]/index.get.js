"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
exports.metadata = {
    summary: "Retrieves detailed information of a specific forex signal by ID",
    operationId: "getForexSignalById",
    tags: ["Admin", "Forex Signals"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            required: true,
            description: "ID of the forex signal to retrieve",
            schema: { type: "string" },
        },
    ],
    responses: {
        200: {
            description: "Forex signal details",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: utils_1.baseForexSignalSchema, // Define this schema in your utils if it's not already defined
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("Forex Signal"),
        500: query_1.serverErrorResponse,
    },
    permission: "Access Forex Signal Management",
    requiresAuth: true,
};
exports.default = async (data) => {
    const { params } = data;
    return await (0, query_1.getRecord)("forexSignal", params.id);
};
