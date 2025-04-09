"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendIcoContributionEmail = exports.icoContributionStoreSchema = exports.icoContributionUpdateSchema = exports.baseIcoContributionSchema = exports.icoContributionSchema = void 0;
const emails_1 = require("@b/utils/emails");
const schema_1 = require("@b/utils/schema");
const id = (0, schema_1.baseStringSchema)("ID of the ICO Contribution");
const userId = (0, schema_1.baseStringSchema)("ID of the User");
const phaseId = (0, schema_1.baseStringSchema)("ID of the ICO Phase");
const amount = (0, schema_1.baseNumberSchema)("Amount contributed");
const status = (0, schema_1.baseEnumSchema)("Status of the contribution", [
    "PENDING",
    "COMPLETED",
    "CANCELLED",
    "REJECTED",
]);
const createdAt = (0, schema_1.baseDateTimeSchema)("Creation Date of the Contribution");
const updatedAt = (0, schema_1.baseDateTimeSchema)("Last Update Date of the Contribution", true);
const deletedAt = (0, schema_1.baseDateTimeSchema)("Deletion Date of the Contribution", true);
exports.icoContributionSchema = {
    id,
    userId,
    phaseId,
    amount,
    status,
    createdAt,
    updatedAt,
    deletedAt,
};
exports.baseIcoContributionSchema = {
    id,
    userId,
    phaseId,
    amount,
    status,
    createdAt,
    updatedAt,
    deletedAt,
};
exports.icoContributionUpdateSchema = {
    type: "object",
    properties: {
        userId,
        phaseId,
        amount,
        status,
    },
    required: ["userId", "phaseId", "amount", "status"], // Adjust as necessary based on actual required fields
};
exports.icoContributionStoreSchema = {
    description: `ICO Contribution created or updated successfully`,
    content: {
        "application/json": {
            schema: {
                type: "object",
                properties: exports.baseIcoContributionSchema,
            },
        },
    },
};
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
    await emails_1.emailQueue.add({ emailData, emailType });
}
exports.sendIcoContributionEmail = sendIcoContributionEmail;
