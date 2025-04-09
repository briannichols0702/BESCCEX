"use strict";
// /api/forexSignals/structure.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.forexSignalStructure = exports.metadata = void 0;
const constants_1 = require("@b/utils/constants");
const structure_1 = require("@b/utils/schema/structure");
exports.metadata = {
    summary: "Get form structure for Forex Signals",
    operationId: "getForexSignalStructure",
    tags: ["Admin", "Forex Signals"],
    responses: {
        200: {
            description: "Form structure for managing Forex Signals",
            content: constants_1.structureSchema,
        },
    },
    permission: "Access Forex Signal Management",
};
const forexSignalStructure = () => {
    const title = {
        type: "input",
        label: "Title",
        name: "title",
        component: "InfoBlock",
        icon: "material-symbols-light:title",
        placeholder: "Enter the title of the signal",
    };
    const status = {
        type: "select",
        label: "Status",
        name: "status",
        options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
        ],
        ts: "boolean",
    };
    return {
        title,
        status,
    };
};
exports.forexSignalStructure = forexSignalStructure;
exports.default = () => {
    const { title, status } = (0, exports.forexSignalStructure)();
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
                        fields: [title],
                        grid: "column",
                    },
                ],
                className: "card-dashed mb-3 items-center",
            },
            status,
        ],
        set: [structure_1.imageStructure, title, status],
    };
};
