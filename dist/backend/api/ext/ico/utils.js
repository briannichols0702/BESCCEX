"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePhaseStatus = exports.updateTokensWithPhases = exports.baseIcoProjectSchema = exports.baseIcoPhaseSchema = exports.baseIcoTokenSchema = exports.baseIcoContributionSchema = exports.baseIcoAllocationSchema = void 0;
const schema_1 = require("@b/utils/schema");
const db_1 = require("@b/db");
exports.baseIcoAllocationSchema = {
    id: (0, schema_1.baseStringSchema)("Allocation ID"),
    projectId: (0, schema_1.baseStringSchema)("Associated project ID"),
    amount: (0, schema_1.baseNumberSchema)("Allocated amount"),
    status: (0, schema_1.baseStringSchema)("Allocation status"),
};
exports.baseIcoContributionSchema = {
    id: (0, schema_1.baseStringSchema)("Contribution ID"),
    userId: (0, schema_1.baseStringSchema)("User ID"),
    phaseId: (0, schema_1.baseStringSchema)("Phase ID"),
    amount: (0, schema_1.baseNumberSchema)("Contributed amount"),
    status: (0, schema_1.baseStringSchema)("Contribution status"),
    phase: {
        type: "object",
        properties: {
            token: {
                type: "object",
                properties: {
                    id: (0, schema_1.baseStringSchema)("Token ID"),
                    name: (0, schema_1.baseStringSchema)("Token name"),
                },
            },
        },
    },
};
exports.baseIcoTokenSchema = {
    id: (0, schema_1.baseStringSchema)("ICO token ID"),
    name: (0, schema_1.baseStringSchema)("Token name"),
    status: (0, schema_1.baseStringSchema)("Token status"),
    phases: {
        type: "array",
        items: {
            type: "object",
            properties: {
                id: (0, schema_1.baseStringSchema)("Phase ID"),
                phaseName: (0, schema_1.baseStringSchema)("Phase name"),
                status: (0, schema_1.baseStringSchema)("Phase status"),
                contributionPercentage: (0, schema_1.baseNumberSchema)("Contribution percentage"),
                contributionsCount: (0, schema_1.baseIntegerSchema)("Total contributions count"),
            },
        },
    },
};
exports.baseIcoPhaseSchema = {
    id: (0, schema_1.baseStringSchema)("Phase ID"),
    phaseName: (0, schema_1.baseStringSchema)("Phase name"),
    status: (0, schema_1.baseStringSchema)("Phase status"),
    startDate: (0, schema_1.baseDateTimeSchema)("Start date"),
    endDate: (0, schema_1.baseDateTimeSchema)("End date"),
    token: (0, schema_1.baseObjectSchema)("Associated token details"),
};
exports.baseIcoProjectSchema = {
    id: (0, schema_1.baseStringSchema)("ICO project ID"),
    name: (0, schema_1.baseStringSchema)("Project name"),
    description: (0, schema_1.baseStringSchema)("Project description"),
    status: (0, schema_1.baseStringSchema)("Project status"),
};
async function updateTokensWithPhases(tokens) {
    const currentDate = new Date();
    if (!tokens) {
        return [];
    }
    const processPhase = async (phase, token) => {
        var _a, _b;
        if (currentDate >= phase.endDate && phase.status === "ACTIVE") {
            await updatePhaseStatus(phase.id, "COMPLETED");
            phase.status = "COMPLETED";
        }
        else if (currentDate >= phase.startDate && phase.status === "PENDING") {
            await updatePhaseStatus(phase.id, "ACTIVE");
            phase.status = "ACTIVE";
            return { phase, isAnyPhasePending: true, isAllPhasesCompleted: false };
        }
        else if (phase.status === "ACTIVE" || phase.status === "PENDING") {
            return { phase, isAnyPhasePending: false, isAllPhasesCompleted: false };
        }
        const totalContributions = ((_a = phase.icoContributions) === null || _a === void 0 ? void 0 : _a.reduce((sum, contribution) => sum + contribution.amount, 0)) || 0;
        const contributionCount = ((_b = phase.icoContributions) === null || _b === void 0 ? void 0 : _b.length) || 0;
        const percentage = (totalContributions / token.totalSupply) * 100;
        return {
            phase: {
                ...phase.dataValues,
                contributionPercentage: parseFloat(percentage.toFixed(2)),
                contributions: contributionCount,
            },
            isAnyPhasePending: false,
            isAllPhasesCompleted: true,
        };
    };
    const processToken = async (token) => {
        var _a, _b;
        let isAnyPhasePending = false;
        let isAllPhasesCompleted = true;
        const updatedPhases = await Promise.all(((_a = token.icoPhases) === null || _a === void 0 ? void 0 : _a.map(async (phase) => {
            const { phase: updatedPhase, isAnyPhasePending: phasePending, isAllPhasesCompleted: phasesCompleted, } = await processPhase(phase, token);
            isAnyPhasePending = isAnyPhasePending || phasePending;
            isAllPhasesCompleted = isAllPhasesCompleted && phasesCompleted;
            return updatedPhase;
        })) || []);
        let newTokenStatus = token.status;
        if (isAnyPhasePending || !isAllPhasesCompleted) {
            newTokenStatus = "ACTIVE";
        }
        else if (!((_b = token.icoPhases) === null || _b === void 0 ? void 0 : _b.length)) {
            newTokenStatus = "PENDING";
        }
        if (token.status !== newTokenStatus) {
            await db_1.models.icoToken.update({ status: newTokenStatus }, { where: { id: token.id } });
        }
        return { ...token.dataValues, phases: updatedPhases };
    };
    return await Promise.all(tokens.map(processToken));
}
exports.updateTokensWithPhases = updateTokensWithPhases;
async function updatePhaseStatus(phaseId, newStatus) {
    await db_1.sequelize.transaction(async (transaction) => {
        await db_1.models.icoPhase.update({ status: newStatus }, { where: { id: phaseId }, transaction });
    });
}
exports.updatePhaseStatus = updatePhaseStatus;
