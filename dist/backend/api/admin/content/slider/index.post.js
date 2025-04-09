"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("./utils");
exports.metadata = {
    summary: "Stores a new Slider",
    operationId: "storeSlider",
    tags: ["Admin", "Sliders"],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: utils_1.sliderSchema,
                    required: ["image"],
                },
            },
        },
    },
    responses: (0, query_1.storeRecordResponses)(utils_1.sliderSchema, "Slider"),
    requiresAuth: true,
    permission: "Access Slider Management",
};
exports.default = async (data) => {
    const { body } = data;
    const { image, link, status } = body;
    return (0, query_1.storeRecord)({
        model: "slider",
        data: {
            image,
            link,
            status,
        },
        returnResponse: true,
    });
};
