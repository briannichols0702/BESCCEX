"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const tokens_1 = require("@b/utils/eco/tokens");
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
exports.metadata = {
    summary: "Retrieves a specific ecosystem token",
    description: "Fetches details of a specific token in the ecosystem.",
    operationId: "getEcosystemToken",
    tags: ["Ecosystem", "Tokens"],
    parameters: [
        {
            name: "chain",
            in: "path",
            required: true,
            schema: { type: "string", description: "Blockchain chain name" },
        },
        {
            name: "currency",
            in: "path",
            required: true,
            schema: { type: "string", description: "Currency code of the token" },
        },
    ],
    responses: {
        200: {
            description: "Token details retrieved successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: utils_1.baseTokenSchema,
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("Token"),
        500: query_1.serverErrorResponse,
    },
};
exports.default = async (data) => {
    const { params } = data;
    const { chain, currency } = params;
    return await (0, tokens_1.getEcosystemToken)(chain, currency);
};
