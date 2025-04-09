"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const release_post_1 = require("@b/api/ext/p2p/trade/[id]/release.post");
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Release a P2P trade",
    description: "Finalizes a specified P2P trade and updates its status to 'COMPLETED'.",
    operationId: "releaseTrade",
    tags: ["Admin", "P2P", "Trade"],
    parameters: [
        {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "number", description: "Trade ID" },
        },
    ],
    responses: {
        200: {
            description: "Trade released successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            message: { type: "string", description: "Success message" },
                        },
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("P2P Trade"),
        500: query_1.serverErrorResponse,
    },
    permission: "Access P2P Trade Management"
};
exports.default = async (data) => {
    const { params } = data;
    const { id } = params;
    await (0, release_post_1.handleTradeRelease)(id);
    return {
        message: "Trade released successfully",
    };
};
