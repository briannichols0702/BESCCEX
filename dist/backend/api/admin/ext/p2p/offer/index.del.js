"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Bulk deletes P2P offers by IDs",
    operationId: "bulkDeleteP2POffers",
    tags: ["Admin", "P2P", "Offers"],
    parameters: (0, query_1.commonBulkDeleteParams)("P2P Offers"),
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        ids: {
                            type: "array",
                            items: { type: "string" },
                            description: "Array of P2P offer IDs to delete",
                        },
                    },
                    required: ["ids"],
                },
            },
        },
    },
    responses: (0, query_1.commonBulkDeleteResponses)("P2P Offers"),
    requiresAuth: true,
    permission: "Access P2P Offer Management",
};
exports.default = async (data) => {
    const { body, query } = data;
    const { ids } = body;
    const preDelete = async () => {
        for (const id of ids) {
            const offer = await db_1.models.p2pOffer.findOne({
                where: { id },
                include: [
                    {
                        model: db_1.models.user,
                        attributes: ["id"],
                        as: "user",
                    },
                ],
            });
            if (offer) {
                const wallet = await db_1.models.wallet.findOne({
                    where: {
                        userId: offer.userId,
                        type: offer.walletType,
                        currency: offer.currency,
                    },
                });
                if (wallet) {
                    const newBalance = wallet.balance + offer.amount;
                    // Update the wallet balance
                    await db_1.models.wallet.update({ balance: newBalance }, { where: { id: wallet.id } });
                }
            }
        }
    };
    const postDelete = async () => {
        // Implement if there are any specific actions needed after deleting offers
    };
    return (0, query_1.handleBulkDelete)({
        model: "p2pOffer",
        ids,
        query,
        preDelete,
        postDelete,
    });
};
