"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
const db_1 = require("@b/db");
exports.metadata = {
    summary: "Retrieves detailed information of a specific ICO contribution by ID",
    operationId: "getIcoContributionById",
    tags: ["Admin", "ICO Contributions"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            required: true,
            description: "ID of the ICO contribution to retrieve",
            schema: { type: "string" },
        },
    ],
    responses: {
        200: {
            description: "ICO contribution details",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: utils_1.baseIcoContributionSchema, // Define this schema in your utils if it's not already defined
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("ICO Contribution"),
        500: query_1.serverErrorResponse,
    },
    permission: "Access ICO Contribution Management",
    requiresAuth: true,
};
exports.default = async (data) => {
    const { params } = data;
    return await (0, query_1.getRecord)("icoContribution", params.id, [
        {
            model: db_1.models.user,
            as: "user",
            attributes: ["firstName", "lastName", "email", "avatar"],
        },
        {
            model: db_1.models.icoPhase,
            as: "phase",
            attributes: ["id", "name"],
            includeModels: [
                {
                    model: db_1.models.icoToken,
                    as: "token",
                    attributes: ["name", "currency", "chain", "image"],
                },
            ],
        },
    ]);
};
