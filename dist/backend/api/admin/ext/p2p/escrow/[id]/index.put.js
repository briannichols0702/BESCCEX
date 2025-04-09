"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
exports.metadata = {
    summary: "Updates a specific P2P Escrow",
    operationId: "updateP2pEscrow",
    tags: ["Admin", "P2P Escrow"],
    parameters: [
        {
            name: "id",
            in: "path",
            description: "ID of the P2P Escrow to update",
            required: true,
            schema: {
                type: "string",
            },
        },
    ],
    requestBody: {
        description: "New data for the P2P Escrow",
        content: {
            "application/json": {
                schema: utils_1.p2pEscrowUpdateSchema,
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("P2P Escrow"),
    requiresAuth: true,
    permission: "Access P2P Escrow Management",
};
exports.default = async (data) => {
    const { body, params } = data;
    const { id } = params;
    const updatedFields = {
        status: body.status,
        amount: body.amount,
    };
    return await (0, query_1.updateRecord)("p2pEscrow", id, updatedFields);
};
