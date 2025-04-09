"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLogEntry = exports.metadata = void 0;
const constants_1 = require("@b/utils/constants");
const error_1 = require("@b/utils/error");
const query_1 = require("@b/utils/query");
const fs_1 = require("fs");
const path_1 = require("path");
const validation_1 = require("@b/utils/validation");
exports.metadata = {
    summary: "Deletes a specific log entry based on its ID",
    operationId: "deleteLogEntry",
    tags: ["Admin", "Logs"],
    parameters: [
        {
            index: 0,
            name: "id",
            in: "path",
            description: "ID of the log entry to delete",
            required: true,
            schema: {
                type: "string",
            },
        },
        ...constants_1.crudParameters,
    ],
    responses: (0, query_1.deleteRecordResponses)("Log Entry"),
    requiresAuth: true,
    permission: "Access Log Monitor",
};
exports.default = async (data) => {
    const { params, query } = data;
    const filter = query.filter ? JSON.parse(query.filter) : {};
    const date = filter.date || new Date().toISOString().split("T")[0];
    delete filter.date;
    const { id } = params;
    const page = query.page ? parseInt(query.page) : 1;
    const perPage = query.perPage ? parseInt(query.perPage) : 10;
    // Sanitize the log file path to prevent LFI
    const sanitizedDate = (0, validation_1.sanitizePath)(date);
    const logFilePath = (0, path_1.join)(process.cwd(), "logs", `${sanitizedDate}.log`);
    await deleteLogEntry(logFilePath, page, parseInt(id), perPage);
    return { message: "Log entry deleted successfully" };
};
async function deleteLogEntry(filePath, page, pageIndex, perPage) {
    const data = await fs_1.promises.readFile(filePath, { encoding: "utf8" });
    const logs = data.split("\n").filter((line) => line.trim());
    // Calculate the actual index in the original file
    const actualIndex = (page - 1) * perPage + pageIndex;
    if (actualIndex >= logs.length) {
        throw (0, error_1.createError)(404, "Log entry not found");
    }
    // Remove the log entry by actual index
    logs.splice(actualIndex, 1);
    // Rewrite the file without the deleted entry
    const updatedContent = logs.join("\n");
    await fs_1.promises.writeFile(filePath, updatedContent, { encoding: "utf8" });
}
exports.deleteLogEntry = deleteLogEntry;
