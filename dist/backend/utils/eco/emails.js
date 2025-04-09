"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendTransferConfirmationEmail = exports.sendDepositConfirmationEmail = exports.sendWithdrawalStatusEmail = void 0;
const emails_1 = require("../emails");
async function sendWithdrawalStatusEmail(user, status, reason, transactionId, amount, currency) {
    const emailType = "WithdrawalStatus";
    const emailData = {
        TO: user.email,
        FIRSTNAME: user.first_name,
        STATUS: status,
        REASON: reason,
        TRANSACTION_ID: transactionId,
        AMOUNT: amount,
        CURRENCY: currency,
    };
    await emails_1.emailQueue.add({ emailData, emailType });
}
exports.sendWithdrawalStatusEmail = sendWithdrawalStatusEmail;
async function sendDepositConfirmationEmail(user, transactionId, amount, currency) {
    const emailType = "DepositConfirmation";
    const emailData = {
        TO: user.email,
        FIRSTNAME: user.first_name,
        TRANSACTION_ID: transactionId,
        AMOUNT: amount,
        CURRENCY: currency,
    };
    await emails_1.emailQueue.add({ emailData, emailType });
}
exports.sendDepositConfirmationEmail = sendDepositConfirmationEmail;
async function sendTransferConfirmationEmail(user, recipient, transactionId, amount, currency) {
    const emailType = "TransferConfirmation";
    const emailData = {
        TO: user.email,
        FIRSTNAME: user.first_name,
        TRANSACTION_ID: transactionId,
        AMOUNT: amount,
        CURRENCY: currency,
        RECIPIENT_NAME: `${recipient.first_name} ${recipient.last_name}`,
    };
    await emails_1.emailQueue.add({ emailData, emailType });
}
exports.sendTransferConfirmationEmail = sendTransferConfirmationEmail;
