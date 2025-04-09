"use strict";
// /api/mailwizardTemplates/structure.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.mailwizardTemplateStructure = exports.metadata = void 0;
const constants_1 = require("@b/utils/constants");
exports.metadata = {
    summary: "Get form structure for Mailwizard Templates",
    operationId: "getMailwizardTemplateStructure",
    tags: ["Admin", "Mailwizard Templates"],
    responses: {
        200: {
            description: "Form structure for managing Mailwizard Templates",
            content: constants_1.structureSchema,
        },
    },
    permission: "Access Mailwizard Template Management"
};
const mailwizardTemplateStructure = () => {
    const name = {
        type: "input",
        label: "Name",
        name: "name",
        placeholder: "Enter the template name",
    };
    const content = {
        type: "textarea",
        label: "Content",
        name: "content",
        placeholder: "Enter the email content HTML or Text",
    };
    const design = {
        type: "textarea",
        label: "Design",
        name: "design",
        placeholder: "Describe the design and layout",
    };
    return {
        name,
        content,
        design,
    };
};
exports.mailwizardTemplateStructure = mailwizardTemplateStructure;
exports.default = () => {
    const { name, content, design } = (0, exports.mailwizardTemplateStructure)();
    return {
        get: [name, content, design],
        set: [name],
        import: [name, content, design],
    };
};
