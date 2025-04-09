"use strict";
// /api/icoContributions/structure.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.icoContributionStructure = exports.metadata = void 0;
const db_1 = require("@b/db");
const constants_1 = require("@b/utils/constants");
exports.metadata = {
    summary: "Get form structure for ICO Contributions",
    operationId: "getIcoContributionStructure",
    tags: ["Admin", "ICO Contributions"],
    responses: {
        200: {
            description: "Form structure for managing ICO Contributions",
            content: constants_1.structureSchema,
        },
    },
    permission: "Access ICO Contribution Management"
};
const icoContributionStructure = async () => {
    const phases = await db_1.models.icoPhase.findAll();
    const userId = {
        type: "input",
        label: "User",
        name: "userId",
        placeholder: "Enter the user ID",
        icon: "lets-icons:user-duotone",
    };
    const phaseId = {
        type: "select",
        label: "Phase",
        name: "phaseId",
        options: phases.map((phase) => ({
            value: phase.id,
            label: phase.name,
        })),
        placeholder: "Select the phase",
    };
    const amount = {
        type: "input",
        label: "Amount",
        name: "amount",
        placeholder: "Enter the contribution amount",
        ts: "number",
    };
    const status = {
        type: "select",
        label: "Status",
        name: "status",
        options: [
            { value: "PENDING", label: "Pending" },
            { value: "COMPLETED", label: "Completed" },
            { value: "CANCELLED", label: "Cancelled" },
            { value: "REJECTED", label: "Rejected" },
        ],
        placeholder: "Select the status of the contribution",
    };
    return {
        userId,
        phaseId,
        amount,
        status,
    };
};
exports.icoContributionStructure = icoContributionStructure;
exports.default = async () => {
    const { userId, phaseId, amount, status } = await (0, exports.icoContributionStructure)();
    return {
        get: [
            userId,
            {
                type: "input",
                label: "Phase",
                name: "phase.name",
                icon: "ph:wallet-light",
            },
            amount,
            status,
        ],
        set: [userId, phaseId, [amount, status]],
    };
};
