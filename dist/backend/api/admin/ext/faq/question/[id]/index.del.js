"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Deletes a specific FAQ",
    operationId: "deleteFAQ",
    tags: ["Admin", "FAQ"],
    parameters: (0, query_1.deleteRecordParams)("FAQ"),
    responses: (0, query_1.deleteRecordResponses)("FAQ"),
    permission: "Access FAQ Management",
    requiresAuth: true,
};
exports.default = async (data) => {
    const { params, query } = data;
    return (0, query_1.handleSingleDelete)({
        model: "faq",
        id: params.id,
        query,
    });
};
