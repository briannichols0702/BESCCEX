"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.holdersController = exports.metadata = void 0;
const error_1 = require("@b/utils/error");
const utils_1 = require("../utils");
const tokens_1 = require("@b/utils/eco/tokens");
exports.metadata = {
    summary: "Fetches holders of a specific ecosystem token",
    description: "Retrieves a list of all holders of a specified token on a specific chain.",
    operationId: "fetchTokenHolders",
    tags: ["Admin", "Ecosystem", "Token Holders"],
    parameters: [
        {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", description: "Token identifier" },
        },
    ],
    responses: {
        200: {
            description: "Token holders fetched successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            token: {
                                type: "object",
                                properties: {
                                    id: { type: "string", description: "Token identifier" },
                                    name: { type: "string", description: "Token name" },
                                    contract: {
                                        type: "string",
                                        description: "Token contract address",
                                    },
                                },
                            },
                            holders: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        address: {
                                            type: "string",
                                            description: "Holder's wallet address",
                                        },
                                        balance: {
                                            type: "string",
                                            description: "Amount of tokens held",
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        404: {
            description: "Token not found",
        },
        500: {
            description: "Internal server error",
        },
    },
    permission: "Access Ecosystem Token Management",
};
const holdersController = async (data) => {
    const { user, params } = data;
    if (!(user === null || user === void 0 ? void 0 : user.id)) {
        throw (0, error_1.createError)({ statusCode: 401, message: "Unauthorized" });
    }
    try {
        const { id } = params;
        const token = await (0, utils_1.getEcosystemTokenById)(id);
        if (!token) {
            throw new Error(`Token not found for id: ${id}`);
        }
        const holders = await (0, tokens_1.fetchTokenHolders)(token.chain, token.network, token.contract);
        return {
            token,
            holders,
        };
    }
    catch (error) {
        throw (0, error_1.createError)({
            statusCode: 500,
            message: `Failed to fetch token holders: ${error.message}`,
        });
    }
};
exports.holdersController = holdersController;
