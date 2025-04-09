"use strict";
// /server/api/staking/logs/delete.del.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Bulk deletes staking logs by IDs",
    operationId: "bulkDeleteStakingLogs",
    tags: ["Admin", "Staking", "Logs"],
    parameters: (0, query_1.commonBulkDeleteParams)("Staking Logs"),
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
                            description: "Array of staking log IDs to delete",
                        },
                    },
                    required: ["ids"],
                },
            },
        },
    },
    responses: (0, query_1.commonBulkDeleteResponses)("Staking Logs"),
    requiresAuth: true,
    permission: "Access Staking Management",
};
exports.default = async (data) => {
    const { body, query } = data;
    const { ids } = body;
    return (0, query_1.handleBulkDelete)({
        model: "stakingLog",
        ids,
        query,
    });
};
