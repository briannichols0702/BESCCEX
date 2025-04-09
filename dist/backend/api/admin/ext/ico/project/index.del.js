"use strict";
// /server/api/ico/projects/delete.del.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Bulk deletes ICO projects by IDs",
    operationId: "bulkDeleteIcoProjects",
    tags: ["Admin", "ICO", "Projects"],
    parameters: (0, query_1.commonBulkDeleteParams)("ICO Projects"),
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        ids: {
                            type: "array",
                            items: { type: "string" },
                            description: "Array of ICO project IDs to delete",
                        },
                    },
                    required: ["ids"],
                },
            },
        },
    },
    responses: (0, query_1.commonBulkDeleteResponses)("ICO Projects"),
    requiresAuth: true,
    permission: "Access ICO Project Management",
};
exports.default = async (data) => {
    const { body, query } = data;
    const { ids } = body;
    return (0, query_1.handleBulkDelete)({
        model: "icoProject",
        ids,
        query,
    });
};
