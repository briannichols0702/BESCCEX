"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("../utils");
const db_1 = require("@b/db");
exports.metadata = {
    summary: "Updates a specific ICO Allocation",
    operationId: "updateIcoAllocation",
    tags: ["Admin", "ICO Allocations"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            description: "ID of the ICO Allocation to update",
            required: true,
            schema: {
                type: "string",
            },
        },
    ],
    requestBody: {
        description: "New data for the ICO Allocation",
        content: {
            "application/json": {
                schema: utils_1.icoAllocationUpdateSchema,
            },
        },
    },
    responses: (0, query_1.updateRecordResponses)("ICO Allocation"),
    requiresAuth: true,
    permission: "Access ICO Allocation Management",
};
exports.default = async (data) => {
    const { body, params } = data;
    const { id } = params;
    const { name, percentage, status, phaseAllocations = [] } = body;
    await db_1.sequelize.transaction(async (t) => {
        const allocation = await db_1.models.icoAllocation.findByPk(id, {
            attributes: ["tokenId", "percentage"],
            transaction: t,
        });
        if (!allocation) {
            throw new Error("Allocation not found");
        }
        const currentAllocation = await (0, utils_1.calculateCurrentAllocation)(allocation.tokenId, t);
        const availablePercentage = 100 - (currentAllocation - allocation.percentage);
        if (percentage > availablePercentage) {
            throw new Error("Total allocation percentage cannot exceed 100%");
        }
        // Check if the updated phase allocations are unique and do not exceed 100%
        const existingPhaseAllocations = await db_1.models.icoPhaseAllocation.findAll({
            where: { allocationId: id },
            transaction: t,
        });
        const existingPhaseIds = new Set(existingPhaseAllocations.map((e) => e.phaseId));
        let phasePercentageTotal = 0;
        for (const detail of phaseAllocations) {
            if (existingPhaseIds.has(detail.phaseId) &&
                !existingPhaseAllocations.some((epa) => epa.phaseId === detail.phaseId && epa.allocationId === id)) {
                throw new Error(`Allocation already exists for this token`);
            }
            phasePercentageTotal += detail.percentage;
        }
        if (phasePercentageTotal > availablePercentage) {
            throw new Error("Sum of phase allocation percentages cannot exceed available percentage");
        }
        // Update the allocation
        const updatedAllocation = await db_1.models.icoAllocation.update({
            name,
            percentage,
            status,
        }, {
            where: { id },
            transaction: t,
        });
        // Update phase allocations
        // First, delete existing phase allocations
        await db_1.models.icoPhaseAllocation.destroy({
            where: { allocationId: id },
            transaction: t,
        });
        // Then, create new phase allocations
        for (const detail of phaseAllocations) {
            await db_1.models.icoPhaseAllocation.create({
                allocationId: id,
                phaseId: detail.phaseId,
                percentage: detail.percentage,
            }, { transaction: t });
        }
    });
    return { message: "ICO Allocation updated successfully" };
};
