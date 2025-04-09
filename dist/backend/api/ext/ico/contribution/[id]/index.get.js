"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const error_1 = require("@b/utils/error");
const query_1 = require("@b/utils/query");
const utils_1 = require("../../utils");
exports.metadata = {
    summary: "Retrieves a specific ICO contribution",
    description: "Fetches details of a specific ICO contribution by ID.",
    operationId: "getIcoContribution",
    tags: ["ICO", "Contributions"],
    parameters: [
        {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", description: "Contribution ID" },
        },
    ],
    responses: {
        200: {
            description: "Contribution retrieved successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: utils_1.baseIcoContributionSchema,
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("Ico Contribution"),
        500: query_1.serverErrorResponse,
    },
};
exports.default = async (data) => {
    const { params } = data;
    try {
        const contribution = await db_1.models.icoContribution.findByPk(params.id, {
            include: [
                {
                    model: db_1.models.icoPhase,
                    as: "phase",
                    include: [
                        {
                            model: db_1.models.icoToken,
                            as: "token",
                        },
                    ],
                },
            ],
        });
        if (!contribution) {
            return {
                statusCode: 404,
                message: "Contribution not found",
            };
        }
        return contribution;
    }
    catch (error) {
        throw (0, error_1.createError)({
            statusCode: 500,
            message: `Failed to fetch contribution details: ${error.message}`,
        });
    }
};
