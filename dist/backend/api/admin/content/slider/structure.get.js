"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sliderStructure = exports.metadata = void 0;
const constants_1 = require("@b/utils/constants");
const structure_1 = require("@b/utils/schema/structure");
exports.metadata = {
    summary: "Get form structure for Sliders",
    operationId: "getSliderStructure",
    tags: ["Admin", "Sliders"],
    responses: {
        200: {
            description: "Form structure for managing Sliders",
            content: constants_1.structureSchema,
        },
    },
    permission: "Access Slider Management",
};
const sliderStructure = async () => {
    const image = {
        type: "input",
        label: "Image",
        name: "image",
        placeholder: "Enter the image URL",
    };
    const link = {
        type: "input",
        label: "Link",
        name: "link",
        placeholder: "Enter the link URL",
    };
    const status = {
        type: "select",
        label: "Status",
        name: "status",
        placeholder: "Select the status of the slider",
        options: [
            { label: "Active", value: true },
            { label: "Disabled", value: false },
        ],
        ts: "boolean",
    };
    return {
        image,
        link,
        status,
    };
};
exports.sliderStructure = sliderStructure;
exports.default = async () => {
    const { image, link, status } = await (0, exports.sliderStructure)();
    return {
        get: [structure_1.imageStructureLg, link, status],
        set: [structure_1.imageStructureLg, [link, status]],
    };
};
