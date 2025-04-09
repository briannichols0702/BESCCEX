"use strict";
// /api/admin/ecommerceProducts/structure.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const constants_1 = require("@b/utils/constants");
const db_1 = require("@b/db");
const currency_1 = require("@b/utils/currency");
const cache_1 = require("@b/utils/cache");
exports.metadata = {
    summary: "Get form structure for E-commerce Products",
    operationId: "getEcommerceProductStructure",
    tags: ["Admin", "Ecommerce Products"],
    responses: {
        200: {
            description: "Form structure for managing E-commerce Products",
            content: constants_1.structureSchema,
        },
    },
    permission: "Access Ecommerce Product Management",
};
exports.default = async () => {
    const categoriesRes = await db_1.models.ecommerceCategory.findAll();
    const categories = categoriesRes.map((category) => ({
        value: category.id,
        label: category.name,
    }));
    const walletTypes = [
        { value: "FIAT", label: "Fiat" },
        { value: "SPOT", label: "Spot" },
    ];
    const currencyConditions = await (0, currency_1.getCurrencyConditions)();
    const cacheManager = cache_1.CacheManager.getInstance();
    const extensions = await cacheManager.getExtensions();
    if (extensions.has("ecosystem")) {
        walletTypes.push({ value: "ECO", label: "Funding" });
    }
    return {
        categories,
        walletTypes,
        currencyConditions,
    };
};
