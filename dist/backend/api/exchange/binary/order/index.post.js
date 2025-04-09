"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const error_1 = require("@b/utils/error");
const query_1 = require("@b/utils/query");
const BinaryOrderService_1 = require("./util/BinaryOrderService");
const binaryStatus = process.env.NEXT_PUBLIC_BINARY_STATUS === "true";
exports.metadata = {
    summary: "Create Binary Order",
    operationId: "createBinaryOrder",
    tags: ["Binary", "Orders"],
    description: "Creates a new binary order for the authenticated user.",
    requestBody: {
        description: "Binary order data to be created.",
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        currency: { type: "string" },
                        pair: { type: "string" },
                        amount: { type: "number" },
                        side: { type: "string" }, // now can be RISE, FALL, HIGHER, LOWER
                        closedAt: { type: "string", format: "date-time" },
                        isDemo: { type: "boolean" },
                        type: { type: "string" }, // RISE_FALL or HIGHER_LOWER
                        // durationType: { type: "string" }, // TIME or TICKS
                        // barrier: { type: "number" }, // required if type=HIGHER_LOWER
                        // strikePrice: { type: "number" }, // required if type=CALL_PUT
                        // payoutPerPoint: { type: "number" }, // required if type=CALL_PUT
                    },
                    required: ["currency", "pair", "amount", "side", "closedAt", "type"],
                },
            },
        },
        required: true,
    },
    responses: (0, query_1.createRecordResponses)("Binary Order"),
    requiresAuth: true,
};
exports.default = async (data) => {
    if (!binaryStatus) {
        throw (0, error_1.createError)({
            statusCode: 400,
            message: "Binary trading is disabled",
        });
    }
    const { user, body } = data;
    if (!(user === null || user === void 0 ? void 0 : user.id))
        throw (0, error_1.createError)({ statusCode: 401, message: "Unauthorized" });
    // Validate request data
    const { currency, pair, amount, side, type, 
    // durationType,
    // barrier,
    // strikePrice,
    // payoutPerPoint,
    closedAt, isDemo, } = body;
    try {
        const order = await BinaryOrderService_1.BinaryOrderService.createOrder({
            userId: user.id,
            currency,
            pair,
            amount,
            side,
            type: "RISE_FALL",
            // durationType,
            // barrier,
            // strikePrice,
            // payoutPerPoint,
            closedAt,
            isDemo,
        });
        return {
            order,
            message: "Binary order created successfully",
        };
    }
    catch (error) {
        throw (0, error_1.createError)({
            statusCode: (error === null || error === void 0 ? void 0 : error.statusCode) || 500,
            message: error.message || "An error occurred while creating the order",
        });
    }
};
