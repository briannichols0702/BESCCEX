"use strict";
// /server/api/admin/deposit/gateways/[id]/update.put.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
exports.metadata = {
    summary: "Updates a specific deposit gateway",
    operationId: "updateDepositGateway",
    tags: ["Admin", "Deposit Gateways"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            description: "ID of the deposit gateway to update",
            required: true,
            schema: {
                type: "string",
            },
        },
    ],
    requestBody: {
        description: "New data for the deposit gateway",
        content: {
            "application/json": {
                schema: utils_1.gatewayUpdateSchema,
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("Deposit Gateway"),
    requiresAuth: true,
    permission: "Access Deposit Gateway Management",
};
exports.default = async (data) => {
    const { body, params } = data;
    const { id } = params;
    const { name, title, description, image, fixedFee, percentageFee, minAmount, maxAmount, status, } = body;
    return await (0, query_1.updateRecord)("depositGateway", id, {
        name,
        title,
        description,
        image,
        fixedFee,
        percentageFee,
        minAmount,
        maxAmount,
        status,
    });
};
