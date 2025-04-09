"use strict";
// /server/api/exchange/settings/activate-license.post.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const utils_1 = require("@b/api/admin/system/utils");
const utils_2 = require("../../utils");
const query_1 = require("@b/utils/query");
exports.metadata = {
    summary: "Activate Exchange License",
    operationId: "activateLicense",
    tags: ["Admin", "Settings", "Exchange"],
    description: "Activates the license for the exchange product.",
    requiresAuth: true,
    parameters: [
        {
            index: 0,
            in: "path",
            name: "productId",
            description: "Product ID whose license to activate",
            required: true,
            schema: {
                type: "string",
            },
        },
    ],
    requestBody: {
        description: "Product ID, purchase code, and envato username for license activation.",
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        purchaseCode: {
                            type: "string",
                            description: "Purchase code for the license.",
                        },
                        envatoUsername: { type: "string", description: "Envato username." },
                    },
                    required: ["purchaseCode", "envatoUsername"],
                },
            },
        },
        required: true,
    },
    responses: {
        200: {
            description: "License activated successfully",
        },
        401: query_1.unauthorizedResponse,
        404: (0, query_1.notFoundMetadataResponse)("License"),
        500: query_1.serverErrorResponse,
    },
    permission: "Access Exchange Provider Management"
};
exports.default = async (data) => {
    const { body, params } = data;
    const { purchaseCode, envatoUsername } = body;
    const { productId } = params;
    if (!productId || !purchaseCode || !envatoUsername) {
        throw new Error("All fields are required for license activation.");
    }
    const response = await (0, utils_1.activateLicense)(productId, purchaseCode, envatoUsername);
    if (response.lic_response) {
        await (0, utils_2.saveLicense)(productId, envatoUsername);
    }
    return response;
};
