"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
exports.metadata = {
    summary: "Updates a specific category",
    operationId: "updateCategory",
    tags: ["Admin", "Content", "Category"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            description: "ID of the category to update",
            required: true,
            schema: {
                type: "string",
            },
        },
    ],
    requestBody: {
        description: "New data for the category",
        content: {
            "application/json": {
                schema: utils_1.categoryUpdateSchema,
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("Category"),
    requiresAuth: true,
    permission: "Access Category Management",
};
exports.default = async (data) => {
    const { body, params } = data;
    const { id } = params;
    const { name, slug, image, description } = body;
    return await (0, query_1.updateRecord)("category", id, {
        name,
        slug,
        image,
        description,
    });
};
