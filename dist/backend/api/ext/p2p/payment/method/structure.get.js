"use strict";
// /api/p2pPaymentMethods/structure.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.p2pPaymentMethodStructure = exports.metadata = void 0;
const constants_1 = require("@b/utils/constants");
const structure_1 = require("@b/utils/schema/structure");
const cache_1 = require("@b/utils/cache");
const currency_1 = require("@b/utils/currency");
exports.metadata = {
    summary: "Get form structure for P2P Payment Methods",
    operationId: "getP2pPaymentMethodStructure",
    tags: ["P2P", "Payment Methods"],
    responses: {
        200: {
            description: "Form structure for managing P2P Payment Methods",
            content: constants_1.structureSchema,
        },
    },
};
const p2pPaymentMethodStructure = async () => {
    // Define your form fields
    const name = {
        type: "input",
        label: "Name",
        name: "name",
        component: "InfoBlock",
        icon: "material-symbols-light:title",
        placeholder: "Enter the name of the payment method",
    };
    const instructions = {
        type: "textarea",
        label: "Instructions",
        name: "instructions",
        placeholder: "Detailed instructions on how to use this payment method",
    };
    const status = {
        type: "select",
        label: "Active",
        name: "status",
        options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
        ],
        ts: "boolean",
    };
    const walletType = {
        type: "select",
        label: "Wallet Type",
        name: "walletType",
        options: [
            { value: "FIAT", label: "Fiat" },
            { value: "SPOT", label: "Spot" },
        ],
        placeholder: "Select wallet type",
    };
    const currencyConditions = await (0, currency_1.getCurrencyConditions)();
    const cacheManager = cache_1.CacheManager.getInstance();
    const extensions = await cacheManager.getExtensions();
    if (extensions.has("ecosystem")) {
        walletType.options.push({ value: "ECO", label: "Funding" });
    }
    const currency = {
        type: "select",
        label: "Currency",
        name: "currency",
        options: [],
        conditions: {
            walletType: currencyConditions,
        },
    };
    const chain = {
        type: "input",
        label: "Chain",
        name: "chain",
        component: "InfoBlock",
        icon: "material-symbols-light:title",
        placeholder: "Blockchain network (optional)",
        condition: { walletType: "ECO" },
    };
    return {
        name,
        instructions,
        currency,
        status,
        walletType,
        chain,
    };
};
exports.p2pPaymentMethodStructure = p2pPaymentMethodStructure;
exports.default = async () => {
    const { name, instructions, currency, status, walletType, chain } = await (0, exports.p2pPaymentMethodStructure)();
    return {
        get: [
            {
                fields: [
                    {
                        ...structure_1.imageStructure,
                        width: structure_1.imageStructure.width / 4,
                        height: structure_1.imageStructure.width / 4,
                    },
                    {
                        fields: [
                            name,
                            {
                                component: "InfoBlock",
                                icon: "material-symbols-light:title",
                                label: "Type",
                                name: "walletType",
                            },
                            chain,
                            currency,
                        ],
                        grid: "column",
                    },
                ],
                className: "card-dashed mb-3 items-center",
            },
            instructions,
            status,
        ],
        set: [
            structure_1.imageStructure,
            name,
            [walletType, currency, chain],
            instructions,
            status,
        ],
        edit: [structure_1.imageStructure, instructions],
    };
};
