"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
exports.metadata = {
    summary: "Updates a specific ecommerce category",
    operationId: "updateEcommerceCategory",
    tags: ["Admin", "Ecommerce", "Categories"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            description: "ID of the ecommerce category to update",
            required: true,
            schema: {
                type: "string",
            },
        },
    ],
    requestBody: {
        description: "New data for the ecommerce category",
        content: {
            "application/json": {
                schema: utils_1.ecommerceCategoryUpdateSchema,
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("Ecommerce Category"),
    requiresAuth: true,
    permission: "Access Ecommerce Category Management",
};
exports.default = async (data) => {
    const { body, params } = data;
    const { id } = params;
    const { name, description, image, status } = body;
    return await (0, query_1.updateRecord)("ecommerceCategory", id, {
        name,
        description,
        image,
        status,
    });
};
