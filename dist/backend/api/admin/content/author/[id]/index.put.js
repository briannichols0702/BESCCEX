"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
exports.metadata = {
    summary: "Updates a specific author",
    operationId: "updateAuthor",
    tags: ["Admin", "Content", "Author"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            description: "ID of the author to update",
            required: true,
            schema: {
                type: "string",
            },
        },
    ],
    requestBody: {
        description: "New data for the author",
        content: {
            "application/json": {
                schema: utils_1.authorUpdateSchema,
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("Author"),
    requiresAuth: true,
    permission: "Access Author Management",
};
exports.default = async (data) => {
    const { body, params } = data;
    const { id } = params;
    const { status } = body;
    return await (0, query_1.updateRecord)("author", id, {
        status,
    });
};
