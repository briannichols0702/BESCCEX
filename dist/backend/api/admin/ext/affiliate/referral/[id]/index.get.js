"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
const db_1 = require("@b/db");
exports.metadata = {
    summary: "Retrieves detailed information of a specific MLM Referral by ID",
    operationId: "getMlmReferralById",
    tags: ["Admin", "MLM", "Referrals"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            required: true,
            description: "ID of the MLM Referral to retrieve",
            schema: { type: "string" },
        },
    ],
    responses: {
        200: {
            description: "MLM Referral details",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: utils_1.baseMlmReferralSchema,
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("MLM Referral"),
        500: query_1.serverErrorResponse,
    },
    permission: "Access MLM Referral Management",
    requiresAuth: true,
};
exports.default = async (data) => {
    const { params } = data;
    return await (0, query_1.getRecord)("mlmReferral", params.id, [
        {
            model: db_1.models.user,
            as: "referrer",
            attributes: ["firstName", "lastName", "email", "avatar"],
        },
        {
            model: db_1.models.user,
            as: "referred",
            attributes: ["firstName", "lastName", "email", "avatar"],
        },
    ]);
};
