"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
exports.metadata = {
    summary: "Updates a specific ICO Project",
    operationId: "updateIcoProject",
    tags: ["Admin", "ICO Projects"],
    parameters: [
        {
            name: "id",
            in: "path",
            description: "ID of the ICO Project to update",
            required: true,
            schema: {
                type: "string",
            },
        },
    ],
    requestBody: {
        description: "New data for the ICO Project",
        content: {
            "application/json": {
                schema: utils_1.icoProjectUpdateSchema,
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("ICO Project"),
    requiresAuth: true,
    permission: "Access ICO Project Management",
};
exports.default = async (data) => {
    const { body, params } = data;
    const { id } = params;
    const { name, description, website, whitepaper, image, status } = body;
    return await (0, query_1.updateRecord)("icoProject", id, {
        name,
        description,
        website,
        whitepaper,
        image,
        status,
    });
};
