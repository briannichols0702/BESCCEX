"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
exports.metadata = {
    summary: "Updates a specific P2P Trade",
    operationId: "updateP2pTrade",
    tags: ["Admin", "P2P Trade"],
    parameters: [
        {
            name: "id",
            in: "path",
            description: "ID of the P2P Trade to update",
            required: true,
            schema: {
                type: "string",
            },
        },
    ],
    requestBody: {
        description: "New data for the P2P Trade",
        content: {
            "application/json": {
                schema: utils_1.p2pTradeUpdateSchema,
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("P2P Trade"),
    requiresAuth: true,
    permission: "Access P2P Trade Management",
};
exports.default = async (data) => {
    const { body, params } = data;
    const { id } = params;
    const updatedFields = {
        status: body.status,
        messages: body.messages,
        txHash: body.txHash,
    };
    return await (0, query_1.updateRecord)("p2pTrade", id, updatedFields);
};
