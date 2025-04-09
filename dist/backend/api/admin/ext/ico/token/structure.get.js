"use strict";
// /api/icoTokens/structure.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.icoTokenStructure = exports.metadata = void 0;
const db_1 = require("@b/db");
const constants_1 = require("@b/utils/constants");
const structure_1 = require("@b/utils/schema/structure");
const cache_1 = require("@b/utils/cache");
const currency_1 = require("@b/utils/currency");
exports.metadata = {
    summary: "Get form structure for ICO Tokens",
    operationId: "getIcoTokenStructure",
    tags: ["Admin", "ICO Tokens"],
    responses: {
        200: {
            description: "Form structure for managing ICO Tokens",
            content: constants_1.structureSchema,
        },
    },
    permission: "Access ICO Token Management",
};
const icoTokenStructure = async () => {
    const projects = await db_1.models.icoProject.findAll();
    const name = {
        type: "input",
        label: "Name",
        name: "name",
        component: "InfoBlock",
        icon: "material-symbols-light:title",
        placeholder: "Enter the token name",
    };
    const chain = {
        type: "input",
        label: "Blockchain Chain",
        name: "chain",
        component: "InfoBlock",
        placeholder: "Enter the blockchain chain (e.g., Ethereum, Binance Smart Chain)",
    };
    const currency = {
        type: "input",
        label: "Currency",
        name: "currency",
        component: "InfoBlock",
        placeholder: "Enter the native currency (e.g., ETH, BNB)",
    };
    const purchaseWalletType = {
        type: "select",
        label: "Wallet Type for Purchase",
        name: "purchaseWalletType",
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
        purchaseWalletType.options.push({ value: "ECO", label: "Funding" });
    }
    const purchaseCurrency = {
        type: "select",
        label: "Purchase Currency",
        name: "purchaseCurrency",
        placeholder: "Enter the purchase currency",
        options: [],
        conditions: {
            purchaseWalletType: currencyConditions,
        },
    };
    const address = {
        type: "input",
        label: "Token Contract Address",
        name: "address",
        placeholder: "Enter the token contract address",
    };
    const totalSupply = {
        type: "input",
        label: "Total Supply",
        name: "totalSupply",
        placeholder: "Enter the total supply of tokens",
        ts: "number",
    };
    const description = {
        type: "textarea",
        label: "Description",
        name: "description",
        placeholder: "Enter the token description",
    };
    const status = {
        type: "select",
        label: "Status",
        name: "status",
        options: [
            { value: "PENDING", label: "Pending" },
            { value: "ACTIVE", label: "Active" },
            { value: "COMPLETED", label: "Completed" },
            { value: "REJECTED", label: "Rejected" },
            { value: "CANCELLED", label: "Cancelled" },
        ],
        placeholder: "Select the token status",
    };
    const projectId = {
        type: "select",
        label: "Project",
        name: "projectId",
        options: projects.map((project) => ({
            value: project.id,
            label: project.name,
        })),
        placeholder: "Select the project",
    };
    return {
        name,
        chain,
        currency,
        purchaseCurrency,
        purchaseWalletType,
        address,
        totalSupply,
        description,
        status,
        projectId,
    };
};
exports.icoTokenStructure = icoTokenStructure;
exports.default = async () => {
    const { name, chain, currency, purchaseCurrency, purchaseWalletType, address, totalSupply, description, status, projectId, } = await (0, exports.icoTokenStructure)();
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
                                type: "input",
                                component: "InfoBlock",
                                label: "Plan Title",
                                name: "project.name",
                                icon: "ph:wallet-light",
                            },
                            chain,
                            currency,
                        ],
                        grid: "column",
                    },
                ],
                className: "card-dashed mb-3 items-center",
            },
            [purchaseWalletType, purchaseCurrency],
            address,
            totalSupply,
            description,
            status,
        ],
        set: [
            structure_1.imageStructure,
            [name, projectId],
            [chain, currency],
            [purchaseWalletType, purchaseCurrency],
            [address, totalSupply],
            description,
            status,
        ],
    };
};
