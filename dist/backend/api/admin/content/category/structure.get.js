"use strict";
// /api/admin/categories/structure.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryStructure = exports.metadata = void 0;
const constants_1 = require("@b/utils/constants");
const structure_1 = require("@b/utils/schema/structure");
exports.metadata = {
    summary: "Get form structure for Categories",
    operationId: "getCategoryStructure",
    tags: ["Admin", "Content", "Category"],
    responses: {
        200: {
            description: "Form structure for managing Categories",
            content: constants_1.structureSchema,
        },
    },
    permission: "Access Category Management",
};
const categoryStructure = () => {
    const name = {
        type: "input",
        label: "Name",
        name: "name",
        placeholder: "Enter the category name",
    };
    const slug = {
        type: "input",
        label: "Slug",
        name: "slug",
        placeholder: "Enter the category slug (URL-friendly name)",
    };
    const image = {
        type: "file",
        label: "Image",
        name: "image",
        placeholder: "Upload an image for the category",
        fileType: "image",
    };
    const description = {
        type: "textarea",
        label: "Description",
        name: "description",
        placeholder: "Enter a description for the category",
    };
    return {
        name,
        slug,
        image,
        description,
    };
};
exports.categoryStructure = categoryStructure;
exports.default = async () => {
    const { name, slug, image, description } = (0, exports.categoryStructure)();
    return {
        get: [
            {
                fields: [
                    {
                        ...structure_1.imageStructure,
                        width: 300,
                        height: 300,
                    },
                    {
                        fields: [name, slug],
                        grid: "column",
                    },
                ],
                className: "card-dashed mb-3 items-center",
            },
            description,
        ],
        set: [
            {
                ...structure_1.imageStructure,
                width: 300,
                height: 300,
            },
            [name, slug],
            description,
        ],
    };
};
