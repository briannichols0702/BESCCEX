"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Deletes a specific ICO contribution",
    operationId: "deleteIcoContribution",
    tags: ["Admin", "ICO", "Contributions"],
    parameters: (0, query_1.deleteRecordParams)("ICO contribution"),
    responses: (0, query_1.deleteRecordResponses)("ICO contribution"),
    permission: "Access ICO Contribution Management",
    requiresAuth: true,
};
exports.default = async (data) => {
    const { params, query } = data;
    const externalData = {};
    const preDelete = async () => {
        const contribution = await db_1.models.icoContribution.findOne({
            where: { id: params.id },
            include: [
                {
                    model: db_1.models.icoPhase,
                    as: "phase",
                    include: [
                        {
                            model: db_1.models.icoToken,
                            as: "token",
                        },
                    ],
                },
            ],
        });
        if (!contribution) {
            throw new Error("Contribution not found");
        }
        const wallet = await db_1.models.wallet.findOne({
            where: {
                userId: contribution.userId,
                currency: contribution.phase.token.purchaseCurrency,
                type: contribution.phase.token.purchaseWalletType,
            },
        });
        if (!wallet) {
            throw new Error("Wallet not found");
        }
        // Calculate new balance
        const newBalance = wallet.balance + contribution.amount;
        // Update wallet balance
        await db_1.models.wallet.update({ balance: newBalance }, { where: { id: wallet.id } });
        // Store the contribution UUID for later use in postDelete
        externalData.contributionId = contribution.id;
    };
    const postDelete = async () => {
        // Delete transaction records associated with the contribution
        if (externalData.contributionId) {
            await db_1.models.transaction.destroy({
                where: { referenceId: externalData.contributionId },
            });
        }
    };
    return await (0, query_1.handleSingleDelete)({
        model: "icoContribution",
        id: params.id,
        query,
        preDelete,
        postDelete,
    });
};
