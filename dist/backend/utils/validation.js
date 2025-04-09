"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSchema = exports.sanitizePath = void 0;
const ajv_1 = __importDefault(require("./ajv"));
const path_1 = __importDefault(require("path"));
function sanitizePath(inputPath) {
    // Normalize the path to resolve any '..' sequences
    const normalizedPath = path_1.default.normalize(inputPath);
    // Check if the normalized path is still within the intended directory
    if (normalizedPath.includes("..")) {
        throw new Error("Invalid path: Path traversal detected");
    }
    return normalizedPath;
}
exports.sanitizePath = sanitizePath;
function convertBooleanStrings(value) {
    if (typeof value === "string") {
        if (value.toLowerCase() === "true")
            return true;
        if (value.toLowerCase() === "false")
            return false;
    }
    else if (typeof value === "object" && value !== null) {
        for (const key in value) {
            value[key] = convertBooleanStrings(value[key]);
        }
    }
    return value;
}
function validateSchema(value, schema) {
    var _a;
    const ajv = ajv_1.default.getInstance();
    const validate = ajv.compile(schema);
    // Convert boolean strings in the value before validation
    const transformedValue = convertBooleanStrings(value);
    if (!validate(transformedValue)) {
        const errors = (_a = validate.errors) === null || _a === void 0 ? void 0 : _a.reduce((acc, error) => {
            let path = error.instancePath.replace(/^\//, "").replace(/\//g, ".");
            if (path === "") {
                path = error.params.missingProperty;
            }
            const customMessage = formatErrorMessage(path, error, schema);
            acc[path] = customMessage;
            return acc;
        }, {});
        throw new Error(JSON.stringify(formatAjvErrors(errors || {})));
    }
    return transformedValue;
}
exports.validateSchema = validateSchema;
function formatErrorMessage(path, error, schema) {
    const fieldName = toFriendlyName(path);
    const fieldSchema = getFieldSchema(path, schema);
    let message = error.message || "";
    switch (error.keyword) {
        case "required":
            message = `${fieldName} is required.`;
            break;
        case "minLength":
            message = `${fieldName} must be at least ${error.params.limit} characters long.`;
            break;
        case "maxLength":
            message = `${fieldName} must be no more than ${error.params.limit} characters long.`;
            break;
        case "minimum":
            message = `${fieldName} must be at least ${error.params.limit}.`;
            break;
        case "maximum":
            message = `${fieldName} must not exceed ${error.params.limit}.`;
            break;
        case "enum":
            const allowedValues = error.params.allowedValues.join(", ");
            message = `${fieldName} must be one of the following: ${allowedValues}.`;
            break;
        case "pattern":
            message = `${fieldName} is incorrectly formatted. Expected format: ${fieldSchema.expectedFormat ||
                fieldSchema.placeholder ||
                error.params.pattern}`;
            break;
        case "type":
            message = `${fieldName} must be a ${error.params.type}. ${fieldSchema.example ? `Example: ${fieldSchema.example}` : ""}`;
            break;
        default:
            message = `${fieldName} ${message}.`;
            break;
    }
    return message;
}
function getFieldSchema(path, schema) {
    return path
        .split(".")
        .reduce((schema, key) => schema.properties && schema.properties[key], schema);
}
function formatAjvErrors(errors) {
    const errorMessages = {};
    for (const key in errors) {
        errorMessages[key] = [errors[key]];
    }
    return errorMessages;
}
function toFriendlyName(path) {
    // Extract the last part of the path
    const lastSegment = path.split(".").pop() || path;
    // Replace camelCase with spaces and capitalize the first letter
    return lastSegment
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase())
        .trim();
}
