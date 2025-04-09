"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const error_1 = require("@b/utils/error");
const utils_1 = require("../../wallet/utils");
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Unlocks a specific deposit address",
    description: "Allows administrative unlocking of a custodial wallet deposit address to make it available for reuse.",
    operationId: "unlockDepositAddress",
    tags: ["Wallet", "Deposit"],
    parameters: [
        {
            name: "address",
            in: "query",
            description: "The deposit address to unlock",
            required: true,
            schema: {
                type: "string",
            },
        },
    ],
    responses: {
        200: {
            description: "Deposit address unlocked successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            message: {
                                type: "string",
                                description: "Success message indicating the address has been unlocked.",
                            },
                        },
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("Wallet"),
        500: query_1.serverErrorResponse,
    },
    requiresAuth: true,
};
exports.default = async (data) => {
    const { query, user } = data;
    if (!(user === null || user === void 0 ? void 0 : user.id)) {
        throw (0, error_1.createError)({ statusCode: 401, message: "Unauthorized" });
    }
    const { address } = query;
    (0, utils_1.unlockAddress)(address);
    return { message: "Address unlocked successfully" };
};
