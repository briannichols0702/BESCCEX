"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.templateStructure = exports.metadata = void 0;
// /api/admin/kyc/templates/structure.get.ts
const constants_1 = require("@b/utils/constants");
exports.metadata = {
    summary: "Get form structure for KYC templates",
    operationId: "getKYCTemplatesStructure",
    tags: ["Admin", "CRM", "KYC Template"],
    responses: {
        200: {
            description: "Form structure for KYC templates",
            content: constants_1.structureSchema,
        },
    },
    permission: "Access KYC Template Management",
};
const templateStructure = () => {
    const title = {
        type: "input",
        label: "Title",
        name: "title",
        placeholder: "Enter title",
    };
    const options = {
        type: "json",
        label: "Options",
        name: "options",
        placeholder: "Enter options",
    };
    const status = {
        type: "select",
        label: "Status",
        name: "status",
        placeholder: "Enter status",
        options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
        ],
        ts: "boolean",
    };
    return {
        title,
        options,
        status,
    };
};
exports.templateStructure = templateStructure;
exports.default = async () => {
    const { title, options, status } = (0, exports.templateStructure)();
    return {
        get: {
            TemplateInfo: [title, options, status],
        },
        set: [title, options, status],
    };
};
