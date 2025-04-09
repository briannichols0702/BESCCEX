"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Update Status for a Mailwizard Template",
    operationId: "updateMailwizardTemplateStatus",
    tags: ["Admin", "Mailwizard Templates"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            required: true,
            description: "ID of the Mailwizard Template to update",
            schema: { type: "string" },
        },
    ],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        status: {
                            type: "string",
                            enum: ["ACTIVE", "INACTIVE", "ARCHIVED"],
                            description: "New status to apply to the Mailwizard Template",
                        },
                    },
                    required: ["status"],
                },
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("Mailwizard Template"),
    requiresAuth: true,
    permission: "Access Mailwizard Template Management",
};
exports.default = async (data) => {
    const { body, params } = data;
    const { id } = params;
    const { status } = body;
    return (0, query_1.updateStatus)("mailwizardTemplate", id, status);
};
