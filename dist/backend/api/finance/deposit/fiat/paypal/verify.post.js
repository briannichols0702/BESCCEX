"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
// /server/api/deposit/paypal/verify.post.ts
const query_1 = require("@b/utils/query");
const emails_1 = require("@b/utils/emails");
const db_1 = require("@b/db");
const utils_1 = require("./utils");
exports.metadata = {
    summary: "Verifies a Stripe checkout session",
    description: "Confirms the validity of a Stripe checkout session by its session ID, ensuring the session is authenticated and retrieving associated payment intent and line items details.",
    operationId: "verifyStripeCheckoutSession",
    tags: ["Finance", "Deposit"],
    requiresAuth: true,
    parameters: [
        {
            name: "orderId",
            in: "query",
            description: "The PayPal order ID",
            required: true,
            schema: {
                type: "string",
            },
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
                            status: {
                                type: "boolean",
                                description: "Indicates if the request was successful",
                            },
                            statusCode: {
                                type: "number",
                                description: "HTTP status code",
                                example: 200,
                            },
                            data: {
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
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("Paypal"),
        500: query_1.serverErrorResponse,
    },
};
exports.default = async (data) => {
    const { user, query } = data;
    if (!(user === null || user === void 0 ? void 0 : user.id))
        throw new Error("User not authenticated");
    const userPk = await db_1.models.user.findByPk(user.id);
    if (!userPk)
        throw new Error("User not found");
    const { orderId } = query;
    const existingTransaction = await db_1.models.transaction.findOne({
        where: { referenceId: orderId },
    });
    if (existingTransaction) {
        throw new Error("Transaction already exists");
    }
    const client = (0, utils_1.paypalClient)();
    const request = new utils_1.paypalOrders.OrdersCaptureRequest(orderId);
    request.requestBody({});
    try {
        const captureResponse = await client.execute(request);
        const captureDetails = captureResponse.result;
        if (!captureDetails.purchase_units ||
            captureDetails.purchase_units.length === 0) {
            throw new Error("No purchase units found in capture details.");
        }
        const purchaseUnit = captureDetails.purchase_units[0];
        const captures = purchaseUnit.payments.captures;
        if (!captures || captures.length === 0) {
            throw new Error("No captures found in purchase unit.");
        }
        const capture = captures[0];
        const grossAmount = parseFloat(capture.amount.value);
        const currency = capture.amount.currency_code;
        const paypalGateway = await db_1.models.depositGateway.findOne({
            where: { name: "PAYPAL" },
        });
        if (!paypalGateway) {
            throw new Error("PayPal gateway not found");
        }
        // Retrieve the user's wallet
        let wallet = await db_1.models.wallet.findOne({
            where: { userId: user.id, currency: currency },
        });
        if (!wallet) {
            wallet = await db_1.models.wallet.create({
                userId: user.id,
                currency: currency,
                type: "FIAT",
            });
        }
        const currencyData = await db_1.models.currency.findOne({
            where: { id: wallet.currency },
        });
        if (!currencyData) {
            throw new Error("Currency not found");
        }
        const fixedFee = paypalGateway.fixedFee || 0;
        const percentageFee = paypalGateway.percentageFee || 0;
        const taxAmount = Number(((grossAmount * percentageFee) / 100 + fixedFee).toFixed(currencyData.precision || 2));
        const recievedAmount = Number((grossAmount - taxAmount).toFixed(currencyData.precision || 2));
        let newBalance = Number(wallet.balance);
        newBalance += recievedAmount;
        newBalance = Number(newBalance.toFixed(currencyData.precision || 2));
        // Start a transaction to create a new transaction record and update the wallet balance
        const createdTransaction = await db_1.sequelize.transaction(async (transaction) => {
            // Create a new transaction record
            const newTransaction = await db_1.models.transaction.create({
                userId: user.id,
                walletId: wallet.id,
                type: "DEPOSIT",
                amount: recievedAmount,
                fee: taxAmount,
                referenceId: orderId,
                status: "COMPLETED",
                description: `Deposit of ${recievedAmount} ${currency} to ${userPk.firstName} ${userPk.lastName} wallet by PayPal.`,
                metadata: JSON.stringify({ method: "PAYPAL", currency: currency }),
            }, { transaction });
            // Update the wallet balance
            await db_1.models.wallet.update({
                balance: newBalance,
            }, {
                where: { id: wallet.id },
                transaction,
            });
            // **Admin Profit Recording:**
            // Create an admin profit record if there's a fee involved
            if (taxAmount > 0) {
                await db_1.models.adminProfit.create({
                    amount: taxAmount,
                    currency: wallet.currency,
                    type: "DEPOSIT",
                    transactionId: newTransaction.id,
                    description: `Admin profit from PayPal deposit fee of ${taxAmount} ${wallet.currency} for user (${user.id})`,
                }, { transaction });
            }
            // Assuming you need to return or use the created transaction, you can return it here
            return newTransaction;
        });
        try {
            await (0, emails_1.sendFiatTransactionEmail)(userPk, createdTransaction, currency, newBalance);
        }
        catch (error) {
            console.error("Error sending email:", error);
        }
        return {
            transaction: createdTransaction,
            balance: newBalance.toFixed(2),
            currency,
            method: "PAYPAL",
        };
    }
    catch (error) {
        console.log("Error verifying PayPal order:", error);
        throw new Error(`Error verifying PayPal order: ${error.message}`);
    }
};
