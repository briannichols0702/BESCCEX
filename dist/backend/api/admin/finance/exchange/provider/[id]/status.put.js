"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const query_1 = require("@b/utils/query");
const sequelize_1 = require("sequelize");
exports.metadata = {
    summary: "Updates the status of an Exchange",
    operationId: "updateExchangeStatus",
    tags: ["Admin", "Exchanges"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            required: true,
            description: "ID of the exchange to update",
            schema: { type: "string" },
        },
    ],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        status: {
                            type: "boolean",
                            description: "New status to apply (true for active, false for inactive)",
                        },
                    },
                    required: ["status"],
                },
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("Exchange"),
    requiresAuth: true,
    permission: "Access Exchange Provider Management",
};
exports.default = async (data) => {
    const { body, params } = data;
    const { id } = params;
    const { status } = body;
    const transaction = await db_1.sequelize.transaction();
    try {
        // Deactivate all other exchanges if status is true
        if (status) {
            await db_1.models.exchange.update({ status: false }, { where: { id: { [sequelize_1.Op.ne]: id } }, transaction });
        }
        // Update the status of the selected exchange
        await db_1.models.exchange.update({ status }, { where: { id }, transaction });
        await transaction.commit();
        return {
            statusCode: 200,
            body: {
                message: "Exchange status updated successfully",
            },
        };
    }
    catch (error) {
        await transaction.rollback();
        return {
            statusCode: 500,
            body: {
                message: "Failed to update exchange status",
                error: error.message,
            },
        };
    }
};
