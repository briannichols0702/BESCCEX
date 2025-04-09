"use strict";
// /server/api/kyc-template/index.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActiveKycTemplate = exports.metadata = void 0;
const db_1 = require("@b/db");
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Lists the active KYC template",
    description: "Fetches the currently active KYC (Know Your Customer) template that is used for KYC processes. This endpoint is accessible without authentication and returns the template that is marked as active in the system.",
    operationId: "getActiveKycTemplate",
    tags: ["KYC"],
    responses: {
        200: {
            description: "Active KYC template retrieved successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            id: { type: "number", description: "Template ID" },
                            title: { type: "string", description: "Template title" },
                            options: {
                                type: "object",
                                description: "Template options as JSON object",
                                nullable: true,
                            },
                            status: {
                                type: "boolean",
                                description: "Active status of the template",
                            },
                        },
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("Kyc Template"),
        500: query_1.serverErrorResponse,
    },
    requiresAuth: false,
};
exports.default = async () => {
    return getActiveKycTemplate();
};
async function getActiveKycTemplate() {
    const response = await db_1.models.kycTemplate.findOne({
        where: {
            status: true,
        },
    });
    if (!response) {
        throw new Error("No active KYC template found");
    }
    return response.get({ plain: true });
}
exports.getActiveKycTemplate = getActiveKycTemplate;
