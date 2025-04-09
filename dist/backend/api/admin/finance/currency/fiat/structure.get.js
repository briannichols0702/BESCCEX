"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const constants_1 = require("@b/utils/constants");
// Define the form structure for editing currency information
exports.metadata = {
    summary: "Get form structure for currency editing",
    operationId: "getFormStructureForCurrencyEditing",
    tags: ["Admin", "Currencies"],
    responses: {
        200: {
            description: "Form structure for editing currency information",
            content: constants_1.structureSchema,
        },
    },
    permission: "Access Fiat Currency Management"
};
const priceStructure = {
    type: "input",
    label: "Price",
    name: "price",
    inputType: "number",
    placeholder: "e.g., 1.00",
    ts: "number",
};
exports.default = async () => {
    return {
        set: [priceStructure],
    };
};
