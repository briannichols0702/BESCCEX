"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
const db_1 = require("@b/db");
const sequelize_1 = require("sequelize");
exports.metadata = {
    summary: "Updates a specific ICO Phase",
    operationId: "updateIcoPhase",
    tags: ["Admin", "ICO Phases"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            description: "ID of the ICO Phase to update",
            required: true,
            schema: {
                type: "string",
            },
        },
    ],
    requestBody: {
        description: "New data for the ICO Phase",
        content: {
            "application/json": {
                schema: utils_1.icoPhaseUpdateSchema,
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("ICO Phase"),
    requiresAuth: true,
    permission: "Access ICO Phase Management",
};
exports.default = async (data) => {
    const { body, params } = data;
    const { id } = params;
    const { name, startDate, endDate, price, status, minPurchase, maxPurchase } = body;
    const phase = await db_1.models.icoPhase.findByPk(id);
    if (!phase) {
        throw new Error("Phase not found");
    }
    // Retrieve existing phases to check for overlap
    const existingPhases = await db_1.models.icoPhase.findAll({
        where: {
            tokenId: phase.tokenId,
            id: {
                [sequelize_1.Op.ne]: id,
            },
            status: ["PENDING", "ACTIVE"],
        },
    });
    const isOverlap = existingPhases.some((phase) => {
        return ((startDate >= phase.startDate && startDate <= phase.endDate) ||
            (endDate >= phase.startDate && endDate <= phase.endDate) ||
            (startDate <= phase.startDate && endDate >= phase.endDate));
    });
    if (isOverlap) {
        throw new Error("Cannot update the phase due to overlap with an existing phase.");
    }
    const activePhase = await db_1.models.icoPhase.findOne({
        where: {
            tokenId: phase.tokenId,
            status: "ACTIVE",
            endDate: {
                lt: startDate,
            },
            id: {
                [sequelize_1.Op.ne]: id,
            },
        },
    });
    let newStatus = status;
    if (activePhase) {
        newStatus = IcoPhaseStatus.PENDING;
    }
    await db_1.models.icoPhase.update({
        name,
        startDate,
        endDate,
        price,
        status: newStatus,
        minPurchase,
        maxPurchase,
    }, {
        where: { id },
    });
    return { message: "Phase updated successfully" };
};
