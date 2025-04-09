"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const constants_1 = require("@b/utils/constants");
const query_1 = require("@b/utils/query");
const sliderSchema = {
    id: { type: "string", format: "uuid" },
    image: { type: "string" },
    link: { type: "string", nullable: true },
    status: { type: "boolean", nullable: true },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
    deletedAt: { type: "string", format: "date-time", nullable: true },
};
exports.metadata = {
    summary: "Lists all Sliders with pagination and optional filtering",
    operationId: "listSliders",
    tags: ["Admin", "Sliders"],
    parameters: constants_1.crudParameters,
    responses: {
        200: {
            description: "List of Sliders with pagination information",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            data: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: sliderSchema,
                                },
                            },
                            pagination: constants_1.paginationSchema,
                        },
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("Sliders"),
        500: query_1.serverErrorResponse,
    },
    requiresAuth: true,
    permission: "Access Slider Management",
};
exports.default = async (data) => {
    const { query } = data;
    // Using the getFiltered function which processes all CRUD parameters, including sorting and filtering
    return (0, query_1.getFiltered)({
        model: db_1.models.slider,
        query,
        sortField: query.sortField || "createdAt",
    });
};
