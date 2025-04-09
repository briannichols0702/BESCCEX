"use strict";
// /api/icoProjects/structure.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.icoProjectStructure = exports.metadata = void 0;
const constants_1 = require("@b/utils/constants");
const structure_1 = require("@b/utils/schema/structure");
exports.metadata = {
    summary: "Get form structure for ICO Projects",
    operationId: "getIcoProjectStructure",
    tags: ["Admin", "ICO Projects"],
    responses: {
        200: {
            description: "Form structure for managing ICO Projects",
            content: constants_1.structureSchema,
        },
    },
    permission: "Access ICO Project Management"
};
const icoProjectStructure = () => {
    const name = {
        type: "input",
        label: "Name",
        name: "name",
        placeholder: "Enter the project name",
        component: "InfoBlock",
        icon: "material-symbols-light:title",
    };
    const description = {
        type: "textarea",
        label: "Description",
        name: "description",
        placeholder: "Enter the project description",
    };
    const website = {
        type: "input",
        label: "Website",
        name: "website",
        placeholder: "Enter the project website URL",
        component: "InfoBlock",
        icon: "ph:link",
    };
    const whitepaper = {
        type: "textarea",
        label: "Whitepaper",
        name: "whitepaper",
        placeholder: "Provide the whitepaper text or URL",
    };
    const status = {
        type: "select",
        label: "Status",
        name: "status",
        options: [
            { value: "PENDING", label: "Pending" },
            { value: "ACTIVE", label: "Active" },
            { value: "COMPLETED", label: "Completed" },
            { value: "REJECTED", label: "Rejected" },
            { value: "CANCELLED", label: "Cancelled" },
        ],
        placeholder: "Select the project status",
    };
    return {
        name,
        description,
        website,
        whitepaper,
        status,
    };
};
exports.icoProjectStructure = icoProjectStructure;
exports.default = () => {
    const { name, description, website, whitepaper, status } = (0, exports.icoProjectStructure)();
    return {
        get: [
            {
                fields: [
                    {
                        ...structure_1.imageStructureLg,
                        width: 350,
                        height: 262,
                    },
                    {
                        fields: [name, website],
                        grid: "column",
                    },
                ],
                className: "card-dashed mb-3 items-center",
            },
            description,
            whitepaper,
            status,
        ],
        set: [structure_1.imageStructureLg, [name, website], description, whitepaper, status],
    };
};
