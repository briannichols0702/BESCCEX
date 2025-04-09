"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Deletes a specific ICO phase",
    operationId: "deleteIcoPhase",
    tags: ["Admin", "ICO", "Phases"],
    parameters: (0, query_1.deleteRecordParams)("ICO phase"),
    responses: (0, query_1.deleteRecordResponses)("ICO phase"),
    permission: "Access ICO Phase Management",
    requiresAuth: true,
};
exports.default = async (data) => {
    const { params, query } = data;
    return (0, query_1.handleSingleDelete)({
        model: "icoPhase",
        id: params.id,
        query,
    });
};
