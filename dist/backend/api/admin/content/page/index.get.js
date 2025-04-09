"use strict";
// /server/api/admin/pages/index.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const query_1 = require("@b/utils/query");
const constants_1 = require("@b/utils/constants");
const utils_1 = require("./utils");
exports.metadata = {
    summary: "List all pages",
    operationId: "listPages",
    tags: ["Admin", "Content", "Page"],
    parameters: constants_1.crudParameters,
    responses: {
        200: {
            description: "Pages retrieved successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            data: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: utils_1.basePageSchema,
                                },
                            },
                            pagination: constants_1.paginationSchema,
                        },
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("Pages"),
        500: query_1.serverErrorResponse,
    },
    permission: "Access Page Management",
    requiresAuth: true,
};
exports.default = async (data) => {
    const { query } = data;
    return (0, query_1.getFiltered)({
        model: db_1.models.page,
        query,
        sortField: query.sortField || "createdAt",
    });
};
