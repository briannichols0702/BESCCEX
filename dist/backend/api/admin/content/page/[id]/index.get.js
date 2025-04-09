"use strict";
// /server/api/admin/pages/[id].get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils"); // Assuming the schema is in a separate file.
exports.metadata = {
    summary: "Retrieves a specific CMS page by ID",
    operationId: "getCmsPageById",
    tags: ["Admin", "Content", "Page"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            required: true,
            description: "ID of the CMS page to retrieve",
            schema: { type: "string" },
        },
    ],
    responses: {
        200: {
            description: "CMS page details",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: utils_1.basePageSchema,
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("CMS page not found"),
        500: query_1.serverErrorResponse,
    },
    requiresAuth: true,
    permission: "Access Page Management",
};
exports.default = async (data) => {
    const { params } = data;
    return await (0, query_1.getRecord)("page", params.id);
};
