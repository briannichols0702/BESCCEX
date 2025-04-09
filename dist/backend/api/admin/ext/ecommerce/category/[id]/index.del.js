"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Deletes a specific e-commerce category",
    operationId: "deleteEcommerceCategory",
    tags: ["Admin", "Ecommerce", "Categories"],
    parameters: (0, query_1.deleteRecordParams)("E-commerce category"),
    responses: (0, query_1.deleteRecordResponses)("E-commerce category"),
    permission: "Access Ecommerce Category Management",
    requiresAuth: true,
};
exports.default = async (data) => {
    const { params, query } = data;
    return (0, query_1.handleSingleDelete)({
        model: "ecommerceCategory",
        id: params.id,
        query,
    });
};
