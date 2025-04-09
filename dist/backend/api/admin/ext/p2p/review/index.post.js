"use strict";
// /api/p2p/reviews/store.post.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("./utils");
exports.metadata = {
    summary: "Stores a new P2P Review",
    operationId: "storeP2PReview",
    tags: ["Admin", "P2P", "Reviews"],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: utils_1.p2pReviewUpdateSchema,
            },
        },
    },
    responses: (0, query_1.storeRecordResponses)(utils_1.p2pReviewStoreSchema, "P2P Review"),
    requiresAuth: true,
    permission: "Access P2P Review Management",
};
exports.default = async (data) => {
    const { body } = data;
    const { reviewerId, reviewedId, offerId, rating, comment } = body;
    return await (0, query_1.storeRecord)({
        model: "p2pReview",
        data: {
            reviewerId,
            reviewedId,
            offerId,
            rating,
            comment,
        },
    });
};
