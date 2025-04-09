"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Deletes a slider",
    operationId: "deleteSlider",
    tags: ["Admin", "Sliders"],
    parameters: (0, query_1.deleteRecordParams)("slider"),
    responses: (0, query_1.deleteRecordResponses)("Slider"),
    permission: "Access Slider Management",
    requiresAuth: true,
};
exports.default = async (data) => {
    const { params, query } = data;
    const { id } = params;
    return (0, query_1.handleSingleDelete)({
        model: "slider",
        id,
        query,
    });
};
