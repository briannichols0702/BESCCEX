"use strict";
// /server/api/mlm/referrals/index.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const utils_1 = require("@b/api/admin/ext/affiliate/referral/utils");
const db_1 = require("@b/db");
const constants_1 = require("@b/utils/constants");
const error_1 = require("@b/utils/error");
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Lists all MLM Referrals with pagination and optional filtering",
    operationId: "listMlmReferrals",
    tags: ["MLM", "Referrals"],
    parameters: constants_1.crudParameters,
    responses: {
        200: {
            description: "List of MLM Referrals with pagination information",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            data: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: utils_1.mlmReferralSchema,
                                },
                            },
                            pagination: constants_1.paginationSchema,
                        },
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("MLM Referrals"),
        500: query_1.serverErrorResponse,
    },
    requiresAuth: true,
};
exports.default = async (data) => {
    const { user, query } = data;
    if (!(user === null || user === void 0 ? void 0 : user.id))
        throw (0, error_1.createError)({ statusCode: 401, message: "Unauthorized" });
    // Call the generic fetch function
    return (0, query_1.getFiltered)({
        model: db_1.models.mlmReferral,
        query,
        where: { referrerId: user.id },
        sortField: query.sortField || "createdAt",
        includeModels: [
            {
                model: db_1.models.user,
                as: "referred",
                attributes: ["firstName", "lastName", "email", "avatar"],
            },
        ],
    });
};
