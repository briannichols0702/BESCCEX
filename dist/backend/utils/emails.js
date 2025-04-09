"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendForexTransactionEmail = exports.sendKycEmail = exports.sendEmailToTargetWithTemplate = exports.sendOrderConfirmationEmail = exports.sendStakingRewardEmail = exports.sendStakingInitiationEmail = exports.sendIcoContributionEmail = exports.sendInvestmentEmail = exports.sendAiInvestmentEmail = exports.sendSpotWalletDepositConfirmationEmail = exports.sendSpotWalletWithdrawalConfirmationEmail = exports.sendIncomingTransferEmail = exports.sendOutgoingTransferEmail = exports.sendAuthorStatusUpdateEmail = exports.sendTransactionStatusUpdateEmail = exports.sendWalletBalanceUpdateEmail = exports.sendBinaryOrderEmail = exports.sendFiatTransactionEmail = exports.sendChatEmail = exports.sendEmail = exports.emailQueue = void 0;
const bull_1 = __importDefault(require("bull"));
const mailer_1 = require("./mailer");
const date_fns_1 = require("date-fns");
const APP_EMAILER = process.env.APP_EMAILER || "nodemailer-service";
exports.emailQueue = new bull_1.default("emailQueue", {
    redis: {
        host: "127.0.0.1",
        port: 6379,
    },
});
exports.emailQueue.process(async (job) => {
    const { emailData, emailType } = job.data;
    try {
        await sendEmail(emailData, emailType);
        console.log("Email sent successfully");
    }
    catch (error) {
        console.error("Failed to send email:", error);
        // Optionally: Re-queue or handle the job based on the error
        throw error;
    }
});
async function sendEmail(specificVariables, templateName) {
    let processedTemplate;
    let processedSubject;
    try {
        const result = await (0, mailer_1.fetchAndProcessEmailTemplate)(specificVariables, templateName);
        processedTemplate = result.processedTemplate;
        processedSubject = result.processedSubject;
    }
    catch (error) {
        console.error("Error processing email template:", error);
        throw error;
    }
    let finalEmailHtml;
    try {
        finalEmailHtml = await (0, mailer_1.prepareEmailTemplate)(processedTemplate, processedSubject);
    }
    catch (error) {
        console.error("Error preparing email template:", error);
        throw error;
    }
    const options = {
        to: specificVariables["TO"],
        subject: processedSubject,
        html: finalEmailHtml,
    };
    const emailer = APP_EMAILER;
    try {
        await (0, mailer_1.sendEmailWithProvider)(emailer, options);
    }
    catch (error) {
        console.error("Error sending email with provider:", error);
        throw error;
    }
}
exports.sendEmail = sendEmail;
async function sendChatEmail(sender, receiver, chat, message, emailType) {
    const emailData = {
        TO: receiver.email,
        SENDER_NAME: sender.firstName,
        RECEIVER_NAME: receiver.firstName,
        MESSAGE: message.text,
        TICKET_ID: chat.id,
    };
    await exports.emailQueue.add({
        emailData,
        emailType,
    });
}
exports.sendChatEmail = sendChatEmail;
async function sendFiatTransactionEmail(user, transaction, currency, newBalance) {
    // Define the type of email template to use, which matches the SQL record
    const emailType = "FiatWalletTransaction";
    // Prepare the email data
    const emailData = {
        TO: user.email,
        FIRSTNAME: user.firstName,
        TRANSACTION_TYPE: transaction.type,
        TRANSACTION_ID: transaction.id,
        AMOUNT: transaction.amount,
        CURRENCY: currency,
        TRANSACTION_STATUS: transaction.status,
        NEW_BALANCE: newBalance,
        DESCRIPTION: transaction.description || "N/A",
    };
    // Send the email
    await exports.emailQueue.add({ emailData, emailType });
}
exports.sendFiatTransactionEmail = sendFiatTransactionEmail;
async function sendBinaryOrderEmail(user, order) {
    // Define the type of email template to use, which matches the SQL record
    const emailType = "BinaryOrderResult";
    let profit = 0;
    let sign;
    switch (order.status) {
        case "WIN":
            profit = order.amount + order.amount * (order.profit / 100);
            sign = "+";
            break;
        case "LOSS":
            profit = order.amount;
            sign = "-";
            break;
        case "DRAW":
            profit = 0;
            sign = "";
            break;
    }
    const currency = order.symbol.split("/")[1];
    // Prepare the email data
    const emailData = {
        TO: user.email,
        FIRSTNAME: user.firstName,
        ORDER_ID: order.id,
        RESULT: order.status,
        MARKET: order.symbol,
        CURRENCY: currency,
        AMOUNT: order.amount,
        PROFIT: `${sign}${profit}`,
        ENTRY_PRICE: order.price,
        CLOSE_PRICE: order.closePrice,
        SIDE: order.side,
    };
    // Send the email
    await exports.emailQueue.add({ emailData, emailType });
}
exports.sendBinaryOrderEmail = sendBinaryOrderEmail;
async function sendWalletBalanceUpdateEmail(user, wallet, action, amount, newBalance) {
    // Define the type of email template to use, which matches the SQL record
    const emailType = "WalletBalanceUpdate";
    // Prepare the email data
    const emailData = {
        TO: user.email,
        FIRSTNAME: user.firstName,
        ACTION: action,
        AMOUNT: amount,
        CURRENCY: wallet.currency,
        NEW_BALANCE: newBalance,
    };
    // Send the email
    await exports.emailQueue.add({ emailData, emailType });
}
exports.sendWalletBalanceUpdateEmail = sendWalletBalanceUpdateEmail;
async function sendTransactionStatusUpdateEmail(user, transaction, wallet, newBalance, note) {
    // Define the type of email template to use, which matches the SQL record
    const emailType = "TransactionStatusUpdate";
    // Prepare the email data
    const emailData = {
        TO: user.email,
        FIRSTNAME: user.firstName,
        TRANSACTION_TYPE: transaction.type,
        TRANSACTION_ID: transaction.id,
        TRANSACTION_STATUS: transaction.status,
        AMOUNT: transaction.amount,
        CURRENCY: wallet.currency,
        NEW_BALANCE: newBalance,
        NOTE: note || "N/A",
    };
    // Send the email
    await exports.emailQueue.add({ emailData, emailType });
}
exports.sendTransactionStatusUpdateEmail = sendTransactionStatusUpdateEmail;
async function sendAuthorStatusUpdateEmail(user, author) {
    // Define the type of email template to use, which matches the SQL record
    const emailType = "AuthorStatusUpdate";
    // Prepare the email data
    const emailData = {
        TO: user.email,
        FIRSTNAME: user.firstName,
        AUTHOR_STATUS: author.status,
        APPLICATION_ID: author.id,
    };
    // Send the email
    await exports.emailQueue.add({ emailData, emailType });
}
exports.sendAuthorStatusUpdateEmail = sendAuthorStatusUpdateEmail;
async function sendOutgoingTransferEmail(user, toUser, wallet, amount, transactionId) {
    const emailType = "OutgoingWalletTransfer";
    const emailData = {
        TO: user.email,
        FIRSTNAME: user.firstName,
        AMOUNT: amount,
        CURRENCY: wallet.currency,
        NEW_BALANCE: wallet.balance,
        TRANSACTION_ID: transactionId,
        RECIPIENT_NAME: `${toUser.firstName} ${toUser.lastName}`,
    };
    await exports.emailQueue.add({ emailData, emailType });
}
exports.sendOutgoingTransferEmail = sendOutgoingTransferEmail;
async function sendIncomingTransferEmail(user, fromUser, wallet, amount, transactionId) {
    const emailType = "IncomingWalletTransfer";
    const emailData = {
        TO: user.email,
        FIRSTNAME: user.firstName,
        AMOUNT: amount,
        CURRENCY: wallet.currency,
        NEW_BALANCE: wallet.balance,
        TRANSACTION_ID: transactionId,
        SENDER_NAME: `${fromUser.firstName} ${fromUser.lastName}`,
    };
    await exports.emailQueue.add({ emailData, emailType });
}
exports.sendIncomingTransferEmail = sendIncomingTransferEmail;
async function sendSpotWalletWithdrawalConfirmationEmail(user, transaction, wallet) {
    // Define the type of email template to use, which matches the SQL record
    const emailType = "SpotWalletWithdrawalConfirmation";
    // Prepare the email data
    const emailData = {
        TO: user.email,
        FIRSTNAME: user.firstName,
        AMOUNT: transaction.amount,
        CURRENCY: wallet.currency,
        ADDRESS: transaction.metadata.address,
        FEE: transaction.fee,
        CHAIN: transaction.metadata.chain,
        MEMO: transaction.metadata.memo || "N/A",
        STATUS: transaction.status,
    };
    // Send the email
    await exports.emailQueue.add({ emailData, emailType });
}
exports.sendSpotWalletWithdrawalConfirmationEmail = sendSpotWalletWithdrawalConfirmationEmail;
async function sendSpotWalletDepositConfirmationEmail(user, transaction, wallet, chain) {
    // Define the type of email template to use, which should match the SQL record
    const emailType = "SpotWalletDepositConfirmation";
    // Prepare the email data
    const emailData = {
        TO: user.email,
        FIRSTNAME: user.firstName,
        TRANSACTION_ID: transaction.referenceId,
        AMOUNT: transaction.amount,
        CURRENCY: wallet.currency,
        CHAIN: chain,
        FEE: transaction.fee,
    };
    // Send the email
    await exports.emailQueue.add({ emailData, emailType });
}
exports.sendSpotWalletDepositConfirmationEmail = sendSpotWalletDepositConfirmationEmail;
async function sendAiInvestmentEmail(user, plan, duration, investment, emailType) {
    const resultSign = investment.result === "WIN" ? "+" : investment.result === "LOSS" ? "-" : "";
    const emailData = {
        TO: user.email,
        FIRSTNAME: user.firstName,
        PLAN_NAME: plan.title,
        AMOUNT: investment.amount.toString(),
        CURRENCY: investment.symbol.split("/")[1],
        DURATION: duration.duration.toString(),
        TIMEFRAME: duration.timeframe,
        STATUS: investment.status,
        PROFIT: investment.profit !== undefined
            ? `${resultSign}${investment.profit}`
            : "N/A",
    };
    await exports.emailQueue.add({ emailData, emailType });
}
exports.sendAiInvestmentEmail = sendAiInvestmentEmail;
async function sendInvestmentEmail(user, plan, duration, investment, emailType) {
    const resultSign = investment.result === "WIN" ? "+" : investment.result === "LOSS" ? "-" : "";
    const emailData = {
        TO: user.email,
        FIRSTNAME: user.firstName,
        PLAN_NAME: plan.title,
        AMOUNT: investment.amount.toString(),
        DURATION: duration.duration.toString(),
        TIMEFRAME: duration.timeframe,
        STATUS: investment.status,
        PROFIT: `${resultSign}${investment.profit}` || "N/A",
    };
    await exports.emailQueue.add({ emailData, emailType });
}
exports.sendInvestmentEmail = sendInvestmentEmail;
async function sendIcoContributionEmail(user, contribution, token, phase, emailType, transactionId) {
    const contributionDate = new Date(contribution.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
    // Common email data
    const emailData = {
        TO: user.email,
        FIRSTNAME: user.firstName,
        TOKEN_NAME: token.name,
        PHASE_NAME: phase.name,
        AMOUNT: contribution.amount.toString(),
        CURRENCY: token.purchaseCurrency,
        DATE: contributionDate,
    };
    // Customize email data based on the type
    if (emailType === "IcoContributionPaid") {
        emailData["TRANSACTION_ID"] = transactionId || "N/A";
    }
    else if (emailType === "IcoNewContribution") {
        emailData["CONTRIBUTION_STATUS"] = contribution.status;
    }
    await exports.emailQueue.add({ emailData, emailType });
}
exports.sendIcoContributionEmail = sendIcoContributionEmail;
// Function to send an email when a user initiates a stake
async function sendStakingInitiationEmail(user, stake, pool, reward) {
    const stakeDate = new Date(stake.stakeDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
    const releaseDate = new Date(stake.releaseDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
    const emailData = {
        TO: user.email,
        FIRSTNAME: user.firstName,
        TOKEN_NAME: pool.name,
        STAKE_AMOUNT: stake.amount.toString(),
        TOKEN_SYMBOL: pool.currency,
        STAKE_DATE: stakeDate,
        RELEASE_DATE: releaseDate,
        EXPECTED_REWARD: reward,
    };
    await exports.emailQueue.add({
        emailData,
        emailType: "StakingInitiationConfirmation",
    });
}
exports.sendStakingInitiationEmail = sendStakingInitiationEmail;
async function sendStakingRewardEmail(user, stake, pool, reward) {
    const distributionDate = (0, date_fns_1.format)(new Date(stake.releaseDate), "MMMM do, yyyy 'at' hh:mm a");
    const emailData = {
        TO: user.email,
        FIRSTNAME: user.firstName,
        TOKEN_NAME: pool.name,
        REWARD_AMOUNT: reward.toString(),
        TOKEN_SYMBOL: pool.currency,
        DISTRIBUTION_DATE: distributionDate,
    };
    await exports.emailQueue.add({ emailData, emailType: "StakingRewardDistribution" });
}
exports.sendStakingRewardEmail = sendStakingRewardEmail;
async function sendOrderConfirmationEmail(user, order, product) {
    const orderDate = new Date(order.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
    const emailData = {
        TO: user.email,
        CUSTOMER_NAME: user.firstName,
        ORDER_NUMBER: order.id,
        ORDER_DATE: orderDate,
        ORDER_TOTAL: product.price.toString(),
    };
    await exports.emailQueue.add({ emailData, emailType: "OrderConfirmation" });
}
exports.sendOrderConfirmationEmail = sendOrderConfirmationEmail;
/**
 * Send an email to a specific target with a provided HTML template.
 *
 * @param {string} to - The email address of the target recipient.
 * @param {string} subject - The subject of the email.
 * @param {string} html - The HTML content to be sent.
 * @returns {Promise<void>} - The result of the email sending operation.
 */
async function sendEmailToTargetWithTemplate(to, subject, html) {
    // Options for the email.
    const options = {
        to,
        subject,
        html,
    };
    // Select the email provider.
    const emailer = APP_EMAILER;
    await (0, mailer_1.sendEmailWithProvider)(emailer, options);
}
exports.sendEmailToTargetWithTemplate = sendEmailToTargetWithTemplate;
async function sendKycEmail(user, kyc, type) {
    const timestampLabel = type === "KycSubmission" ? "CREATED_AT" : "UPDATED_AT";
    const timestampDate = type === "KycSubmission"
        ? new Date(kyc.createdAt).toISOString()
        : new Date(kyc.updatedAt).toISOString();
    const emailType = type;
    const emailData = {
        TO: user.email,
        FIRSTNAME: user.firstName,
        [timestampLabel]: timestampDate,
        LEVEL: kyc.level,
        STATUS: kyc.status,
    };
    if (type === "KycRejected" && kyc.notes) {
        emailData["MESSAGE"] = kyc.notes;
    }
    await exports.emailQueue.add({ emailData, emailType });
}
exports.sendKycEmail = sendKycEmail;
async function sendForexTransactionEmail(user, transaction, account, currency, transactionType) {
    const emailData = {
        TO: user.email,
        FIRSTNAME: user.firstName,
        ACCOUNT_ID: account.accountId,
        TRANSACTION_ID: transaction.id,
        AMOUNT: transaction.amount.toString(),
        CURRENCY: currency,
        STATUS: transaction.status,
    };
    let emailType = "";
    if (transactionType === "FOREX_DEPOSIT") {
        emailType = "ForexDepositConfirmation";
    }
    else if (transactionType === "FOREX_WITHDRAW") {
        emailType = "ForexWithdrawalConfirmation";
    }
    await exports.emailQueue.add({ emailData, emailType });
}
exports.sendForexTransactionEmail = sendForexTransactionEmail;
