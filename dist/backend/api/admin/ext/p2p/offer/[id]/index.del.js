"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Deletes a specific P2P offer",
    operationId: "deleteP2POffer",
    tags: ["Admin", "P2P", "Offers"],
    parameters: (0, query_1.deleteRecordParams)("P2P offer"),
    responses: (0, query_1.deleteRecordResponses)("P2P offer"),
    permission: "Access P2P Offer Management",
    requiresAuth: true,
};
exports.default = async (data) => {
    const { params, query } = data;
    const preDelete = async () => {
        const offer = await db_1.models.p2pOffer.findOne({
            where: { id: params.id },
            include: [
                {
                    model: db_1.models.user,
                    attributes: ["id"],
                    as: "user",
                },
            ],
        });
        if (!offer) {
            throw new Error("Offer not found");
        }
        const wallet = await db_1.models.wallet.findOne({
            where: {
                userId: offer.userId, // Assuming this field exists and is named correctly
                type: offer.walletType, // Make sure the field names are correctly camelCased as per Sequelize model definitions
                currency: offer.currency,
            },
        });
        if (!wallet) {
            throw new Error("Wallet not found");
        }
        // Update the wallet balance by incrementing it with the offer amount
        await db_1.models.wallet.update({
            balance: wallet.balance + offer.amount, // Sequelize doesn't support increment in the update method directly
        }, {
            where: { id: wallet.id },
        });
    };
    const postDelete = async () => {
        // No additional post-delete logic needed unless specified
    };
    return await (0, query_1.handleSingleDelete)({
        model: "p2pOffer",
        id: params.id,
        query,
        preDelete,
        postDelete,
    });
};
