"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
exports.metadata = {
    summary: "Updates a specific P2P Dispute",
    operationId: "updateP2pDispute",
    tags: ["Admin", "P2P Disputes"],
    parameters: [
        {
            name: "id",
            in: "path",
            description: "ID of the P2P Dispute to update",
            required: true,
            schema: {
                type: "string",
            },
        },
    ],
    requestBody: {
        description: "New data for the P2P Dispute",
        content: {
            "application/json": {
                schema: utils_1.p2pDisputeUpdateSchema,
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("P2P Dispute"),
    requiresAuth: true,
    permission: "Access P2P Dispute Management",
};
exports.default = async (data) => {
    const { body, params } = data;
    const { id } = params;
    const updatedFields = {
        status: body.status,
        resolution: body.resolution,
    };
    return await (0, query_1.updateRecord)("p2pDispute", id, updatedFields);
};
