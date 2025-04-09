"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Deletes a specific e-commerce order",
    operationId: "deleteEcommerceOrder",
    tags: ["Admin", "Ecommerce", "Orders"],
    parameters: (0, query_1.deleteRecordParams)("E-commerce order"),
    responses: (0, query_1.deleteRecordResponses)("E-commerce order"),
    permission: "Access Ecommerce Order Management",
    requiresAuth: true,
};
exports.default = async (data) => {
    const { params, query } = data;
    return (0, query_1.handleSingleDelete)({
        model: "ecommerceOrder",
        id: params.id,
        query,
    });
};
