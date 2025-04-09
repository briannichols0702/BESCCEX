"use strict";
// /server/api/deposit/stripeVerify.post.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("./utils");
const db_1 = require("@b/db");
const emails_1 = require("@b/utils/emails");
exports.metadata = {
    summary: "Verifies a Stripe checkout session",
    description: "Confirms the validity of a Stripe checkout session by its session ID, ensuring the session is authenticated and retrieving associated payment intent and line items details.",
    operationId: "verifyStripeCheckoutSession",
    tags: ["Finance", "Deposit"],
    requiresAuth: true,
    parameters: [
        {
            index: 0,
            name: "sessionId",
            in: "query",
            description: "Stripe checkout session ID",
            required: true,
            schema: { type: "string" },
        },
    ],
    responses: {
        200: {
            description: "Checkout session verified successfully. Returns the session ID, payment intent status, and detailed line items.",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            id: { type: "string", description: "Session ID" },
                            status: {
                                type: "string",
                                description: "Payment intent status",
                                nullable: true,
                            },
                            lineItems: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        id: { type: "string", description: "Line item ID" },
                                        description: {
                                            type: "string",
                                            description: "Line item description",
                                        },
                                        amountSubtotal: {
                                            type: "number",
                                            description: "Subtotal amount",
                                        },
                                        amountTotal: {
                                            type: "number",
                                            description: "Total amount",
                                        },
                                        currency: {
                                            type: "string",
                                            description: "Currency code",
                                        },
                                    },
                                },
                                description: "List of line items associated with the checkout session",
                            },
                        },
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("Stripe"),
        500: query_1.serverErrorResponse,
    },
};
exports.default = async (data) => {
    var _a;
    const { user, query } = data;
    if (!user)
        throw new Error("User not authenticated");
    const { sessionId } = query;
    const stripe = (0, utils_1.useStripe)();
    try {
        // Retrieve the Checkout Session
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        const paymentIntentId = session.payment_intent;
        // Retrieve the associated Payment Intent, if needed
        const paymentIntent = paymentIntentId
            ? await stripe.paymentIntents.retrieve(paymentIntentId)
            : null;
        // Retrieve all line items for the session
        const lineItems = await stripe.checkout.sessions.listLineItems(sessionId);
        // Map line items to the desired format
        const mappedLineItems = lineItems.data.map((item) => ({
            id: item.id,
            description: item.description,
            currency: item.currency,
            amount: item.amount_subtotal / 100,
        }));
        const status = paymentIntent ? paymentIntent.status : "unknown";
        if (status === "succeeded") {
            const userPk = await db_1.models.user.findByPk(user.id);
            const existingTransaction = await db_1.models.transaction.findOne({
                where: { referenceId: sessionId },
            });
            if (existingTransaction)
                return {
                    id: session.id,
                    status,
                    line_items: mappedLineItems,
                };
            const { currency, amount } = mappedLineItems[0];
            let wallet = await db_1.models.wallet.findOne({
                where: { userId: user.id, currency, type: "FIAT" },
            });
            if (!wallet) {
                wallet = await db_1.models.wallet.create({
                    userId: user.id,
                    currency,
                    type: "FIAT",
                });
            }
            const currencyData = await db_1.models.currency.findOne({
                where: { id: wallet.currency },
            });
            if (!currencyData) {
                throw new Error("Currency not found");
            }
            const fee = ((_a = mappedLineItems[1]) === null || _a === void 0 ? void 0 : _a.amount) || 0;
            let newBalance = wallet.balance;
            newBalance += Number(amount);
            newBalance = parseFloat(newBalance.toFixed(currencyData.precision || 2));
            // Sequelize transaction
            const result = await db_1.sequelize.transaction(async (t) => {
                // Create a new transaction
                const newTransaction = await db_1.models.transaction.create({
                    userId: user.id,
                    walletId: wallet.id,
                    type: "DEPOSIT",
                    amount,
                    fee,
                    referenceId: sessionId,
                    status: "COMPLETED",
                    metadata: JSON.stringify({
                        method: "STRIPE",
                    }),
                    description: `Deposit of ${amount} ${currency} to ${userPk === null || userPk === void 0 ? void 0 : userPk.firstName} ${userPk === null || userPk === void 0 ? void 0 : userPk.lastName} wallet by Stripe.`,
                }, { transaction: t });
                // Update the wallet's balance
                await db_1.models.wallet.update({
                    balance: newBalance,
                }, {
                    where: { id: wallet.id },
                    transaction: t,
                });
                // **Admin Profit Recording:**
                // Create an admin profit record if there's a fee associated with the Stripe deposit
                if (fee > 0) {
                    await db_1.models.adminProfit.create({
                        amount: fee,
                        currency: wallet.currency,
                        type: "DEPOSIT",
                        transactionId: newTransaction.id,
                        description: `Admin profit from Stripe deposit fee of ${fee} ${wallet.currency} for user (${user.id})`,
                    }, { transaction: t });
                }
                return newTransaction;
            });
            try {
                await (0, emails_1.sendFiatTransactionEmail)(userPk, result, currency, newBalance);
            }
            catch (error) {
                console.error("Error sending email:", error);
            }
        }
        return {
            id: session.id,
            status,
            line_items: mappedLineItems,
        };
    }
    catch (error) {
        throw new Error(`Error retrieving session and line items: ${error.message}`);
    }
};
