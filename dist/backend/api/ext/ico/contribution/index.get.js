"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const error_1 = require("@b/utils/error");
const query_1 = require("@b/utils/query");
const utils_1 = require("@b/api/admin/ext/ico/contribution/utils");
const constants_1 = require("@b/utils/constants");
exports.metadata = {
    summary: "Retrieves all contributions made by a user",
    description: "Fetches a list of all contributions made by the currently logged-in user.",
    operationId: "listUserContributions",
    tags: ["ICO", "Contributions"],
    requiresAuth: true,
    parameters: constants_1.crudParameters,
    responses: {
        200: {
            description: "List of ICO Contributions with pagination information",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            data: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: utils_1.icoContributionSchema,
                                },
                            },
                            pagination: constants_1.paginationSchema,
                        },
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("ICO Contributions"),
        500: query_1.serverErrorResponse,
    },
};
exports.default = async (data) => {
    const { user, query } = data;
    if (!(user === null || user === void 0 ? void 0 : user.id)) {
        throw (0, error_1.createError)({ statusCode: 401, message: "Unauthorized" });
    }
    // Call the generic fetch function
    return (0, query_1.getFiltered)({
        model: db_1.models.icoContribution,
        query,
        sortField: query.sortField || "createdAt",
        where: { userId: user.id },
        includeModels: [
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
        ],
        numericFields: ["amount"],
    });
};
