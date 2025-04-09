"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Deletes a specific staking pool",
    operationId: "deleteStakingPool",
    tags: ["Admin", "Staking", "Pools"],
    parameters: (0, query_1.deleteRecordParams)("Staking pool"),
    responses: (0, query_1.deleteRecordResponses)("Staking pool"),
    permission: "Access Staking Pool Management",
    requiresAuth: true,
};
exports.default = async (data) => {
    const { params, query } = data;
    return (0, query_1.handleSingleDelete)({
        model: "stakingPool",
        id: params.id,
        query,
    });
};
