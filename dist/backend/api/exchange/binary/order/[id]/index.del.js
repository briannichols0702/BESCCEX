"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const query_1 = require("@b/utils/query");
const error_1 = require("@b/utils/error");
const BinaryOrderService_1 = require("../util/BinaryOrderService");
const binaryProfit = parseFloat(process.env.NEXT_PUBLIC_BINARY_PROFIT || "87");
exports.metadata = {
    summary: "Cancel Binary Order",
    operationId: "cancelBinaryOrder",
    tags: ["Binary", "Orders"],
    description: "Cancels a binary order for the authenticated user.",
    parameters: [
        {
            name: "id",
            in: "path",
            description: "ID of the binary order to cancel.",
            required: true,
            schema: { type: "string" },
        },
    ],
    requestBody: {
        description: "Cancellation percentage data.",
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        percentage: { type: "number" },
                    },
                },
            },
        },
        required: false,
    },
    responses: {
        200: {
            description: "Binary order cancelled",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            message: { type: "string" },
                        },
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("Binary Order"),
        500: query_1.serverErrorResponse,
    },
};
exports.default = async (data) => {
    const { body, params, user } = data;
    if (!(user === null || user === void 0 ? void 0 : user.id))
        throw (0, error_1.createError)({ statusCode: 401, message: "Unauthorized" });
    const { id } = params;
    const { percentage } = body;
    const order = await db_1.models.binaryOrder.findOne({
        where: {
            id,
        },
    });
    if (!order) {
        throw (0, error_1.createError)(404, "Order not found");
    }
    try {
        BinaryOrderService_1.BinaryOrderService.cancelOrder(user.id, id, percentage);
    }
    catch (error) {
        if (error.statusCode === 503) {
            throw error;
        }
        console.error("Error cancelling binary order:", error);
        throw (0, error_1.createError)(500, "An error occurred while cancelling the order");
    }
};
