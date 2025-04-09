"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendP2PDisputeClosingEmail = exports.sendP2PDisputeResolvingEmail = exports.sendP2PDisputeResolutionEmail = exports.p2pDisputeStoreSchema = exports.p2pDisputeUpdateSchema = exports.baseP2pDisputeSchema = exports.p2pDisputeSchema = void 0;
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
        status: {
            type: "string",
            description: "Dispute status",
            enum: ["PENDING", "OPEN", "RESOLVED", "CANCELLED"],
        },
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
async function sendP2PDisputeResolutionEmail(participant, trade, resolutionMessage) {
    const emailData = {
        TO: participant.email,
        PARTICIPANT_NAME: participant.firstName,
        TRADE_ID: trade.id,
        RESOLUTION_MESSAGE: resolutionMessage,
    };
    await emails_1.emailQueue.add({ emailData, emailType: "P2PDisputeResolution" });
}
exports.sendP2PDisputeResolutionEmail = sendP2PDisputeResolutionEmail;
async function sendP2PDisputeResolvingEmail(participant, trade) {
    const emailData = {
        TO: participant.email,
        PARTICIPANT_NAME: participant.firstName,
        TRADE_ID: trade.id,
    };
    await emails_1.emailQueue.add({ emailData, emailType: "P2PDisputeResolving" });
}
exports.sendP2PDisputeResolvingEmail = sendP2PDisputeResolvingEmail;
async function sendP2PDisputeClosingEmail(participant, trade) {
    const emailData = {
        TO: participant.email,
        PARTICIPANT_NAME: participant.firstName,
        TRADE_ID: trade.id,
    };
    await emails_1.emailQueue.add({ emailData, emailType: "P2PDisputeClosing" });
}
exports.sendP2PDisputeClosingEmail = sendP2PDisputeClosingEmail;
