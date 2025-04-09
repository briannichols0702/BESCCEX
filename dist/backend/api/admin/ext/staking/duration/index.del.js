"use strict";
// /server/api/staking/durations/delete.del.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Bulk deletes staking durations by IDs",
    operationId: "bulkDeleteStakingDurations",
    tags: ["Admin", "Staking", "Durations"],
    parameters: (0, query_1.commonBulkDeleteParams)("Staking Durations"),
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
                            description: "Array of staking duration IDs to delete",
                        },
                    },
                    required: ["ids"],
                },
            },
        },
    },
    responses: (0, query_1.commonBulkDeleteResponses)("Staking Durations"),
    requiresAuth: true,
    permission: "Access Staking Duration Management",
};
exports.default = async (data) => {
    const { body, query } = data;
    const { ids } = body;
    return (0, query_1.handleBulkDelete)({
        model: "stakingDuration",
        ids,
        query,
    });
};
