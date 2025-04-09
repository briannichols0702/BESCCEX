"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendP2PDisputeOpenedEmail = exports.p2pDisputeStoreSchema = exports.p2pDisputeUpdateSchema = exports.baseP2pDisputeSchema = exports.p2pDisputeSchema = void 0;
const emails_1 = require("@b/utils/emails");
const schema_1 = require("@b/utils/schema");
const id = (0, schema_1.baseStringSchema)("ID of the P2P Dispute");
const tradeId = (0, schema_1.baseStringSchema)("Trade ID associated with the dispute");
const raisedById = (0, schema_1.baseStringSchema)("User ID of the person who raised the dispute");
const reason = (0, schema_1.baseStringSchema)("Reason for the dispute");
const status = (0, schema_1.baseEnumSchema)("Current status of the dispute", [
    "PENDING",
    "OPEN",
    "RESOLVED",
    "CANCELLED",
]);
const resolution = (0, schema_1.baseStringSchema)("Resolution details, if resolved", 191, 0, true);
const createdAt = (0, schema_1.baseDateTimeSchema)("Creation date of the P2P Dispute");
const updatedAt = (0, schema_1.baseDateTimeSchema)("Last update date of the P2P Dispute", true);
exports.p2pDisputeSchema = {
    id,
    tradeId,
    raisedById,
    reason,
    status,
    resolution,
    createdAt,
    updatedAt,
};
exports.baseP2pDisputeSchema = {
    id,
    tradeId,
    raisedById,
    reason,
    status,
    resolution,
    createdAt,
    updatedAt,
    deletedAt: (0, schema_1.baseDateTimeSchema)("Deletion date of the P2P Dispute, if any"),
};
exports.p2pDisputeUpdateSchema = {
    type: "object",
    properties: {
        status: (0, schema_1.baseEnumSchema)(["PENDING", "OPEN", "RESOLVED", "CANCELLED"], "Dispute status"),
        resolution: (0, schema_1.baseStringSchema)("Resolution details"),
    },
    required: ["status"],
};
exports.p2pDisputeStoreSchema = {
    description: `P2P Dispute created or updated successfully`,
    content: {
        "application/json": {
            schema: {
                type: "object",
                properties: exports.baseP2pDisputeSchema,
            },
        },
    },
};
async function sendP2PDisputeOpenedEmail(disputed, disputer, trade, disputeReason) {
    const emailData = {
        TO: disputed.email,
        PARTICIPANT_NAME: disputed.first_name,
        OTHER_PARTY_NAME: disputer.first_name,
        TRADE_ID: trade.id,
        DISPUTE_REASON: disputeReason,
    };
    await emails_1.emailQueue.add({ emailData, emailType: "P2PDisputeOpened" });
}
exports.sendP2PDisputeOpenedEmail = sendP2PDisputeOpenedEmail;
