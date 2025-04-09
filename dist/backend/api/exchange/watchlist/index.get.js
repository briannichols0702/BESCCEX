"use strict";
// /server/api/exchange/watchlist/index.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const error_1 = require("@b/utils/error");
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
exports.metadata = {
    summary: "List Watchlist Items",
    operationId: "listWatchlistItems",
    tags: ["Exchange", "Watchlist"],
    description: "Retrieves a list of watchlist items for the authenticated user.",
    responses: {
        200: {
            description: "A list of watchlist items",
            content: {
                "application/json": {
                    schema: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: utils_1.baseWatchlistItemSchema,
                        },
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("Watchlist"),
        500: query_1.serverErrorResponse,
    },
    requiresAuth: true,
};
exports.default = async (data) => {
    const { user } = data;
    if (!(user === null || user === void 0 ? void 0 : user.id))
        throw (0, error_1.createError)({ statusCode: 401, message: "Unauthorized" });
    return (await db_1.models.exchangeWatchlist.findAll({
        where: {
            userId: user.id,
        },
    })).map((watchlist) => watchlist.get({ plain: true }));
};
