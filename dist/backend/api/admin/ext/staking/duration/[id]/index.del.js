"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Deletes a specific staking duration",
    operationId: "deleteStakingDuration",
    tags: ["Admin", "Staking", "Durations"],
    parameters: (0, query_1.deleteRecordParams)("Staking duration"),
    responses: (0, query_1.deleteRecordResponses)("Staking duration"),
    permission: "Access Staking Duration Management",
    requiresAuth: true,
};
exports.default = async (data) => {
    const { params, query } = data;
    return (0, query_1.handleSingleDelete)({
        model: "stakingDuration",
        id: params.id,
        query,
    });
};
