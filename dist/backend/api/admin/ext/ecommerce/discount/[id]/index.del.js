"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Deletes a specific e-commerce discount",
    operationId: "deleteEcommerceDiscount",
    tags: ["Admin", "Ecommerce", "Discounts"],
    parameters: (0, query_1.deleteRecordParams)("E-commerce discount"),
    responses: (0, query_1.deleteRecordResponses)("E-commerce discount"),
    permission: "Access Ecommerce Discount Management",
    requiresAuth: true,
};
exports.default = async (data) => {
    const { params, query } = data;
    return (0, query_1.handleSingleDelete)({
        model: "ecommerceDiscount",
        id: params.id,
        query,
    });
};
