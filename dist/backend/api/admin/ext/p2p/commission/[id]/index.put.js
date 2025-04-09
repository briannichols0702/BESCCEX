"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
exports.metadata = {
    summary: "Updates a specific P2P Commission",
    operationId: "updateP2pCommission",
    tags: ["Admin", "P2P Commissions"],
    parameters: [
        {
            name: "id",
            in: "path",
            description: "ID of the P2P Commission to update",
            required: true,
            schema: {
                type: "string",
            },
        },
    ],
    requestBody: {
        description: "New data for the P2P Commission",
        content: {
            "application/json": {
                schema: utils_1.p2pCommissionUpdateSchema,
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("P2P Commission"),
    requiresAuth: true,
    permission: "Access P2P Commission Management",
};
exports.default = async (data) => {
    const { body, params } = data;
    const { id } = params;
    const updatedFields = {
        amount: body.amount,
    };
    return await (0, query_1.updateRecord)("p2pCommission", id, updatedFields);
};
