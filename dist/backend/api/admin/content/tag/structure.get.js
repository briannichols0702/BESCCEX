"use strict";
// /api/admin/categories/structure.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.tagStructure = exports.metadata = void 0;
const constants_1 = require("@b/utils/constants");
exports.metadata = {
    summary: "Get form structure for Categories",
    operationId: "getTagStructure",
    tags: ["Admin", "Content", "Category"],
    responses: {
        200: {
            description: "Form structure for managing Categories",
            content: constants_1.structureSchema,
        },
    },
    permission: "Access Tag Management",
};
const tagStructure = () => {
    const name = {
        type: "input",
        label: "Name",
        name: "name",
        placeholder: "Enter the tag name",
    };
    const slug = {
        type: "input",
        label: "Slug",
        name: "slug",
        placeholder: "Enter the tag slug (URL-friendly name)",
    };
    return {
        name,
        slug,
    };
};
exports.tagStructure = tagStructure;
exports.default = async () => {
    const { name, slug } = (0, exports.tagStructure)();
    return {
        set: [[name, slug]],
    };
};
