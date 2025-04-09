"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Deletes a specific Mailwizard campaign",
    operationId: "deleteMailwizardCampaign",
    tags: ["Admin", "Mailwizard", "Campaigns"],
    parameters: (0, query_1.deleteRecordParams)("Mailwizard campaign"),
    responses: (0, query_1.deleteRecordResponses)("Mailwizard campaign"),
    permission: "Access Mailwizard Campaign Management",
    requiresAuth: true,
};
exports.default = async (data) => {
    const { params, query } = data;
    return (0, query_1.handleSingleDelete)({
        model: "mailwizardCampaign",
        id: params.id,
        query,
    });
};
