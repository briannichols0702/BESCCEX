"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
const db_1 = require("@b/db");
exports.metadata = {
    summary: "Retrieves detailed information of a specific Mailwizard Campaign by ID",
    operationId: "getMailwizardCampaignById",
    tags: ["Admin", "Marketing", "Mailwizard Campaigns"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            required: true,
            description: "ID of the Mailwizard Campaign to retrieve",
            schema: { type: "string" },
        },
    ],
    responses: {
        200: {
            description: "Mailwizard Campaign details",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: utils_1.baseMailwizardCampaignSchema, // Define this schema in your utils if it's not already defined
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("Mailwizard Campaign"),
        500: query_1.serverErrorResponse,
    },
    permission: "Access Mailwizard Campaign Management",
    requiresAuth: true,
};
exports.default = async (data) => {
    const { params } = data;
    return await (0, query_1.getRecord)("mailwizardCampaign", params.id, [
        {
            model: db_1.models.mailwizardTemplate,
            as: "template",
            attributes: ["id", "name"],
        },
    ]);
};
