"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const constants_1 = require("@b/utils/constants");
const query_1 = require("@b/utils/query");
const fs_1 = require("fs");
const path_1 = require("path");
const validation_1 = require("@b/utils/validation");
exports.metadata = {
    summary: "Bulk deletes log entries by IDs",
    operationId: "bulkDeleteLogEntries",
    tags: ["Admin", "Logs"],
    parameters: constants_1.crudParameters,
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        ids: {
                            type: "array",
                            items: { type: "string" },
                            description: "Array of log entry IDs to delete",
                        },
                    },
                    required: ["ids"],
                },
            },
        },
    },
    responses: (0, query_1.commonBulkDeleteResponses)("Log Entries"),
    requiresAuth: true,
    permission: "Access Log Monitor",
};
exports.default = async (data) => {
    const { body, query } = data;
    const { ids } = body;
    const filter = query.filter ? JSON.parse(query.filter) : {};
    const date = filter.date || new Date().toISOString().split("T")[0];
    delete filter.date;
    const page = query.page ? parseInt(query.page) : 1;
    const perPage = query.perPage ? parseInt(query.perPage) : 10;
    // Sanitize the log file path to prevent LFI
    const sanitizedDate = (0, validation_1.sanitizePath)(date);
    const logFilePath = (0, path_1.join)(process.cwd(), "logs", `${sanitizedDate}.log`);
    await bulkDeleteLogEntries(logFilePath, ids, page, perPage);
    return { message: "Log entries deleted successfully" };
};
async function bulkDeleteLogEntries(filePath, ids, page, perPage) {
    const data = await fs_1.promises.readFile(filePath, { encoding: "utf8" });
    const logs = data.split("\n").filter((line) => line.trim());
    // Calculate actual indices in the original file
    const actualIndices = ids
        .map((id) => (page - 1) * perPage + parseInt(id))
        .sort((a, b) => b - a);
    for (const index of actualIndices) {
        if (index >= logs.length) {
            throw new Error("Log entry not found");
        }
        logs.splice(index, 1);
    }
    // Rewrite the file without the deleted entries
    const updatedContent = logs.join("\n");
    await fs_1.promises.writeFile(filePath, updatedContent, { encoding: "utf8" });
}
