"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Updates the status of a binary order",
    operationId: "updateBinaryOrderStatus",
    tags: ["Admin", "Binary Order"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            required: true,
            description: "ID of the binary order to update",
            schema: { type: "string" },
        },
    ],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        status: {
                            type: "string",
                            description: "New status to apply",
                            enum: ["PENDING", "WIN", "LOSS", "DRAW"],
                        },
                    },
                    required: ["status"],
                },
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("Binary Order"),
    requiresAuth: true,
    permission: "Access Binary Order Management",
};
exports.default = async (data) => {
    const { body, params } = data;
    const { id } = params;
    const { status } = body;
    return (0, query_1.updateStatus)("binaryOrder", id, status);
};
