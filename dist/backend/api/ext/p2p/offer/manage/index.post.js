"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const error_1 = require("@b/utils/error");
exports.metadata = {
    summary: "Creates a new P2P offer",
    description: "Allows a user to create a new P2P trading offer.",
    operationId: "createUserOffer",
    tags: ["P2P", "Offers"],
    requiresAuth: true,
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        paymentMethodId: {
                            type: "string",
                            description: "Payment method ID",
                        },
                        walletType: { type: "string", description: "Type of the wallet" },
                        chain: {
                            type: "string",
                            description: "Blockchain chain if applicable",
                            nullable: true,
                        },
                        currency: { type: "string", description: "Currency of the offer" },
                        price: {
                            type: "number",
                            description: "Price per unit of currency",
                        },
                        minAmount: {
                            type: "number",
                            description: "Minimum transaction amount",
                        },
                        maxAmount: {
                            type: "number",
                            description: "Maximum transaction amount",
                        },
                    },
                    required: [
                        "walletType",
                        "currency",
                        "price",
                        "paymentMethodId",
                        "minAmount",
                        "maxAmount",
                    ],
                },
            },
        },
    },
    responses: {
        201: {
            description: "P2P offer created successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            message: {
                                type: "string",
                                example: "P2P offer created successfully",
                            },
                        },
                    },
                },
            },
        },
        401: {
            description: "Unauthorized, user must be authenticated",
        },
        500: {
            description: "Internal server error",
        },
    },
};
exports.default = async (data) => {
    const { body, user } = data;
    if (!(user === null || user === void 0 ? void 0 : user.id)) {
        throw (0, error_1.createError)({ statusCode: 401, message: "Unauthorized" });
    }
    let currency;
    switch (body.walletType) {
        case "FIAT":
            currency = await db_1.models.currency.findOne({
                where: { id: body.currency, status: true },
            });
            if (!currency) {
                throw (0, error_1.createError)(400, "Currency not found");
            }
            break;
        case "SPOT":
            currency = await db_1.models.exchangeCurrency.findOne({
                where: { currency: body.currency, status: true },
            });
            if (!currency) {
                throw (0, error_1.createError)(400, "Currency not found");
            }
            break;
        case "ECO":
            currency = await db_1.models.ecosystemToken.findOne({
                where: { currency: body.currency, status: true },
            });
            if (!currency) {
                throw (0, error_1.createError)(400, "Currency not found");
            }
            break;
        default:
            throw (0, error_1.createError)(400, "Invalid wallet type");
    }
    await db_1.sequelize.transaction(async (transaction) => {
        const content = {
            userId: user.id,
            walletType: body.walletType,
            ...(body.walletType === "ECO" && body.chain && { chain: body.chain }),
            currency: body.currency,
            amount: 0,
            inOrder: 0,
            price: body.price,
            paymentMethodId: body.paymentMethodId,
            minAmount: body.minAmount,
            maxAmount: body.maxAmount,
        };
        // Create the offer
        return await db_1.models.p2pOffer.create({
            ...content,
            status: "PENDING",
        }, { transaction });
    });
    return {
        message: "P2P offer created successfully",
    };
};
