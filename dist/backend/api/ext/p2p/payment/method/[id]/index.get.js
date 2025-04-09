"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
const error_1 = require("@b/utils/error");
exports.metadata = {
    summary: "Retrieves detailed information of a specific P2P Payment Method by ID",
    operationId: "getP2pPaymentMethodById",
    tags: ["P2P", "Payment Methods"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            required: true,
            description: "ID of the P2P Payment Method to retrieve",
            schema: { type: "string" },
        },
    ],
    responses: {
        200: {
            description: "P2P Payment Method details",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: utils_1.baseP2pPaymentMethodSchema,
                    },
                },
            },
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("P2P Payment Method"),
        500: query_1.serverErrorResponse,
    },
    requiresAuth: true,
};
exports.default = async (data) => {
    const { user, params } = data;
    if (!(user === null || user === void 0 ? void 0 : user.id))
        throw (0, error_1.createError)(401, "Unauthorized");
    return await (0, query_1.getRecord)("p2pPaymentMethod", params.id);
};
