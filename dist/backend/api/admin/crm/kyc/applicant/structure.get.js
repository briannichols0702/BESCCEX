"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.kycStructure = exports.metadata = void 0;
// /api/admin/kyc/structure.get.ts
const constants_1 = require("@b/utils/constants");
exports.metadata = {
    summary: "Get form structure for KYC applications",
    operationId: "getKycApplicationStructure",
    tags: ["Admin", "CRM", "KYC"],
    responses: {
        200: {
            description: "Form structure for KYC applications",
            content: constants_1.structureSchema,
        },
    },
    permission: "Access KYC Application Management",
};
const kycStructure = () => {
    const userId = {
        type: "input",
        label: "User",
        name: "userId",
        placeholder: "Enter the user ID",
        icon: "lets-icons:user-duotone",
    };
    const templateId = {
        type: "input",
        label: "Template ID",
        name: "templateId",
    };
    const status = {
        type: "select",
        label: "Status",
        name: "status",
        options: [
            { value: "PENDING", label: "Pending" },
            { value: "APPROVED", label: "Approved" },
            { value: "REJECTED", label: "Rejected" },
        ],
        placeholder: "Select status",
        ts: "string",
    };
    const level = {
        type: "input",
        label: "Level",
        name: "level",
        placeholder: "Enter the KYC level",
        ts: "number",
    };
    const notes = {
        type: "textarea",
        label: "Notes",
        name: "notes",
        placeholder: "Enter any notes",
    };
    const data = {
        type: "json",
        label: "Data",
        name: "data",
        placeholder: "{}",
    };
    return {
        userId,
        templateId,
        status,
        level,
        notes,
        data,
    };
};
exports.kycStructure = kycStructure;
exports.default = async () => {
    const { userId, templateId, status, level, notes, data } = (0, exports.kycStructure)();
    return {
        get: [userId, templateId, status, level, notes, data],
        set: [status, level, notes, data],
    };
};
