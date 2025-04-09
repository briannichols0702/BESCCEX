"use strict";
// /api/p2pPaymentMethods/structure.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.p2pPaymentMethodStructure = exports.metadata = void 0;
const constants_1 = require("@b/utils/constants");
const structure_1 = require("@b/utils/schema/structure");
const cache_1 = require("@b/utils/cache");
exports.metadata = {
    summary: "Get form structure for P2P Payment Methods",
    operationId: "getP2pPaymentMethodStructure",
    tags: ["Admin", "P2P Payment Methods"],
    responses: {
        200: {
            description: "Form structure for managing P2P Payment Methods",
            content: constants_1.structureSchema,
        },
    },
    permission: "Access P2P Payment Method Management",
};
const p2pPaymentMethodStructure = async () => {
    const userId = {
        type: "input",
        label: "User",
        name: "userId",
        placeholder: "Enter the user ID",
        icon: "lets-icons:user-duotone",
    };
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
    const cacheManager = cache_1.CacheManager.getInstance();
    const extensions = await cacheManager.getExtensions();
    if (extensions.has("ecosystem")) {
        walletType.options.push({ value: "ECO", label: "Funding" });
    }
    const currency = {
        type: "input",
        label: "Currency",
        name: "currency",
        placeholder: "Enter the currency code",
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
    return {
        userId,
        name,
        instructions,
        currency,
        status,
    };
};
exports.p2pPaymentMethodStructure = p2pPaymentMethodStructure;
exports.default = async () => {
    const { userId, name, instructions, currency, status } = await (0, exports.p2pPaymentMethodStructure)();
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
                        fields: [name, currency],
                        grid: "column",
                    },
                ],
                className: "card-dashed mb-3 items-center",
            },
            userId,
            instructions,
            status,
        ],
        set: [structure_1.imageStructure, userId, [name, currency], instructions, status],
    };
};
