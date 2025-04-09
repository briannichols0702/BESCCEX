"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Deletes a specific e-commerce review",
    operationId: "deleteEcommerceReview",
    tags: ["Admin", "Ecommerce", "Reviews"],
    parameters: (0, query_1.deleteRecordParams)("E-commerce review"),
    responses: (0, query_1.deleteRecordResponses)("E-commerce review"),
    permission: "Access Ecommerce Review Management",
    requiresAuth: true,
};
exports.default = async (data) => {
    const { params, query } = data;
    return (0, query_1.handleSingleDelete)({
        model: "ecommerceReview",
        id: params.id,
        query,
    });
};
