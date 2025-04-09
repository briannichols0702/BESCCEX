"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const db_1 = require("@b/db");
const query_1 = require("@b/utils/query");
const sequelize_1 = require("sequelize");
exports.metadata = {
    summary: "Updates the status of a KYC template",
    operationId: "updateKycTemplateStatus",
    tags: ["Admin", "CRM", "KYC Template"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            required: true,
            description: "ID of the KYC template to update",
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
    responses: (0, query_1.updateRecordResponses)("KYC Template"),
    requiresAuth: true,
    permission: "Access KYC Template Management",
};
exports.default = async (data) => {
    const { body, params } = data;
    const { id } = params;
    const { status } = body;
    const transaction = await db_1.sequelize.transaction();
    try {
        // Deactivate all other templates if status is true
        if (status) {
            await db_1.models.kycTemplate.update({ status: false }, { where: { id: { [sequelize_1.Op.ne]: id } }, transaction });
        }
        // Update the status of the selected template
        await db_1.models.kycTemplate.update({ status }, { where: { id }, transaction });
        await transaction.commit();
        return {
            statusCode: 200,
            body: {
                message: "KYC template status updated successfully",
            },
        };
    }
    catch (error) {
        await transaction.rollback();
        return {
            statusCode: 500,
            body: {
                message: "Failed to update KYC template status",
                error: error.message,
            },
        };
    }
};
