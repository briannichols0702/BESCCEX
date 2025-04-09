"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const error_1 = require("@b/utils/error");
const positions_1 = require("@b/utils/futures/queries/positions");
const blockchain_1 = require("@b/utils/eco/blockchain");
exports.metadata = {
    summary: "List Futures Positions",
    operationId: "listFuturesPositions",
    tags: ["Futures", "Positions"],
    description: "Retrieves a list of futures positions for the authenticated user.",
    parameters: [
        {
            name: "currency",
            in: "query",
            description: "Currency of the positions to retrieve.",
            schema: { type: "string" },
        },
        {
            name: "pair",
            in: "query",
            description: "Pair of the positions to retrieve.",
            schema: { type: "string" },
        },
        {
            name: "type",
            in: "query",
            description: "Type of positions to retrieve.",
            schema: { type: "string" },
        },
    ],
    responses: {
        200: {
            description: "A list of futures positions",
            content: {
                "application/json": {
                    schema: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                id: { type: "string" },
                                userId: { type: "string" },
                                symbol: { type: "string" },
                                side: { type: "string" },
                                entryPrice: { type: "string" },
                                amount: { type: "string" },
                                leverage: { type: "string" },
                                unrealizedPnl: { type: "string" },
                                status: { type: "string" },
                                createdAt: { type: "string", format: "date-time" },
                                updatedAt: { type: "string", format: "date-time" },
                            },
                        },
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("Position"),
        500: query_1.serverErrorResponse,
    },
    requiresAuth: true,
};
exports.default = async (data) => {
    const { user } = data;
    if (!(user === null || user === void 0 ? void 0 : user.id))
        throw (0, error_1.createError)({ statusCode: 401, message: "Unauthorized" });
    const { currency, pair, type } = data.query;
    try {
        const symbol = currency && pair ? `${currency}/${pair}` : undefined;
        const status = type === "OPEN_POSITIONS" ? "OPEN" : undefined;
        const positions = await (0, positions_1.getPositions)(user.id, symbol, status);
        if (!positions || positions.length === 0) {
            return [];
        }
        const result = positions.map((position) => ({
            ...position,
            entryPrice: (0, blockchain_1.fromBigInt)(position.entryPrice),
            amount: (0, blockchain_1.fromBigInt)(position.amount),
            leverage: position.leverage,
            unrealizedPnl: (0, blockchain_1.fromBigInt)(position.unrealizedPnl),
            createdAt: position.createdAt.toISOString(),
            updatedAt: position.updatedAt.toISOString(),
        }));
        if (type === "POSITIONS_HISTORY") {
            return result.filter((position) => position.status !== "OPEN");
        }
        return result;
    }
    catch (error) {
        throw (0, error_1.createError)({
            statusCode: 500,
            message: `Failed to retrieve positions: ${error.message}`,
        });
    }
};
