"use strict";
// /api/posts/structure.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.postStructure = exports.metadata = void 0;
const db_1 = require("@b/db");
const constants_1 = require("@b/utils/constants");
exports.metadata = {
    summary: "Get form structure for Blog Posts",
    operationId: "getPostStructure",
    tags: ["Admin", "Blog Posts"],
    responses: {
        200: {
            description: "Form structure for managing Blog Posts",
            content: constants_1.structureSchema,
        },
    },
    permission: "Access Post Management",
};
const postStructure = async () => {
    const categories = await db_1.models.category.findAll({
        attributes: ["id", "name"],
    });
    const title = {
        type: "input",
        label: "Title",
        name: "title",
        placeholder: "Enter the post title",
        required: true,
    };
    const content = {
        type: "textarea",
        label: "Content",
        name: "content",
        placeholder: "Write your post content here",
        required: true,
    };
    const categoryId = {
        type: "select",
        label: "Category ID",
        name: "categoryId",
        placeholder: "Enter the category ID",
        options: categories.map((category) => ({
            value: category.id,
            label: category.name,
        })),
        required: true,
    };
    const authorId = {
        type: "input",
        label: "Author ID",
        name: "authorId",
        placeholder: "Enter the author ID",
        required: true,
    };
    const slug = {
        type: "input",
        label: "Slug",
        name: "slug",
        placeholder: "Enter the unique slug for SEO",
        required: true,
    };
    const description = {
        type: "textarea",
        label: "Description",
        name: "description",
        placeholder: "Enter a brief description of the post",
    };
    const status = {
        type: "select",
        label: "Status",
        name: "status",
        options: [
            { value: "PUBLISHED", label: "Published" },
            { value: "DRAFT", label: "Draft" },
            { value: "TRASH", label: "Trash" },
        ],
        placeholder: "Select the post status",
        required: true,
    };
    return {
        title,
        content,
        categoryId,
        authorId,
        slug,
        description,
        status,
    };
};
exports.postStructure = postStructure;
exports.default = async () => {
    const { title, content, categoryId, authorId, slug, description, status } = await (0, exports.postStructure)();
    return {
        set: [title, content, categoryId, authorId, slug, description, status],
    };
};
