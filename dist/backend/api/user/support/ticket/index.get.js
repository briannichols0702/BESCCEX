"use strict";
// /server/api/support/tickets/index.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const query_1 = require("@b/utils/query");
const constants_1 = require("@b/utils/constants");
const utils_1 = require("./utils");
const error_1 = require("@b/utils/error");
exports.metadata = {
    summary: "Lists all tickets for the logged-in user",
    operationId: "listTickets",
    tags: ["Support"],
    description: "Fetches all support tickets associated with the currently authenticated user.",
    parameters: constants_1.crudParameters,
    responses: {
        200: {
            description: "Posts retrieved successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            data: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: utils_1.baseSupportTicketSchema,
                                },
                            },
                            pagination: constants_1.paginationSchema,
                        },
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("Support Ticket"),
        500: query_1.serverErrorResponse,
    },
    requiresAuth: true,
};
exports.default = async (data) => {
    const { user, query } = data;
    if (!(user === null || user === void 0 ? void 0 : user.id))
        throw (0, error_1.createError)({ statusCode: 401, message: "Unauthorized" });
    return (0, query_1.getFiltered)({
        model: db_1.models.supportTicket,
        query,
        sortField: query.sortField || "createdAt",
        where: { userId: user.id },
        includeModels: [
            {
                model: db_1.models.user,
                as: "user",
                attributes: ["firstName", "lastName", "email", "avatar"],
            },
            {
                model: db_1.models.user,
                as: "agent",
                attributes: ["firstName", "lastName", "email", "avatar"],
            },
        ],
    });
};
