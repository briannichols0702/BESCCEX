"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
exports.metadata = {
    summary: "Updates a specific Slider",
    operationId: "updateSlider",
    tags: ["Admin", "Sliders"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            description: "ID of the Slider to update",
            required: true,
            schema: {
                type: "string",
            },
        },
    ],
    requestBody: {
        description: "New data for the Slider",
        content: {
            "application/json": {
                schema: utils_1.sliderUpdateSchema,
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("Slider"),
    requiresAuth: true,
    permission: "Access Slider Management",
};
exports.default = async (data) => {
    const { body, params } = data;
    const { id } = params;
    const { image, link, status } = body;
    return (0, query_1.updateRecord)("slider", id, {
        image,
        link,
        status,
    });
};
