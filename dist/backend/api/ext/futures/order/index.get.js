"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("./utils");
const error_1 = require("@b/utils/error");
const order_1 = require("@b/utils/futures/queries/order");
exports.metadata = {
    summary: "List Futures Orders",
    operationId: "listFuturesOrders",
    tags: ["Futures", "Orders"],
    description: "Retrieves a list of futures orders for the authenticated user.",
    parameters: [
        {
            name: "currency",
            in: "query",
            description: "Currency of the orders to retrieve.",
            schema: { type: "string" },
        },
        {
            name: "pair",
            in: "query",
            description: "Pair of the orders to retrieve.",
            schema: { type: "string" },
        },
        {
            name: "type",
            in: "query",
            description: "Type of order to retrieve.",
            schema: { type: "string" },
        },
    ],
    responses: {
        200: {
            description: "A list of futures orders",
            content: {
                "application/json": {
                    schema: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: utils_1.baseOrderSchema,
                        },
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("Order"),
        500: query_1.serverErrorResponse,
    },
    requiresAuth: true,
};
exports.default = async (data) => {
    const { user } = data;
    if (!(user === null || user === void 0 ? void 0 : user.id))
        throw new Error("Unauthorized");
    const { currency, pair, type } = data.query;
    if (!(user === null || user === void 0 ? void 0 : user.id)) {
        throw (0, error_1.createError)({ statusCode: 401, message: "Unauthorized" });
    }
    return await (0, order_1.getOrders)(user.id, `${currency}/${pair}`, type === "OPEN");
};
