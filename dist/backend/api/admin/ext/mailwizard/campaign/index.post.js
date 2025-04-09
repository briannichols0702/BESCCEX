"use strict";
// /api/admin/mailwizard/campaigns/store.post.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("./utils");
exports.metadata = {
    summary: "Stores a new Mailwizard Campaign",
    operationId: "storeMailwizardCampaign",
    tags: ["Admin", "Mailwizard Campaigns"],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: utils_1.mailwizardCampaignUpdateSchema,
            },
        },
    },
    responses: (0, query_1.storeRecordResponses)(utils_1.mailwizardCampaignStoreSchema, "Mailwizard Campaign"),
    requiresAuth: true,
    permission: "Access Mailwizard Campaign Management",
};
exports.default = async (data) => {
    const { body } = data;
    const { name, subject, speed, templateId } = body;
    return await (0, query_1.storeRecord)({
        model: "mailwizardCampaign",
        data: {
            name,
            subject,
            status: "PENDING",
            speed,
            templateId,
        },
    });
};
