"use strict";
// /api/icoAllocations/structure.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.icoAllocationStructure = exports.metadata = void 0;
const db_1 = require("@b/db");
const constants_1 = require("@b/utils/constants");
exports.metadata = {
    summary: "Get form structure for ICO Allocations",
    operationId: "getIcoAllocationStructure",
    tags: ["Admin", "ICO Allocations"],
    responses: {
        200: {
            description: "Form structure for managing ICO Allocations",
            content: constants_1.structureSchema,
        },
    },
    permission: "Access ICO Allocation Management",
};
const icoAllocationStructure = async () => {
    const tokens = await db_1.models.icoToken.findAll();
    const name = {
        type: "input",
        label: "Name",
        name: "name",
        placeholder: "Enter the allocation name",
    };
    const percentage = {
        type: "input",
        label: "Percentage",
        name: "percentage",
        placeholder: "Enter the percentage of the allocation",
        ts: "number",
    };
    const tokenId = {
        type: "select",
        label: "Token ID",
        name: "tokenId",
        options: tokens.map((token) => ({
            value: token.id,
            label: `${token.currency} (${token.chain})`,
        })),
        placeholder: "Select the token",
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
        placeholder: "Select the status of the allocation",
    };
    return {
        name,
        percentage,
        tokenId,
        status,
    };
};
exports.icoAllocationStructure = icoAllocationStructure;
exports.default = async () => {
    const { name, percentage, tokenId, status } = await (0, exports.icoAllocationStructure)();
    return {
        get: [
            [name, percentage],
            {
                type: "input",
                label: "Token",
                name: "token.currency, ' (', token.chain,')'",
                icon: "ph:wallet-light",
            },
            status,
        ],
        set: [[name, tokenId], percentage, status],
    };
};
