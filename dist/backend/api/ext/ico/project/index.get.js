"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
// Metadata and controller for fetching all ICO projects
exports.metadata = {
    summary: "Retrieves all ICO projects",
    description: "Fetches a list of all ICO projects available.",
    operationId: "listIcoProjects",
    tags: ["ICO", "Projects"],
    responses: {
        200: {
            description: "ICO projects retrieved successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: utils_1.baseIcoProjectSchema,
                        },
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("Ico Project"),
        500: query_1.serverErrorResponse,
    },
};
exports.default = async (data) => {
    const projects = await db_1.models.icoProject.findAll({
        where: { status: "ACTIVE" },
    });
    return projects;
};
