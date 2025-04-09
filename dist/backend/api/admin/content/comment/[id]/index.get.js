"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
exports.metadata = {
    summary: "Retrieves detailed information of a specific comment by ID",
    operationId: "getCommentById",
    tags: ["Admin", "Content", "Comment"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            required: true,
            description: "ID of the comment to retrieve",
            schema: { type: "string" },
        },
    ],
    responses: {
        200: {
            description: "Comment details",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: utils_1.baseCommentSchema, // Define this schema in your utils if it's not already defined
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("Comment"),
        500: query_1.serverErrorResponse,
    },
    permission: "Access Comment Management",
    requiresAuth: true,
};
exports.default = async (data) => {
    const { params } = data;
    return await (0, query_1.getRecord)("comment", params.id);
};
