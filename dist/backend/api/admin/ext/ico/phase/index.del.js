"use strict";
// /server/api/ico/phases/delete.del.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Bulk deletes ICO phases by IDs",
    operationId: "bulkDeleteIcoPhases",
    tags: ["Admin", "ICO", "Phases"],
    parameters: (0, query_1.commonBulkDeleteParams)("ICO Phases"),
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
                            description: "Array of ICO phase IDs to delete",
                        },
                    },
                    required: ["ids"],
                },
            },
        },
    },
    responses: (0, query_1.commonBulkDeleteResponses)("ICO Phases"),
    requiresAuth: true,
    permission: "Access ICO Phase Management",
};
exports.default = async (data) => {
    const { body, query } = data;
    const { ids } = body;
    return (0, query_1.handleBulkDelete)({
        model: "icoPhase",
        ids,
        query,
    });
};
