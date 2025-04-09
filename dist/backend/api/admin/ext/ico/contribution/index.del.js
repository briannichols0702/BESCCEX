"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Bulk deletes ICO contributions by IDs",
    operationId: "bulkDeleteIcoContributions",
    tags: ["Admin", "ICO", "Contributions"],
    parameters: (0, query_1.commonBulkDeleteParams)("ICO Contributions"),
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
                            description: "Array of ICO contribution IDs to delete",
                        },
                    },
                    required: ["ids"],
                },
            },
        },
    },
    responses: (0, query_1.commonBulkDeleteResponses)("ICO Contributions"),
    requiresAuth: true,
    permission: "Access ICO Contribution Management",
};
exports.default = async (data) => {
    const { body, query } = data;
    const { ids } = body;
    const preDelete = async () => {
        for (const id of ids) {
            const contribution = await db_1.models.icoContribution.findOne({
                where: { id },
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
            if (contribution) {
                const wallet = await db_1.models.wallet.findOne({
                    where: {
                        userId: contribution.userId,
                        currency: contribution.phase.token.purchaseCurrency,
                        type: contribution.phase.token.purchaseWalletType,
                    },
                });
                if (wallet) {
                    const newBalance = wallet.balance + contribution.amount;
                    // Update wallet balance
                    await db_1.models.wallet.update({ balance: newBalance }, { where: { id: wallet.id } });
                }
            }
        }
    };
    const postDelete = async () => {
        // Delete transaction records for all contributions
        await db_1.models.transaction.destroy({
            where: {
                referenceId: ids, // Assuming your ORM can handle array of IDs for referenceId
            },
        });
    };
    return (0, query_1.handleBulkDelete)({
        model: "icoContribution",
        ids,
        query,
        preDelete,
        postDelete,
    });
};
