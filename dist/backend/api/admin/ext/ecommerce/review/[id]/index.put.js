"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
exports.metadata = {
    summary: "Updates a specific ecommerce review",
    operationId: "updateEcommerceReview",
    tags: ["Admin", "Ecommerce", "Reviews"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            description: "ID of the ecommerce review to update",
            required: true,
            schema: {
                type: "string",
            },
        },
    ],
    requestBody: {
        description: "New data for the ecommerce review",
        content: {
            "application/json": {
                schema: utils_1.reviewUpdateSchema,
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("Ecommerce Review"),
    requiresAuth: true,
    permission: "Access Ecommerce Review Management",
};
exports.default = async (data) => {
    const { body, params } = data;
    const { id } = params;
    const { rating, comment, status } = body;
    return await (0, query_1.updateRecord)("ecommerceReview", id, {
        rating,
        comment,
        status,
    });
};
