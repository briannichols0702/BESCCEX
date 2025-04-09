"use strict";
// /server/api/ecommerce/Shipping/delete.del.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Deletes a specific e-commerce shipping",
    operationId: "deleteEcommerceShipping",
    tags: ["Admin", "Ecommerce", "Shipping"],
    parameters: (0, query_1.deleteRecordParams)("E-commerce shipping"),
    responses: (0, query_1.deleteRecordResponses)("E-commerce shipping"),
    permission: "Access Ecommerce Shipping Management",
    requiresAuth: true,
};
exports.default = async (data) => {
    const { params, query } = data;
    return (0, query_1.handleSingleDelete)({
        model: "ecommerceShipping",
        id: params.id,
        query,
    });
};
