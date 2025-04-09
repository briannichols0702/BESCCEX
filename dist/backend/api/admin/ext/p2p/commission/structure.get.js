"use strict";
// /api/p2pCommissions/structure.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.p2pCommissionStructure = exports.metadata = void 0;
const constants_1 = require("@b/utils/constants");
exports.metadata = {
    summary: "Get form structure for P2P Commissions",
    operationId: "getP2pCommissionStructure",
    tags: ["Admin", "P2P Commissions"],
    responses: {
        200: {
            description: "Form structure for managing P2P Commissions",
            content: constants_1.structureSchema,
        },
    },
    permission: "Access P2P Commission Management"
};
const p2pCommissionStructure = () => {
    const tradeId = {
        type: "input",
        label: "Trade ID",
        name: "tradeId",
        placeholder: "Enter the associated trade ID",
    };
    const amount = {
        type: "input",
        label: "Commission Amount",
        name: "amount",
        placeholder: "Enter the commission amount",
        ts: "number",
    };
    return {
        tradeId,
        amount,
    };
};
exports.p2pCommissionStructure = p2pCommissionStructure;
exports.default = () => {
    const { tradeId, amount } = (0, exports.p2pCommissionStructure)();
    return {
        get: [tradeId, amount],
        set: [tradeId, amount],
    };
};
