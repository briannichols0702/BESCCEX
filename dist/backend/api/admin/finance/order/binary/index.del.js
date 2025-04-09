"use strict";
// /server/api/admin/binary/orders/delete.del.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Bulk deletes binary orders by IDs",
    operationId: "bulkDeleteBinaryOrders",
    tags: ["Admin", "Binary Orders"],
    parameters: (0, query_1.commonBulkDeleteParams)("Binary Orders"),
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
                            description: "Array of binary order IDs to delete",
                        },
                    },
                    required: ["ids"],
                },
            },
        },
    },
    responses: (0, query_1.commonBulkDeleteResponses)("Binary Orders"),
    requiresAuth: true,
    permission: "Access Binary Order Management",
};
exports.default = async (data) => {
    const { body, query } = data;
    const { ids } = body;
    return (0, query_1.handleBulkDelete)({
        model: "binaryOrder",
        ids,
        query,
    });
};
