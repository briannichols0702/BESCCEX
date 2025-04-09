"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Updates the status of an AI Investment Plan",
    operationId: "updateAIInvestmentPlanStatus",
    tags: ["Admin", "AI Investment Plans"],
    parameters: [
        {
            name: "id",
            in: "path",
            required: true,
            description: "ID of the AI Investment Plan to update",
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
                            type: "boolean",
                            description: "New status to apply (true for active, false for inactive)",
                        },
                    },
                    required: ["status"],
                },
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("AI Investment Plan"),
    requiresAuth: true,
    permission: "Access AI Investment Plan Management",
};
exports.default = async (data) => {
    const { body, params } = data;
    const { id } = params;
    const { status } = body;
    return (0, query_1.updateStatus)("aiInvestmentPlan", id, status);
};
