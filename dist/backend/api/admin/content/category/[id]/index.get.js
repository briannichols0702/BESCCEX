"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
exports.metadata = {
    summary: "Retrieves detailed information of a specific category by ID",
    operationId: "getCategoryById",
    tags: ["Admin", "Content", "Category"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            required: true,
            description: "ID of the category to retrieve",
            schema: { type: "string" },
        },
    ],
    responses: {
        200: {
            description: "Category details",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: utils_1.baseCategorySchema, // Define this schema in your utils if it's not already defined
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("Category"),
        500: query_1.serverErrorResponse,
    },
    permission: "Access Category Management",
    requiresAuth: true,
};
exports.default = async (data) => {
    const { params } = data;
    return await (0, query_1.getRecord)("category", params.id);
};
