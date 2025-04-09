"use strict";
// /api/mailwizardCampaigns/structure.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.mailwizardCampaignStructure = exports.metadata = void 0;
const db_1 = require("@b/db");
const constants_1 = require("@b/utils/constants");
exports.metadata = {
    summary: "Get form structure for Mailwizard Campaigns",
    operationId: "getMailwizardCampaignStructure",
    tags: ["Admin", "Mailwizard Campaigns"],
    responses: {
        200: {
            description: "Form structure for managing Mailwizard Campaigns",
            content: constants_1.structureSchema,
        },
    },
    permission: "Access Mailwizard Campaign Management"
};
const mailwizardCampaignStructure = async () => {
    const templates = await db_1.models.mailwizardTemplate.findAll();
    const name = {
        type: "input",
        label: "Name",
        name: "name",
        placeholder: "Enter the campaign name",
    };
    const subject = {
        type: "input",
        label: "Subject",
        name: "subject",
        placeholder: "Enter the email subject",
    };
    const status = {
        type: "select",
        label: "Status",
        name: "status",
        options: [
            { value: "PENDING", label: "Pending" },
            { value: "PAUSED", label: "Paused" },
            { value: "ACTIVE", label: "Active" },
            { value: "STOPPED", label: "Stopped" },
            { value: "COMPLETED", label: "Completed" },
            { value: "CANCELLED", label: "Cancelled" },
        ],
        placeholder: "Select the campaign status",
    };
    const speed = {
        type: "input",
        label: "Delivery Speed",
        name: "speed",
        placeholder: "Enter the number of emails sent per minute",
        ts: "number",
    };
    const targets = {
        type: "textarea",
        label: "Targets",
        name: "targets",
        placeholder: "Enter target email addresses",
    };
    const templateId = {
        type: "select",
        label: "Template ID",
        name: "templateId",
        options: templates.map((template) => ({
            value: template.id,
            label: template.name,
        })),
        placeholder: "Select the template ID",
    };
    return {
        name,
        subject,
        status,
        speed,
        targets,
        templateId,
    };
};
exports.mailwizardCampaignStructure = mailwizardCampaignStructure;
exports.default = async () => {
    const { name, subject, status, speed, targets, templateId } = await (0, exports.mailwizardCampaignStructure)();
    return {
        get: [
            name,
            [subject, speed],
            targets,
            {
                type: "input",
                label: "Template",
                name: "template.name",
                icon: "ph:wallet-light",
            },
            status,
        ],
        set: [
            [name, subject],
            [templateId, speed],
        ],
        edit: [subject, speed, templateId],
    };
};
