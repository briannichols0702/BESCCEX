"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("./utils");
const db_1 = require("@b/db");
exports.metadata = {
    summary: "Stores a new ICO Allocation",
    operationId: "storeIcoAllocation",
    tags: ["Admin", "ICO Allocations"],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: utils_1.icoAllocationUpdateSchema,
            },
        },
    },
    responses: (0, query_1.storeRecordResponses)(utils_1.icoAllocationStoreSchema, "ICO Allocation"),
    requiresAuth: true,
    permission: "Access ICO Allocation Management",
};
exports.default = async (data) => {
    const { body } = data;
    const { name, percentage, tokenId, status, phaseAllocations = [] } = body;
    await db_1.sequelize.transaction(async (t) => {
        const sumOfPercentages = phaseAllocations.reduce((sum, detail) => sum + detail.percentage, 0);
        // Ensure the sum does not exceed 100%
        if (sumOfPercentages > 100) {
            throw new Error("Sum of phase allocation percentages cannot exceed 100%");
        }
        // Check for unique phaseIds for the tokenId
        const existingPhases = await db_1.models.icoPhaseAllocation.findAll({
            include: [
                {
                    model: db_1.models.icoPhase,
                    as: "phase",
                    where: {
                        tokenId,
                    },
                },
            ],
            transaction: t,
        });
        const existingPhaseIds = new Set(existingPhases.map((e) => e.phaseId));
        phaseAllocations.forEach((detail) => {
            if (existingPhaseIds.has(detail.phaseId)) {
                throw new Error(`Phase with ID ${detail.phaseId} already exists for this token`);
            }
        });
        const currentAllocation = await (0, utils_1.calculateCurrentAllocation)(tokenId, t);
        if (currentAllocation + percentage > 100) {
            throw new Error("Total allocation percentage cannot exceed 100%");
        }
        const allocation = await db_1.models.icoAllocation.create({
            name,
            percentage,
            tokenId,
            status,
        }, { transaction: t });
        for (const detail of phaseAllocations) {
            await db_1.models.icoPhaseAllocation.create({
                allocationId: allocation.id,
                phaseId: detail.phaseId,
                percentage: detail.percentage,
            }, { transaction: t });
        }
    });
    return { message: "ICO Allocation created successfully" };
};
