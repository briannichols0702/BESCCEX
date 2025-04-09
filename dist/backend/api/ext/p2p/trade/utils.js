"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendP2PReviewNotificationEmail = exports.sendP2PTradeCompletionEmail = exports.sendP2PDisputeClosingEmail = exports.sendP2PDisputeOpenedEmail = exports.sendP2PTradePaymentConfirmationEmail = exports.sendP2PTradeCancellationEmail = exports.sendP2PTradeReplyEmail = exports.sendP2POfferAmountDepletionEmail = exports.sendP2PTradeSaleConfirmationEmail = exports.p2pTradeStoreSchema = exports.p2pTradeUpdateSchema = exports.baseP2pTradeSchema = exports.p2pTradeSchema = void 0;
const emails_1 = require("@b/utils/emails");
const schema_1 = require("@b/utils/schema");
const id = (0, schema_1.baseStringSchema)("ID of the P2P Trade");
const userId = (0, schema_1.baseStringSchema)("ID of the Buyer User");
const sellerId = (0, schema_1.baseStringSchema)("ID of the Seller User");
const offerId = (0, schema_1.baseStringSchema)("ID of the P2P Offer associated with the trade");
const amount = (0, schema_1.baseNumberSchema)("Amount involved in the trade");
const status = (0, schema_1.baseEnumSchema)("Current status of the trade", [
    "PENDING",
    "PAID",
    "DISPUTE_OPEN",
    "ESCROW_REVIEW",
    "CANCELLED",
    "COMPLETED",
    "REFUNDED",
]);
const messages = (0, schema_1.baseStringSchema)("Messages related to the trade", 255, 0, true);
const txHash = (0, schema_1.baseStringSchema)("Transaction hash if applicable", 255, 0, true);
const createdAt = (0, schema_1.baseDateTimeSchema)("Creation date of the trade");
const updatedAt = (0, schema_1.baseDateTimeSchema)("Last update date of the trade");
exports.p2pTradeSchema = {
    id,
    userId,
    sellerId,
    offerId,
    amount,
    status,
    messages,
    txHash,
    createdAt,
    updatedAt,
};
exports.baseP2pTradeSchema = {
    id,
    userId,
    sellerId,
    offerId,
    amount,
    status,
    messages,
    txHash,
    createdAt,
    updatedAt,
    deletedAt: (0, schema_1.baseDateTimeSchema)("Deletion date of the trade, if any"),
};
exports.p2pTradeUpdateSchema = {
    type: "object",
    properties: {
        status,
        messages,
        txHash,
    },
    required: ["status"], // Adjust according to business logic if necessary
};
exports.p2pTradeStoreSchema = {
    description: `P2P Trade created or updated successfully`,
    content: {
        "application/json": {
            schema: {
                type: "object",
                properties: exports.baseP2pTradeSchema,
            },
        },
    },
};
async function sendP2PTradeSaleConfirmationEmail(seller, buyer, trade, offer) {
    const emailData = {
        TO: seller.email,
        SELLER_NAME: seller.firstName,
        BUYER_NAME: buyer.firstName,
        CURRENCY: offer.currency,
        AMOUNT: trade.amount.toString(),
        PRICE: offer.price.toString(),
        TRADE_ID: trade.id,
    };
    await emails_1.emailQueue.add({ emailData, emailType: "P2PTradeSaleConfirmation" });
}
exports.sendP2PTradeSaleConfirmationEmail = sendP2PTradeSaleConfirmationEmail;
async function sendP2POfferAmountDepletionEmail(seller, offer, currentAmount) {
    const emailData = {
        TO: seller.email,
        SELLER_NAME: seller.firstName,
        OFFER_ID: offer.id.toString(),
        CURRENT_AMOUNT: currentAmount.toString(),
        CURRENCY: offer.currency,
    };
    await emails_1.emailQueue.add({ emailData, emailType: "P2POfferAmountDepletion" });
}
exports.sendP2POfferAmountDepletionEmail = sendP2POfferAmountDepletionEmail;
async function sendP2PTradeReplyEmail(receiver, sender, trade, message) {
    const emailData = {
        TO: receiver.email,
        RECEIVER_NAME: receiver.firstName,
        SENDER_NAME: sender.firstName,
        TRADE_ID: trade.id,
        MESSAGE: message.text,
    };
    await emails_1.emailQueue.add({ emailData, emailType: "P2PTradeReply" });
}
exports.sendP2PTradeReplyEmail = sendP2PTradeReplyEmail;
async function sendP2PTradeCancellationEmail(participant, trade) {
    const emailData = {
        TO: participant.email,
        PARTICIPANT_NAME: participant.firstName,
        TRADE_ID: trade.id,
    };
    await emails_1.emailQueue.add({ emailData, emailType: "P2PTradeCancellation" });
}
exports.sendP2PTradeCancellationEmail = sendP2PTradeCancellationEmail;
async function sendP2PTradePaymentConfirmationEmail(seller, buyer, trade, transactionId) {
    const emailData = {
        TO: seller.email,
        SELLER_NAME: seller.firstName,
        BUYER_NAME: buyer.firstName,
        TRADE_ID: trade.id,
        TRANSACTION_ID: transactionId,
    };
    await emails_1.emailQueue.add({ emailData, emailType: "P2PTradePaymentConfirmation" });
}
exports.sendP2PTradePaymentConfirmationEmail = sendP2PTradePaymentConfirmationEmail;
async function sendP2PDisputeOpenedEmail(disputed, disputer, trade, disputeReason) {
    const emailData = {
        TO: disputed.email,
        PARTICIPANT_NAME: disputed.firstName,
        OTHER_PARTY_NAME: disputer.firstName,
        TRADE_ID: trade.id,
        DISPUTE_REASON: disputeReason,
    };
    await emails_1.emailQueue.add({ emailData, emailType: "P2PDisputeOpened" });
}
exports.sendP2PDisputeOpenedEmail = sendP2PDisputeOpenedEmail;
async function sendP2PDisputeClosingEmail(participant, trade) {
    const emailData = {
        TO: participant.email,
        PARTICIPANT_NAME: participant.firstName,
        TRADE_ID: trade.id,
    };
    await emails_1.emailQueue.add({ emailData, emailType: "P2PDisputeClosing" });
}
exports.sendP2PDisputeClosingEmail = sendP2PDisputeClosingEmail;
async function sendP2PTradeCompletionEmail(seller, buyer, trade) {
    const emailData = {
        TO: seller.email,
        SELLER_NAME: seller.firstName,
        BUYER_NAME: buyer.firstName,
        AMOUNT: trade.amount.toString(),
        CURRENCY: trade.offer.currency,
        TRADE_ID: trade.id,
    };
    await emails_1.emailQueue.add({ emailData, emailType: "P2PTradeCompletion" });
}
exports.sendP2PTradeCompletionEmail = sendP2PTradeCompletionEmail;
async function sendP2PReviewNotificationEmail(seller, reviewer, offer, rating, comment) {
    const emailData = {
        TO: seller.email,
        SELLER_NAME: seller.firstName,
        OFFER_ID: offer.id,
        REVIEWER_NAME: reviewer.firstName,
        RATING: rating.toString(),
        COMMENT: comment,
    };
    await emails_1.emailQueue.add({ emailData, emailType: "P2PReviewNotification" });
}
exports.sendP2PReviewNotificationEmail = sendP2PReviewNotificationEmail;
