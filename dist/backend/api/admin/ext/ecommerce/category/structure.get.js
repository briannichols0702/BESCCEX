"use strict";
// /api/admin/ecommerceCategories/structure.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.ecommerceCategoryStructure = exports.metadata = void 0;
const constants_1 = require("@b/utils/constants");
const structure_1 = require("@b/utils/schema/structure");
exports.metadata = {
    summary: "Get form structure for E-commerce Categories",
    operationId: "getEcommerceCategoryStructure",
    tags: ["Admin", "Ecommerce Categories"],
    responses: {
        200: {
            description: "Form structure for managing E-commerce Categories",
            content: constants_1.structureSchema,
        },
    },
    permission: "Access Ecommerce Category Management",
};
const ecommerceCategoryStructure = () => {
    const name = {
        type: "input",
        label: "Name",
        name: "name",
        component: "InfoBlock",
        placeholder: "Enter the category name",
        icon: "iconamoon:category-thin",
    };
    const description = {
        type: "textarea",
        label: "Description",
        name: "description",
        placeholder: "Enter a description for the category",
    };
    const status = {
        type: "select",
        label: "Status",
        name: "status",
        ts: "boolean",
        options: [
            { label: "Active", value: true },
            { label: "Inactive", value: false },
        ],
    };
    return {
        name,
        description,
        status,
    };
};
exports.ecommerceCategoryStructure = ecommerceCategoryStructure;
exports.default = async () => {
    const { name, description, status } = (0, exports.ecommerceCategoryStructure)();
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
                        fields: [name],
                        grid: "column",
                    },
                ],
                className: "card-dashed mb-5 items-center",
            },
            description,
            status,
        ],
        set: [structure_1.imageStructureMd, [name, status], description],
    };
};
