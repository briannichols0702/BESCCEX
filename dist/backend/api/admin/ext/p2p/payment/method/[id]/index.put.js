"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
exports.metadata = {
    summary: "Updates a specific P2P Payment Method",
    operationId: "updateP2pPaymentMethod",
    tags: ["Admin", "P2P Payment Method"],
    parameters: [
        {
            name: "id",
            in: "path",
            description: "ID of the P2P Payment Method to update",
            required: true,
            schema: {
                type: "string",
            },
        },
    ],
    requestBody: {
        description: "New data for the P2P Payment Method",
        content: {
            "application/json": {
                schema: utils_1.p2pPaymentMethodUpdateSchema,
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("P2P Payment Method"),
    requiresAuth: true,
    permission: "Access P2P Payment Method Management",
};
exports.default = async (data) => {
    const { body, params } = data;
    const { id } = params;
    const updatedFields = {
        name: body.name,
        instructions: body.instructions,
        walletType: body.walletType,
        chain: body.chain,
        currency: body.currency,
        image: body.image,
        status: body.status,
    };
    return await (0, query_1.updateRecord)("p2pPaymentMethod", id, updatedFields);
};
