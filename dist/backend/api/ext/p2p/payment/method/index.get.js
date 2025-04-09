"use strict";
// /server/api/admin/p2p/payment_methods/index.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const query_1 = require("@b/utils/query");
const constants_1 = require("@b/utils/constants");
const utils_1 = require("./utils");
const error_1 = require("@b/utils/error");
exports.metadata = {
    summary: "List all P2P payment methods",
    operationId: "listP2PPaymentMethods",
    tags: ["P2P", "Payment Methods"],
    parameters: constants_1.crudParameters,
    responses: {
        200: {
            description: "List of P2P offers with pagination information",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            data: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: utils_1.baseP2pPaymentMethodSchema,
                                },
                            },
                            pagination: constants_1.paginationSchema,
                        },
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("P2P Payment Methods"),
        500: query_1.serverErrorResponse,
    },
    requiresAuth: true,
};
exports.default = async (data) => {
    const { user, query } = data;
    if (!(user === null || user === void 0 ? void 0 : user.id))
        throw (0, error_1.createError)(401, "Unauthorized");
    return (0, query_1.getFiltered)({
        model: db_1.models.p2pPaymentMethod,
        query,
        where: { userId: user.id },
        sortField: query.sortField || "createdAt",
    });
};
