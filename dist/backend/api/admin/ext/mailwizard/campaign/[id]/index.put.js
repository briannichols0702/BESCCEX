"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
exports.metadata = {
    summary: "Updates a specific Mailwizard Campaign",
    operationId: "updateMailwizardCampaign",
    tags: ["Admin", "Mailwizard Campaigns"],
    parameters: [
        {
            name: "id",
            in: "path",
            description: "ID of the Mailwizard Campaign to update",
            required: true,
            schema: {
                type: "string",
            },
        },
    ],
    requestBody: {
        description: "New data for the Mailwizard Campaign",
        content: {
            "application/json": {
                schema: utils_1.mailwizardCampaignUpdateSchema,
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("Mailwizard Campaign"),
    requiresAuth: true,
    permission: "Access Mailwizard Campaign Management",
};
exports.default = async (data) => {
    const { body, params } = data;
    const { id } = params;
    const { name, subject, status, speed, targets, templateId } = body;
    return await (0, query_1.updateRecord)("mailwizardCampaign", id, {
        name,
        subject,
        status,
        speed,
        targets,
        templateId,
    });
};
