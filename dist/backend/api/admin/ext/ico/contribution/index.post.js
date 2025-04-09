"use strict";
// /api/admin/ico/contributions/store.post.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("./utils");
exports.metadata = {
    summary: "Stores a new ICO Contribution",
    operationId: "storeIcoContribution",
    tags: ["Admin", "ICO Contributions"],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: utils_1.icoContributionUpdateSchema,
            },
        },
    },
    responses: (0, query_1.storeRecordResponses)(utils_1.icoContributionStoreSchema, "ICO Contribution"),
    requiresAuth: true,
    permission: "Access ICO Contribution Management",
};
exports.default = async (data) => {
    const { body } = data;
    const { userId, phaseId, amount, status } = body;
    return await (0, query_1.storeRecord)({
        model: "icoContribution",
        data: {
            userId,
            phaseId,
            amount,
            status,
        },
    });
};
