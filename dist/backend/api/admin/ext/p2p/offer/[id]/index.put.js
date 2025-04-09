"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
exports.metadata = {
    summary: "Updates a specific P2P Offer",
    operationId: "updateP2pOffer",
    tags: ["Admin", "P2P Offer"],
    parameters: [
        {
            name: "id",
            in: "path",
            description: "ID of the P2P Offer to update",
            required: true,
            schema: {
                type: "string",
            },
        },
    ],
    requestBody: {
        description: "New data for the P2P Offer",
        content: {
            "application/json": {
                schema: utils_1.p2pOfferUpdateSchema,
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("P2P Offer"),
    requiresAuth: true,
    permission: "Access P2P Offer Management",
};
exports.default = async (data) => {
    const { body, params } = data;
    const { id } = params;
    const updatedFields = {
        status: body.status,
        amount: body.amount,
        minAmount: body.minAmount,
        maxAmount: body.maxAmount,
        price: body.price,
    };
    return await (0, query_1.updateRecord)("p2pOffer", id, updatedFields);
};
