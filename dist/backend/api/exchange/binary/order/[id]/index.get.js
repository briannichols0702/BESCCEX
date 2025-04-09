"use strict";
// /server/api/exchange/binary/orders/show.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const error_1 = require("@b/utils/error");
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
exports.metadata = {
    summary: "Show Binary Order",
    operationId: "showBinaryOrder",
    tags: ["Binary", "Orders"],
    description: "Retrieves a specific binary order by ID for the authenticated user.",
    parameters: [
        {
            name: "id",
            in: "path",
            description: "ID of the binary order to retrieve.",
            required: true,
            schema: { type: "string", format: "uuid" },
        },
    ],
    responses: {
        200: {
            description: "Binary order data",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: utils_1.baseBinaryOrderSchema,
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
    var _a;
    if (!((_a = data.user) === null || _a === void 0 ? void 0 : _a.id))
        throw (0, error_1.createError)({ statusCode: 401, message: "Unauthorized" });
    const { user, params } = data;
    const { id } = params;
    if (!id) {
        throw new Error("Order not found");
    }
    if (!user) {
        throw new Error("Unauthorized");
    }
    const binaryOrder = await (0, utils_1.getBinaryOrder)(user.id, id);
    if (!binaryOrder) {
        throw new Error(`Binary order with ID ${id} not found`);
    }
    return binaryOrder;
};
