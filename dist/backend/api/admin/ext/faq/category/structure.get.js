"use strict";
// /api/admin/faqCategories/structure.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.faqCategoryStructure = exports.metadata = void 0;
const constants_1 = require("@b/utils/constants");
exports.metadata = {
    summary: "Get form structure for FAQ Categories",
    operationId: "getFaqCategoryStructure",
    tags: ["Admin", "FAQ Categories"],
    responses: {
        200: {
            description: "Form structure for managing FAQ Categories",
            content: constants_1.structureSchema,
        },
    },
    permission: "Access FAQ Category Management",
};
const faqCategoryStructure = () => {
    const id = {
        type: "input",
        label: "ID",
        name: "id",
        placeholder: "Enter a unique id for the FAQ category",
    };
    return {
        id,
    };
};
exports.faqCategoryStructure = faqCategoryStructure;
exports.default = () => {
    const { id } = (0, exports.faqCategoryStructure)();
    return {
        get: [id],
        set: [id],
    };
};
