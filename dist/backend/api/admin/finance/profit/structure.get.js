"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const constants_1 = require("@b/utils/constants");
const utils_1 = require("./utils");
exports.metadata = {
    summary: "Get form structure for Admin Profits",
    operationId: "getAdminProfitStructure",
    tags: ["Admin", "Finance", "Profits"],
    responses: {
        200: {
            description: "Form structure for managing Admin Profits",
            content: constants_1.structureSchema,
        },
    },
    permission: "Access Admin Profits",
};
exports.default = async () => {
    const { type, amount, currency, transactionId, description, chain } = (0, utils_1.adminProfitStructure)();
    return {
        get: [
            {
                fields: [transactionId, type, amount, currency],
                className: "card-dashed mb-5 items-center",
            },
            description,
            chain,
        ],
        set: [transactionId, type, amount, currency, description, chain],
    };
};
