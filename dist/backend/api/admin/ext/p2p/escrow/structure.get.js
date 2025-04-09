"use strict";
// /api/p2pEscrows/structure.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.p2pEscrowStructure = exports.metadata = void 0;
const constants_1 = require("@b/utils/constants");
exports.metadata = {
    summary: "Get form structure for P2P Escrows",
    operationId: "getP2pEscrowStructure",
    tags: ["Admin", "P2P Escrows"],
    responses: {
        200: {
            description: "Form structure for managing P2P Escrows",
            content: constants_1.structureSchema,
        },
    },
    permission: "Access P2P Escrow Management"
};
const p2pEscrowStructure = () => {
    const tradeId = {
        type: "input",
        label: "Trade ID",
        name: "tradeId",
        placeholder: "Enter the associated trade ID",
    };
    const amount = {
        type: "input",
        label: "Amount",
        name: "amount",
        placeholder: "Enter the amount to hold in escrow",
        ts: "number",
    };
    const status = {
        type: "select",
        label: "Status",
        name: "status",
        options: [
            { value: "PENDING", label: "Pending" },
            { value: "HELD", label: "Held" },
            { value: "RELEASED", label: "Released" },
            { value: "CANCELLED", label: "Cancelled" },
        ],
        placeholder: "Select the escrow status",
    };
    return {
        tradeId,
        amount,
        status,
    };
};
exports.p2pEscrowStructure = p2pEscrowStructure;
exports.default = () => {
    const { tradeId, amount, status } = (0, exports.p2pEscrowStructure)();
    return {
        get: [tradeId, amount, status],
        set: [tradeId, amount, status],
    };
};
