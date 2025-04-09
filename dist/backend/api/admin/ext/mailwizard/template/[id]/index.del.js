"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Deletes a specific Mailwizard template",
    operationId: "deleteMailwizardTemplate",
    tags: ["Admin", "Mailwizard", "Templates"],
    parameters: (0, query_1.deleteRecordParams)("Mailwizard template"),
    responses: (0, query_1.deleteRecordResponses)("Mailwizard template"),
    permission: "Access Mailwizard Template Management",
    requiresAuth: true,
};
exports.default = async (data) => {
    const { params, query } = data;
    return (0, query_1.handleSingleDelete)({
        model: "mailwizardTemplate",
        id: params.id,
        query,
    });
};
