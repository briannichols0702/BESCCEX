"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
exports.metadata = {
    summary: "Updates a specific P2P Review",
    operationId: "updateP2pReview",
    tags: ["Admin", "P2P Review"],
    parameters: [
        {
            name: "id",
            in: "path",
            description: "ID of the P2P Review to update",
            required: true,
            schema: {
                type: "string",
            },
        },
    ],
    requestBody: {
        description: "New data for the P2P Review",
        content: {
            "application/json": {
                schema: utils_1.p2pReviewUpdateSchema,
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("P2P Review"),
    requiresAuth: true,
    permission: "Access P2P Review Management",
};
exports.default = async (data) => {
    const { body, params } = data;
    const { id } = params;
    const updatedFields = {
        rating: body.rating,
        comment: body.comment,
    };
    return await (0, query_1.updateRecord)("p2pReview", id, updatedFields);
};
