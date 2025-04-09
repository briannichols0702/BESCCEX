"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const affiliate_1 = require("@b/utils/affiliate");
const emails_1 = require("@b/utils/emails");
const error_1 = require("@b/utils/error");
const notifications_1 = require("@b/utils/notifications");
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Creates a new ICO contribution",
    description: "Allows a user to contribute to an ICO phase.",
    operationId: "createIcoContribution",
    tags: ["ICO", "Contributions"],
    requiresAuth: true,
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        phaseId: {
                            type: "string",
                            description: "Phase ID for contribution",
                        },
                        amount: { type: "number", description: "Amount to contribute" },
                    },
                    required: ["phaseId", "amount"],
                },
            },
        },
    },
    responses: {
        201: {
            description: "Contribution created successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            id: { type: "string", description: "Contribution ID" },
                            amount: { type: "number", description: "Amount contributed" },
                            status: { type: "string", description: "Contribution status" },
                        },
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("Ico Contribution"),
        500: query_1.serverErrorResponse,
    },
};
exports.default = async (data) => {
    const { user, body } = data;
    if (!(user === null || user === void 0 ? void 0 : user.id)) {
        throw (0, error_1.createError)({ statusCode: 401, message: "Unauthorized" });
    }
    const { phaseId, amount } = body;
    if (amount <= 0) {
        throw (0, error_1.createError)({
            statusCode: 400,
            message: "Amount must be positive",
        });
    }
    const userPk = await db_1.models.user.findByPk(user.id);
    if (!userPk) {
        throw (0, error_1.createError)({ statusCode: 404, message: "User not found" });
    }
    let contribution, phase, wallet;
    await db_1.sequelize.transaction(async (t) => {
        phase = (await db_1.models.icoPhase.findByPk(phaseId, {
            include: [{ model: db_1.models.icoToken, as: "token" }],
            transaction: t,
        }));
        if (!phase) {
            throw (0, error_1.createError)({ statusCode: 404, message: "Phase not found" });
        }
        wallet = await db_1.models.wallet.findOne({
            where: {
                userId: user.id,
                currency: phase.token.purchaseCurrency,
                type: phase.token.purchaseWalletType,
            },
            transaction: t,
        });
        if (!wallet || wallet.balance < amount) {
            throw (0, error_1.createError)({
                statusCode: 400,
                message: "Insufficient wallet balance",
            });
        }
        // Deduct amount from wallet
        wallet.balance -= amount;
        await wallet.save({ transaction: t });
        // Create contribution
        contribution = await db_1.models.icoContribution.create({
            userId: user.id,
            phaseId: phase.id,
            amount,
        }, { transaction: t });
        // Create transaction record
        await db_1.models.transaction.create({
            userId: user.id,
            walletId: wallet.id,
            type: "ICO_CONTRIBUTION",
            status: "COMPLETED",
            amount: amount,
            description: `Contribution in ${phase.token.currency} Offering ${phase.name} phase`,
            referenceId: contribution.id,
        }, { transaction: t });
        return contribution;
    });
    if (!contribution || !phase || !wallet) {
        throw (0, error_1.createError)({
            statusCode: 500,
            message: "Failed to create contribution",
        });
    }
    try {
        await (0, notifications_1.handleNotification)({
            userId: user.id,
            title: "ICO Contribution",
            message: `You have successfully contributed ${amount} ${phase.token.currency} to the ${phase.name} phase of the ${phase.token.currency} ICO`,
            type: "ACTIVITY",
        });
    }
    catch (error) {
        console.error(`Failed to send notification: ${error.message}`);
    }
    try {
        await (0, emails_1.sendIcoContributionEmail)(userPk, contribution, phase.token, phase, "IcoNewContribution");
    }
    catch (error) {
        console.error(`Failed to send email: ${error.message}`);
    }
    try {
        await (0, affiliate_1.processRewards)(user.id, amount, "ICO_CONTRIBUTION", phase.token.purchaseCurrency);
    }
    catch (error) {
        console.error(`Failed to process rewards: ${error.message}`);
    }
    return { message: "Congrats! Your contribution was successful" };
};
