"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const utils_1 = require("../utils");
const query_1 = require("@b/utils/query");
const Websocket_1 = require("@b/handler/Websocket");
exports.metadata = {
    summary: "Resolve a P2P dispute",
    description: "Updates the status and resolution of a specified P2P dispute.",
    operationId: "resolveDispute",
    tags: ["Admin", "P2P", "Dispute"],
    parameters: [
        {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "number", description: "Dispute ID" },
        },
    ],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        resolution: {
                            type: "string",
                            description: "Resolution details for the dispute",
                        },
                    },
                    required: ["resolution"],
                },
            },
        },
    },
    responses: {
        200: {
            description: "Dispute resolved successfully",
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
        404: (0, query_1.notFoundMetadataResponse)("P2P Dispute"),
        500: query_1.serverErrorResponse,
    },
    requiresAuth: true,
    permission: "Access P2P Dispute Management",
};
exports.default = async (data) => {
    const { params, body } = data;
    const { id } = params;
    const { resolution } = body;
    await db_1.sequelize.transaction(async (transaction) => {
        const dispute = await db_1.models.p2pDispute.findByPk(id, {
            include: [
                {
                    model: db_1.models.p2pTrade,
                    as: "trade",
                    include: [
                        {
                            model: db_1.models.user,
                            as: "user",
                            attributes: ["id", "email", "lastName", "avatar", "firstName"],
                        },
                        {
                            model: db_1.models.user,
                            as: "seller",
                            attributes: ["id", "email", "lastName", "avatar", "firstName"],
                        },
                    ],
                },
                {
                    model: db_1.models.user,
                    as: "raisedBy",
                    attributes: ["id", "email", "firstName", "lastName", "avatar"],
                },
            ],
            transaction,
        });
        if (!dispute) {
            throw new Error("Dispute not found");
        }
        await dispute.update({
            resolution,
            status: "OPEN",
        }, {
            transaction,
        });
        try {
            await (0, utils_1.sendP2PDisputeResolutionEmail)(dispute.raisedBy, dispute.trade, resolution);
            const otherParty = dispute.trade.user.id === dispute.raisedBy.id
                ? dispute.trade.seller
                : dispute.trade.user;
            await (0, utils_1.sendP2PDisputeResolvingEmail)(otherParty, dispute.trade);
        }
        catch (error) {
            console.error(`Failed to send email: ${error.message}`);
        }
        (0, Websocket_1.sendMessageToRoute)(`/api/ext/p2p/trade`, { id }, {
            data: {
                p2pDisputes: [
                    {
                        ...dispute.get({ plain: true }),
                        resolution,
                        status: "OPEN",
                    },
                ],
                updatedAt: new Date(),
            },
        });
    });
    return { message: "Dispute resolved successfully" };
};
