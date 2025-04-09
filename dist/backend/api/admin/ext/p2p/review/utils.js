"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.p2pReviewStoreSchema = exports.p2pReviewUpdateSchema = exports.baseP2pReviewSchema = exports.p2pReviewSchema = void 0;
const schema_1 = require("@b/utils/schema");
const id = (0, schema_1.baseStringSchema)("ID of the P2P Review");
const reviewerId = (0, schema_1.baseStringSchema)("ID of the User who made the review");
const reviewedId = (0, schema_1.baseStringSchema)("ID of the User who was reviewed");
const offerId = (0, schema_1.baseStringSchema)("ID of the P2P Offer associated with the review");
const rating = (0, schema_1.baseNumberSchema)("Rating given in the review");
const comment = (0, schema_1.baseStringSchema)("Comment provided in the review", 255, 0, true);
const createdAt = (0, schema_1.baseDateTimeSchema)("Creation date of the review");
const updatedAt = (0, schema_1.baseDateTimeSchema)("Last update date of the review");
exports.p2pReviewSchema = {
    id,
    reviewerId,
    reviewedId,
    offerId,
    rating,
    comment,
    createdAt,
    updatedAt,
};
exports.baseP2pReviewSchema = {
    id,
    reviewerId,
    reviewedId,
    offerId,
    rating,
    comment,
    createdAt,
    updatedAt,
    deletedAt: (0, schema_1.baseDateTimeSchema)("Deletion date of the review, if any"),
};
exports.p2pReviewUpdateSchema = {
    type: "object",
    properties: {
        rating,
        comment,
    },
    required: ["rating"],
};
exports.p2pReviewStoreSchema = {
    description: `P2P Review created or updated successfully`,
    content: {
        "application/json": {
            schema: {
                type: "object",
                properties: exports.baseP2pReviewSchema,
            },
        },
    },
};
