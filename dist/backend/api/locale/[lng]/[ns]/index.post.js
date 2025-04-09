"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addMissingTranslations = exports.metadata = void 0;
const task_1 = require("@b/utils/task");
const fs_1 = require("fs");
const path_1 = require("path");
exports.metadata = {
    summary: "Adds missing translations for the specified language and namespace",
    operationId: "addTranslations",
    tags: ["Translations"],
    parameters: [
        {
            index: 0,
            name: "lng",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Language code",
        },
        {
            index: 1,
            name: "ns",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Namespace",
        },
    ],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    additionalProperties: true,
                },
            },
        },
    },
    responses: {
        200: {
            description: "Translations added successfully",
        },
        500: {
            description: "Internal server error",
        },
    },
};
exports.default = async (data) => {
    const { lng, ns } = data.params;
    const translations = data.body;
    return addMissingTranslations(lng, ns, translations);
};
async function ensureDirectoryExistence(filePath) {
    const dir = (0, path_1.dirname)(filePath);
    try {
        await fs_1.promises.access(dir);
    }
    catch (error) {
        await fs_1.promises.mkdir(dir, { recursive: true });
    }
}
function parseJSONSafe(jsonString) {
    try {
        return JSON.parse(jsonString);
    }
    catch (error) {
        return {};
    }
}
function sortObjectByKey(obj) {
    return Object.keys(obj)
        .sort()
        .reduce((result, key) => {
        result[key] = obj[key];
        return result;
    }, {});
}
async function addMissingTranslations(lng, ns, translations) {
    const filePath = (0, path_1.join)(process.cwd(), "public", "locales", lng, `${ns}.json`);
    await ensureDirectoryExistence(filePath);
    return new Promise((resolve, reject) => {
        task_1.taskQueue.add(async () => {
            try {
                const fileData = await fs_1.promises.readFile(filePath, "utf8").catch(() => "{}");
                const existingTranslations = parseJSONSafe(fileData);
                // Merge existing translations with new translations, ensuring no duplicates
                const updatedTranslations = {
                    ...existingTranslations,
                    ...translations,
                };
                // Sort the merged translations alphabetically by key
                const sortedTranslations = sortObjectByKey(updatedTranslations);
                // Ensure the JSON is pretty printed
                const prettyJson = JSON.stringify(sortedTranslations, null, 2);
                // Save the updated translations back to the file
                await fs_1.promises.writeFile(filePath, prettyJson, "utf8");
                resolve();
            }
            catch (error) {
                console.error("Error writing translation file:", error);
                reject(new Error("Error writing translation file"));
            }
        });
    });
}
exports.addMissingTranslations = addMissingTranslations;
