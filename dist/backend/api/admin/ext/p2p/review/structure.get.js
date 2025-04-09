"use strict";
// /api/p2pReviews/structure.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.p2pReviewStructure = exports.metadata = void 0;
const constants_1 = require("@b/utils/constants");
exports.metadata = {
    summary: "Get form structure for P2P Reviews",
    operationId: "getP2pReviewStructure",
    tags: ["Admin", "P2P Reviews"],
    responses: {
        200: {
            description: "Form structure for managing P2P Reviews",
            content: constants_1.structureSchema,
        },
    },
    permission: "Access P2P Review Management"
};
const p2pReviewStructure = () => {
    const reviewerId = {
        type: "input",
        label: "Reviewer ID",
        name: "reviewerId",
        placeholder: "Enter the reviewer's user ID",
    };
    const reviewedId = {
        type: "input",
        label: "Reviewed ID",
        name: "reviewedId",
        placeholder: "Enter the reviewed user's ID",
    };
    const offerId = {
        type: "input",
        label: "Offer ID",
        name: "offerId",
        placeholder: "Enter the associated offer ID",
    };
    const rating = {
        type: "input",
        label: "Rating",
        name: "rating",
        placeholder: "Rate from 1 to 5",
        ts: "number",
    };
    const comment = {
        type: "textarea",
        label: "Comment",
        name: "comment",
        placeholder: "Write a review comment",
    };
    return {
        reviewerId,
        reviewedId,
        offerId,
        rating,
        comment,
    };
};
exports.p2pReviewStructure = p2pReviewStructure;
exports.default = () => {
    const { reviewerId, reviewedId, offerId, rating, comment } = (0, exports.p2pReviewStructure)();
    return {
        get: [reviewerId, reviewedId, offerId, rating, comment],
        set: [reviewerId, reviewedId, offerId, rating, comment],
    };
};
