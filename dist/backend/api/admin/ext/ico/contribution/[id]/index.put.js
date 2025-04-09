"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
exports.metadata = {
    summary: "Updates a specific ICO Contribution",
    operationId: "updateIcoContribution",
    tags: ["Admin", "ICO Contributions"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            description: "ID of the ICO Contribution to update",
            required: true,
            schema: {
                type: "string",
            },
        },
    ],
    requestBody: {
        description: "New data for the ICO Contribution",
        content: {
            "application/json": {
                schema: utils_1.icoContributionUpdateSchema,
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("ICO Contribution"),
    requiresAuth: true,
    permission: "Access ICO Contribution Management",
};
exports.default = async (data) => {
    const { body, params } = data;
    const { id } = params;
    const { userId, phaseId, amount, status } = body;
    return await (0, query_1.updateRecord)("icoContribution", id, {
        userId,
        phaseId,
        amount,
        status,
    });
};
