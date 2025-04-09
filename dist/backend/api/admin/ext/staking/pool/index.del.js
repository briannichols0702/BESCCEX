"use strict";
// /server/api/staking/pools/delete.del.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Bulk deletes staking pools by IDs",
    operationId: "bulkDeleteStakingPools",
    tags: ["Admin", "Staking", "Pools"],
    parameters: (0, query_1.commonBulkDeleteParams)("Staking Pools"),
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
                            description: "Array of staking pool IDs to delete",
                        },
                    },
                    required: ["ids"],
                },
            },
        },
    },
    responses: (0, query_1.commonBulkDeleteResponses)("Staking Pools"),
    requiresAuth: true,
    permission: "Access Staking Pool Management",
};
exports.default = async (data) => {
    const { body, query } = data;
    const { ids } = body;
    return (0, query_1.handleBulkDelete)({
        model: "stakingPool",
        ids,
        query,
    });
};
