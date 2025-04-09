"use strict";
// File: backend/utils/logger.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logError = void 0;
const winston_1 = require("winston");
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
const logLevels = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
};
const logging = (0, winston_1.createLogger)({
    levels: logLevels,
    format: winston_1.format.combine(winston_1.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), winston_1.format.json()),
    exceptionHandlers: [new winston_1.transports.File({ filename: "logs/exceptions.log" })],
});
const categoryTransports = new Map();
function ensureCategoryTransport(category) {
    if (!categoryTransports.has(category)) {
        const transport = new winston_daily_rotate_file_1.default({
            filename: `logs/%DATE%.log`,
            datePattern: "YYYY-MM-DD",
            level: "info",
            handleExceptions: true,
            maxSize: "20m",
            maxFiles: "14d",
            format: winston_1.format.combine(winston_1.format.label({ label: category }), winston_1.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), winston_1.format.json()),
        });
        logging.add(transport);
        categoryTransports.set(category, transport);
    }
}
function logger(level, category, file, message) {
    ensureCategoryTransport(category);
    logging.log(level, message, { category, file });
}
function logError(category, error, filePath) {
    const errorMessage = error.message || error.stack || "Unknown error";
    console.log(errorMessage);
    logger("error", category, filePath, errorMessage);
}
exports.logError = logError;
exports.default = logger;
