"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePhaseStatus = exports.getIcoPhases = exports.processIcoPhases = void 0;
const db_1 = require("@b/db");
const sequelize_1 = require("sequelize");
const logger_1 = require("../logger");
async function processIcoPhases() {
    try {
        const phases = await getIcoPhases();
        const currentDate = new Date();
        for (const phase of phases) {
            try {
                if (currentDate >= phase.endDate && phase.status === "ACTIVE") {
                    await updatePhaseStatus(phase.id, "COMPLETED");
                }
                else if (currentDate >= phase.startDate &&
                    phase.status === "PENDING") {
                    await updatePhaseStatus(phase.id, "ACTIVE");
                }
            }
            catch (error) {
                (0, logger_1.logError)(`processIcoPhases`, error, __filename);
            }
        }
    }
    catch (error) {
        (0, logger_1.logError)("processIcoPhases", error, __filename);
        throw error;
    }
}
exports.processIcoPhases = processIcoPhases;
async function getIcoPhases() {
    try {
        return await db_1.models.icoPhase.findAll({
            where: {
                [sequelize_1.Op.or]: [{ status: "PENDING" }, { status: "ACTIVE" }],
            },
            include: [
                {
                    model: db_1.models.icoToken,
                    as: "token",
                },
            ],
        });
    }
    catch (error) {
        (0, logger_1.logError)("getIcoPhases", error, __filename);
        throw error;
    }
}
exports.getIcoPhases = getIcoPhases;
async function updatePhaseStatus(id, status) {
    try {
        await db_1.models.icoPhase.update({ status }, {
            where: { id },
        });
    }
    catch (error) {
        (0, logger_1.logError)(`updatePhaseStatus`, error, __filename);
        throw error;
    }
}
exports.updatePhaseStatus = updatePhaseStatus;
