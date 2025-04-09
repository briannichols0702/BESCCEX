"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseCategorySchema = exports.baseProductPropertiesSchema = void 0;
const schema_1 = require("@b/utils/schema");
exports.baseProductPropertiesSchema = {
    id: (0, schema_1.baseStringSchema)("Unique identifier of the product"),
    name: (0, schema_1.baseStringSchema)("Name of the product"),
    description: (0, schema_1.baseStringSchema)("Description of the product"),
    price: (0, schema_1.baseStringSchema)("Price of the product"),
    stock: (0, schema_1.baseStringSchema)("Stock available for the product"),
};
exports.baseCategorySchema = {
    id: (0, schema_1.baseStringSchema)("The unique identifier for the category"),
    name: (0, schema_1.baseStringSchema)("Name of the category"),
    description: (0, schema_1.baseStringSchema)("Description of the category"),
    image: (0, schema_1.baseStringSchema)("URL of the image representing the category", 255, 0, true),
    status: (0, schema_1.baseBooleanSchema)("Status of the category (active/inactive)"),
    products: {
        type: "array",
        description: "List of active products in this category",
        items: {
            type: "object",
            properties: exports.baseProductPropertiesSchema,
        },
    },
};
