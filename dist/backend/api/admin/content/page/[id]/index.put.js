"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
// /api/admin/pages/[id]/update.put.ts
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
exports.metadata = {
    summary: "Updates an existing page",
    operationId: "updatePage",
    tags: ["Admin", "Content", "Page"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            description: "ID of the page to update",
            required: true,
            schema: {
                type: "string",
            },
        },
    ],
    requestBody: {
        required: true,
        description: "Updated data for the page",
        content: {
            "application/json": {
                schema: utils_1.pageUpdateSchema,
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("Page"),
    requiresAuth: true,
    permission: "Access Page Management",
};
exports.default = async (data) => {
    const { body, params } = data;
    const { id } = params;
    const { title, content, description, image, slug, status } = body;
    return await (0, query_1.updateRecord)("page", id, {
        title,
        content,
        description,
        image,
        slug,
        status,
    });
};
