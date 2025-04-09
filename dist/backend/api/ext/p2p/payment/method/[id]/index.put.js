"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
const error_1 = require("@b/utils/error");
exports.metadata = {
    summary: "Updates a specific P2P Payment Method",
    operationId: "updateP2pPaymentMethod",
    tags: ["P2P", "Payment Methods"],
    parameters: [
        {
            name: "id",
            in: "path",
            description: "ID of the P2P Payment Method to update",
            required: true,
            schema: {
                type: "string",
            },
        },
    ],
    requestBody: {
        description: "New data for the P2P Payment Method",
        content: {
            "application/json": {
                schema: utils_1.p2pPaymentMethodUpdateSchema,
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("P2P Payment Method"),
    requiresAuth: true,
};
exports.default = async (data) => {
    const { user, body, params } = data;
    if (!(user === null || user === void 0 ? void 0 : user.id))
        throw (0, error_1.createError)(401, "Unauthorized");
    const { id } = params;
    const updatedFields = {
        instructions: body.instructions,
        image: body.image,
    };
    return await (0, query_1.updateRecord)("p2pPaymentMethod", id, updatedFields, undefined, undefined, { userId: user.id });
};
