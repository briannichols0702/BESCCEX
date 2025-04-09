"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const error_1 = require("@b/utils/error");
const utils_1 = require("../utils");
exports.metadata = {
    summary: "Pay an ICO contribution",
    description: "Processes the payment for a specific ICO contribution.",
    operationId: "payContribution",
    tags: ["Admin", "ICO"],
    parameters: [
        {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "number", description: "Contribution ID" },
        },
    ],
    responses: {
        200: {
            description: "ICO contribution paid successfully",
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
        404: {
            description: "ICO contribution not found",
        },
        500: {
            description: "Internal server error",
        },
    },
    permission: "Access ICO Contribution Management"
};
exports.default = async (data) => {
    const { params } = data;
    const { id } = params;
    const contribution = await db_1.models.icoContribution.findByPk(id, {
        include: [
            {
                model: db_1.models.icoPhase,
                include: [{ model: db_1.models.icoToken, as: "token" }],
            },
        ],
    });
    if (!contribution) {
        throw (0, error_1.createError)({
            statusCode: 404,
            message: "ICO contribution not found",
        });
    }
    if (contribution.status !== "PENDING") {
        throw new Error("Contribution is not in a payable state");
    }
    const user = await db_1.models.user.findByPk(contribution.userId);
    if (!user) {
        throw new Error("User not found");
    }
    const transaction = await db_1.models.transaction.findOne({
        where: {
            referenceId: contribution.id,
        },
    });
    if (!transaction) {
        throw new Error("Transaction not found");
    }
    contribution.status = "COMPLETED";
    await contribution.save();
    try {
        await (0, utils_1.sendIcoContributionEmail)(user, contribution, contribution.phase.token, contribution.phase, "IcoContributionPaid", transaction.id);
    }
    catch (error) {
        console.error("Failed to send email", error);
    }
    return {
        message: "ICO contribution paid successfully",
    };
};
