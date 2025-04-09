"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Deletes a specific e-commerce product",
    operationId: "deleteEcommerceProduct",
    tags: ["Admin", "Ecommerce", "Products"],
    parameters: (0, query_1.deleteRecordParams)("E-commerce product"),
    responses: (0, query_1.deleteRecordResponses)("E-commerce product"),
    permission: "Access Ecommerce Product Management",
    requiresAuth: true,
};
exports.default = async (data) => {
    const { params, query } = data;
    return (0, query_1.handleSingleDelete)({
        model: "ecommerceProduct",
        id: params.id,
        query,
    });
};
