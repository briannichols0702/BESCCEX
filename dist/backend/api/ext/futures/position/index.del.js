"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const error_1 = require("@b/utils/error");
const blockchain_1 = require("@b/utils/eco/blockchain");
const wallet_1 = require("@b/utils/eco/wallet");
const query_1 = require("@b/utils/query");
const positions_1 = require("@b/utils/futures/queries/positions");
const utils_1 = require("@b/api/finance/wallet/utils");
exports.metadata = {
    summary: "Closes an open futures position",
    description: "Closes an open futures position for the logged-in user.",
    operationId: "closeFuturesPosition",
    tags: ["Futures", "Positions"],
    parameters: [
        {
            name: "id",
            in: "path",
            required: true,
            schema: {
                type: "string",
                description: "ID of the position to close",
            },
        },
    ],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        currency: {
                            type: "string",
                            description: "Currency symbol (e.g., BTC)",
                        },
                        pair: { type: "string", description: "Pair symbol (e.g., USDT)" },
                        side: {
                            type: "string",
                            description: "Position side, either buy or sell",
                        },
                    },
                    required: ["currency", "pair", "side"],
                },
            },
        },
    },
    responses: {
        200: {
            description: "Position closed successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            message: { type: "string", description: "Success message" },
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
    const { body, user } = data;
    if (!(user === null || user === void 0 ? void 0 : user.id)) {
        throw (0, error_1.createError)({ statusCode: 401, message: "Unauthorized" });
    }
    const { currency, pair, side } = body;
    if (!currency || !pair || !side) {
        throw (0, error_1.createError)({
            statusCode: 400,
            message: "Invalid request parameters",
        });
    }
    const symbol = `${currency}/${pair}`;
    try {
        const position = await (0, positions_1.getPosition)(user.id, symbol, side);
        if (!position) {
            throw (0, error_1.createError)({
                statusCode: 404,
                message: "Position not found",
            });
        }
        if (position.status !== "OPEN") {
            throw (0, error_1.createError)({
                statusCode: 400,
                message: "Position is not open",
            });
        }
        const finalBalanceChange = calculateFinalBalanceChange(position);
        const wallet = await (0, utils_1.getWallet)(position.userId, "FUTURES", symbol.split("/")[1]);
        if (wallet) {
            if (finalBalanceChange > 0) {
                await (0, wallet_1.updateWalletBalance)(wallet, finalBalanceChange, "add");
            }
            else {
                await (0, wallet_1.updateWalletBalance)(wallet, Math.abs(finalBalanceChange), "subtract");
            }
        }
        await (0, positions_1.updatePositionStatus)(position.userId, position.id, "CLOSED");
        return { message: "Position closed and balance updated successfully" };
    }
    catch (error) {
        throw (0, error_1.createError)({
            statusCode: 500,
            message: `Failed to close position: ${error.message}`,
        });
    }
};
const calculateFinalBalanceChange = (position) => {
    const entryPrice = (0, blockchain_1.fromBigInt)(position.entryPrice);
    const amount = (0, blockchain_1.fromBigInt)(position.amount);
    const unrealizedPnl = (0, blockchain_1.fromBigInt)(position.unrealizedPnl); // Ensure PnL is a number
    const investedAmount = entryPrice * amount;
    const finalBalanceChange = investedAmount + unrealizedPnl;
    return finalBalanceChange;
};
