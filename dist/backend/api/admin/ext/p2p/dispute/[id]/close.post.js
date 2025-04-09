"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const utils_1 = require("../utils");
const query_1 = require("@b/utils/query");
const Websocket_1 = require("@b/handler/Websocket");
exports.metadata = {
    summary: "Close a P2P dispute",
    description: "Updates the status of a specified P2P dispute to RESOLVED and closes the dispute.",
    operationId: "closeDispute",
    tags: ["Admin", "P2P", "Dispute"],
    parameters: [
        {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "number", description: "Dispute ID" },
        },
    ],
    responses: {
        200: {
            description: "Dispute closed successfully",
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
    const { params } = data;
    const { id } = params;
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
                            attributes: ["id", "firstName", "lastName", "avatar", "email"],
                        },
                        {
                            model: db_1.models.user,
                            as: "seller",
                            attributes: ["id", "firstName", "lastName", "avatar", "email"],
                        },
                    ],
                },
                {
                    model: db_1.models.user,
                    as: "raisedBy",
                    attributes: ["id", "email", "firstName", "lastName"],
                },
            ],
            transaction,
        });
        if (!dispute)
            throw new Error("Dispute not found");
        if (dispute.trade.status === "DISPUTE_OPEN") {
            await db_1.models.p2pTrade.update({
                status: "PAID",
            }, {
                where: { id: dispute.trade.id },
                transaction,
            });
        }
        await dispute.update({
            status: "RESOLVED",
        }, {
            transaction,
        });
        try {
            const user = dispute.trade.user;
            const seller = dispute.trade.seller;
            await (0, utils_1.sendP2PDisputeClosingEmail)(user, dispute.trade);
            await (0, utils_1.sendP2PDisputeClosingEmail)(seller, dispute.trade);
        }
        catch (error) {
            console.error(`Failed to send P2PDisputeClosing email:`, error);
        }
        (0, Websocket_1.sendMessageToRoute)(`/api/ext/p2p/trade`, { id }, {
            data: {
                status: "PAID",
                p2pDisputes: [
                    {
                        ...dispute.get({ plain: true }),
                        status: "RESOLVED",
                    },
                ],
                updatedAt: new Date(),
            },
        });
    });
    return {
        message: "Dispute closed successfully",
    };
};
