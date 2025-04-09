"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const cancel_post_1 = require("@b/api/ext/p2p/trade/[id]/cancel.post");
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Cancel a P2P trade",
    description: "Cancels a specified P2P trade and updates its status to 'CANCELLED'.",
    operationId: "cancelTrade",
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
            description: "Trade canceled successfully",
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
    await (0, cancel_post_1.handleTradeCancellation)(id, true);
    return {
        message: "Trade canceled successfully",
    };
};
