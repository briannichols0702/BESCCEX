"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Deletes a specific staking log",
    operationId: "deleteStakingLog",
    tags: ["Admin", "Staking", "Logs"],
    parameters: (0, query_1.deleteRecordParams)("Staking log"),
    responses: (0, query_1.deleteRecordResponses)("Staking log"),
    permission: "Access Staking Management",
    requiresAuth: true,
};
exports.default = async (data) => {
    const { params, query } = data;
    return (0, query_1.handleSingleDelete)({
        model: "stakingLog",
        id: params.id,
        query,
    });
};
