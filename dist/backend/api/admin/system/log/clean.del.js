"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const constants_1 = require("@b/utils/constants");
const query_1 = require("@b/utils/query");
const fs_1 = require("fs");
const path_1 = require("path");
exports.metadata = {
    summary: "Completely clean all logs in the logs folder",
    operationId: "cleanAllLogs",
    tags: ["Admin", "Logs"],
    parameters: constants_1.crudParameters,
    responses: (0, query_1.commonBulkDeleteResponses)("Log Entries"),
    requiresAuth: true,
    permission: "Access Log Monitor",
};
exports.default = async (data) => {
    const logsDirectory = (0, path_1.join)(process.cwd(), "logs");
    await cleanAllLogs(logsDirectory);
    return { message: "All log entries deleted successfully" };
};
async function cleanAllLogs(logsDirectory) {
    const logFiles = await fs_1.promises.readdir(logsDirectory);
    const deletePromises = logFiles.map((logFile) => {
        const logFilePath = (0, path_1.join)(logsDirectory, logFile);
        return fs_1.promises.unlink(logFilePath);
    });
    await Promise.all(deletePromises);
}
