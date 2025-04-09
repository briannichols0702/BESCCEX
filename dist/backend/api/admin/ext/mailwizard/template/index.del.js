"use strict";
// /server/api/mailwizard/templates/delete.del.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Bulk deletes Mailwizard templates by IDs",
    operationId: "bulkDeleteMailwizardTemplates",
    tags: ["Admin", "Mailwizard", "Templates"],
    parameters: (0, query_1.commonBulkDeleteParams)("Mailwizard Templates"),
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
                            description: "Array of Mailwizard template IDs to delete",
                        },
                    },
                    required: ["ids"],
                },
            },
        },
    },
    responses: (0, query_1.commonBulkDeleteResponses)("Mailwizard Templates"),
    requiresAuth: true,
    permission: "Access Mailwizard Template Management",
};
exports.default = async (data) => {
    const { body, query } = data;
    const { ids } = body;
    return (0, query_1.handleBulkDelete)({
        model: "mailwizardTemplate",
        ids,
        query,
    });
};
