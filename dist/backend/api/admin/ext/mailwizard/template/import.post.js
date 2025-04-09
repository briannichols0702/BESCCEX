"use strict";
// /api/admin/mailwizard/templates/store.post.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("./utils");
exports.metadata = {
    summary: "Stores a new Mailwizard Template",
    operationId: "storeMailwizardTemplate",
    tags: ["Admin", "Mailwizard Templates"],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: utils_1.mailwizardTemplateCreateSchema,
            },
        },
    },
    responses: (0, query_1.storeRecordResponses)(utils_1.mailwizardTemplateStoreSchema, "Mailwizard Template"),
    requiresAuth: true,
    permission: "Access Mailwizard Template Management",
};
exports.default = async (data) => {
    const { body } = data;
    const { name, content, design } = body;
    return await (0, query_1.storeRecord)({
        model: "mailwizardTemplate",
        data: {
            name,
            content,
            design,
        },
    });
};
