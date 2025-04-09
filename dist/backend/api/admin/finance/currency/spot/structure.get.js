"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.currencyStructure = exports.metadata = void 0;
// /api/admin/exchange/currencies/structure.get.ts
const constants_1 = require("@b/utils/constants");
exports.metadata = {
    summary: "Get form structure for exchange currencies",
    operationId: "getExchangeCurrenciesStructure",
    tags: ["Admin", "Exchange Currencies"],
    responses: {
        200: {
            description: "Form structure for exchange currencies",
            content: constants_1.structureSchema,
        },
    },
    permission: "Access Spot Currency Management",
};
const currencyStructure = () => {
    const currency = {
        type: "input",
        label: "Currency Code",
        name: "currency",
        placeholder: "USD",
    };
    const name = {
        type: "input",
        label: "Currency Name",
        name: "name",
        placeholder: "US Dollar",
    };
    const precision = {
        type: "input",
        label: "Precision",
        name: "precision",
        placeholder: "2",
        ts: "number",
    };
    const price = {
        type: "input",
        label: "Exchange Rate",
        name: "price",
        placeholder: "1.00",
        ts: "number",
    };
    const chains = {
        type: "json",
        label: "Supported Chains",
        name: "chains",
        placeholder: '{"ethereum": "0x..."}',
    };
    const status = {
        type: "select",
        label: "Status",
        name: "status",
        options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
        ],
        ts: "boolean",
    };
    return {
        currency,
        name,
        precision,
        price,
        chains,
        status,
    };
};
exports.currencyStructure = currencyStructure;
exports.default = async () => {
    const { currency, name, precision, price, chains, status } = (0, exports.currencyStructure)();
    return {
        get: [[currency, name], [precision, price], chains, status],
        set: [name, chains],
    };
};
