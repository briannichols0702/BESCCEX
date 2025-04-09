"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilteredLogs = exports.metadata = void 0;
const constants_1 = require("@b/utils/constants");
const fs_1 = require("fs");
const path_1 = require("path");
const utils_1 = require("./utils");
const validation_1 = require("@b/utils/validation");
exports.metadata = {
    summary: "Fetches log files based on category and date",
    operationId: "fetchLogFiles",
    tags: ["Admin", "Logs"],
    parameters: constants_1.crudParameters,
    responses: {
        200: {
            description: "Log entries for the given category and date",
            content: {
                "application/json": {
                    schema: {
                        type: "array",
                        items: {
                            type: "object",
                            additionalProperties: true,
                        },
                    },
                },
            },
        },
        400: {
            description: "Bad request if the category or date are not specified",
        },
        404: { description: "Not found if the log file does not exist" },
        500: { description: "Internal server error" },
    },
    requiresAuth: true,
    permission: "Access Log Monitor",
};
exports.default = async (data) => {
    const { query } = data;
    return getFilteredLogs(query);
};
async function getFilteredLogs(query) {
    var _a;
    const page = query.page ? parseInt(query.page) : 1;
    const perPage = query.perPage ? parseInt(query.perPage) : 10;
    const sortField = query.sortField || "timestamp";
    const sortOrder = query.sortOrder || "asc";
    const filters = query.filter ? JSON.parse(query.filter) : {};
    const date = ((_a = filters.date) === null || _a === void 0 ? void 0 : _a.value) || new Date().toISOString().split("T")[0];
    delete filters.date;
    // Sanitize the log file path to prevent LFI
    const sanitizedDate = (0, validation_1.sanitizePath)(date); // No need to replace dashes
    const logFilePath = (0, path_1.join)(process.cwd(), "logs", `${sanitizedDate}.log`);
    let data;
    try {
        data = await fs_1.promises.readFile(logFilePath, { encoding: "utf8" });
    }
    catch (error) {
        console.error(`Error reading log file: ${error.message}`);
        if (error.code === "ENOENT") {
            return {
                items: [],
                pagination: {
                    totalItems: 0,
                    currentPage: page,
                    perPage,
                    totalPages: 0,
                },
            };
        }
        throw error;
    }
    let logs = data
        .split("\n")
        .filter((line) => line.trim())
        .map((line, index) => {
        try {
            const parsedLine = JSON.parse(line);
            return { id: index.toString(), ...parsedLine };
        }
        catch (parseError) {
            console.error(`Error parsing log line: ${line}`);
            return null;
        }
    })
        .filter(Boolean);
    // Apply filters with operators
    logs = logs.filter((log) => Object.entries(filters).every(([key, filter]) => {
        const { value, operator } = typeof filter === "object"
            ? filter
            : { value: filter, operator: "equal" };
        const operation = utils_1.operatorMap[operator];
        return operation ? operation(log, key, value) : true;
    }));
    // Sort logs
    logs.sort((a, b) => {
        if (a[sortField] < b[sortField])
            return sortOrder === "asc" ? -1 : 1;
        if (a[sortField] > b[sortField])
            return sortOrder === "asc" ? 1 : -1;
        return 0;
    });
    // Pagination
    const totalItems = logs.length;
    const totalPages = Math.ceil(totalItems / perPage);
    const offset = (page - 1) * perPage;
    logs = logs.slice(offset, offset + perPage);
    return {
        items: logs,
        pagination: {
            totalItems,
            currentPage: page,
            perPage,
            totalPages,
        },
    };
}
exports.getFilteredLogs = getFilteredLogs;
