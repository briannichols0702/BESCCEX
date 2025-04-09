"use strict";
// /api/admin/authors/structure.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorStructure = exports.metadata = void 0;
const constants_1 = require("@b/utils/constants");
exports.metadata = {
    summary: "Get form structure for Authors",
    operationId: "getAuthorStructure",
    tags: ["Admin", "Content", "Author"],
    responses: {
        200: {
            description: "Form structure for managing Authors",
            content: constants_1.structureSchema,
        },
    },
};
const authorStructure = async () => {
    const status = {
        type: "select",
        label: "Status",
        name: "status",
        options: [
            { value: "PENDING", label: "Pending" },
            { value: "APPROVED", label: "Approved" },
            { value: "REJECTED", label: "Rejected" },
        ],
        placeholder: "Access Author Management",
    };
    return {
        status,
    };
};
exports.authorStructure = authorStructure;
exports.default = async () => {
    const { status } = await (0, exports.authorStructure)();
    return {
        set: [status],
    };
};
