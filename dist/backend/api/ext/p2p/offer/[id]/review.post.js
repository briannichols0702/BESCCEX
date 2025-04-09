"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const error_1 = require("@b/utils/error");
const query_1 = require("@b/utils/query");
const utils_1 = require("../../trade/utils");
const notifications_1 = require("@b/utils/notifications");
exports.metadata = {
    summary: "Creates a review for a P2P offer",
    description: "Allows a user to post a review for a P2P offer they have interacted with.",
    operationId: "createUserReview",
    tags: ["P2P", "Reviews"],
    requiresAuth: true,
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", description: "P2P offer Id" },
        },
    ],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        rating: {
                            type: "number",
                            description: "Rating given to the offer",
                        },
                        comment: { type: "string", description: "Comment about the offer" },
                    },
                    required: ["rating", "comment"],
                },
            },
        },
    },
    responses: {
        201: {
            description: "Review created successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            message: { type: "string", description: "Success message" },
                        },
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("P2P Offer"),
        500: query_1.serverErrorResponse,
    },
};
exports.default = async (data) => {
    const { params, body, user } = data;
    if (!(user === null || user === void 0 ? void 0 : user.id)) {
        throw (0, error_1.createError)({ statusCode: 401, message: "Unauthorized" });
    }
    const { id } = params;
    const { comment, rating } = body;
    const offer = await db_1.models.p2pOffer.findOne({
        where: { id },
        include: [{ model: db_1.models.user, as: "user" }],
    });
    if (!offer) {
        throw (0, error_1.createError)({
            statusCode: 404,
            message: "Offer not found",
        });
    }
    if (offer.userId === user.id) {
        throw (0, error_1.createError)({
            statusCode: 403,
            message: "Unauthorized: Cannot review your own offer",
        });
    }
    // First, check if the review already exists
    const review = await db_1.models.p2pReview.findOne({
        where: {
            reviewerId: user.id,
            reviewedId: offer.userId,
            offerId: offer.id,
        },
    });
    // Create or update the review
    if (review) {
        await review.update({
            rating,
            comment,
        });
    }
    else {
        await db_1.models.p2pReview.create({
            reviewerId: user.id,
            reviewedId: offer.userId,
            offerId: offer.id,
            rating,
            comment,
        });
    }
    try {
        const reviewer = await db_1.models.user.findByPk(user.id);
        if (!reviewer) {
            throw (0, error_1.createError)({
                statusCode: 404,
                message: "Reviewer not found",
            });
        }
        // Send notification email
        await (0, utils_1.sendP2PReviewNotificationEmail)(offer.user, reviewer, offer, rating, comment);
        await (0, notifications_1.handleNotification)({
            userId: offer.userId,
            title: "New review",
            message: `You have received a new review for offer #${offer.id}`,
            type: "ACTIVITY",
        });
    }
    catch (error) {
        console.error(error);
    }
    return {
        message: "Review created successfully",
    };
};
