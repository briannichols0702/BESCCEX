"use strict";
// /server/api/ico/allocations/delete.del.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Bulk deletes ICO allocations by IDs",
    operationId: "bulkDeleteIcoAllocations",
    tags: ["Admin", "ICO", "Allocations"],
    parameters: (0, query_1.commonBulkDeleteParams)("ICO Allocations"),
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
                            description: "Array of ICO allocation IDs to delete",
                        },
                    },
                    required: ["ids"],
                },
            },
        },
    },
    responses: (0, query_1.commonBulkDeleteResponses)("ICO Allocations"),
    requiresAuth: true,
    permission: "Access ICO Allocation Management",
};
exports.default = async (data) => {
    const { body, query } = data;
    const { ids } = body;
    return (0, query_1.handleBulkDelete)({
        model: "icoAllocation",
        ids,
        query,
    });
};
