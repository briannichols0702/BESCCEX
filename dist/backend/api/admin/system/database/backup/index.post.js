"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
// file: backend/api/admin/system/database/backup/index.post.ts
const error_1 = require("@b/utils/error");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const mysqldump_1 = __importDefault(require("mysqldump"));
const date_fns_1 = require("date-fns");
exports.metadata = {
    summary: "Backs up the database",
    description: "Creates a backup of the entire database",
    operationId: "backupDatabase",
    tags: ["Admin", "Database"],
    requiresAuth: true,
    responses: {
        200: {
            description: "Database backup created successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            message: {
                                type: "string",
                                description: "Success message",
                            },
                            backupFile: {
                                type: "string",
                                description: "Path to the backup file",
                            },
                        },
                    },
                },
            },
        },
        500: {
            description: "Internal server error",
        },
    },
    permission: "Access Database Backup Management"
};
const checkEnvVariables = () => {
    const requiredEnvVars = ["DB_HOST", "DB_USER", "DB_NAME"];
    requiredEnvVars.forEach((varName) => {
        if (!process.env[varName]) {
            throw new Error(`Environment variable ${varName} is not set`);
        }
    });
};
const getDbConnection = () => {
    const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;
    if (!DB_HOST || !DB_USER || !DB_NAME) {
        throw new Error("Database configuration is incomplete");
    }
    return {
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASSWORD || "", // Use an empty string if the password is not set
        database: DB_NAME,
    };
};
exports.default = async (data) => {
    try {
        checkEnvVariables();
        const connection = getDbConnection();
        const backupDir = path_1.default.resolve(process.cwd(), "backup");
        const backupFileName = `${(0, date_fns_1.format)(new Date(), "yyyy_MM_dd_HH_mm_ss")}.sql`;
        const backupPath = path_1.default.resolve(backupDir, backupFileName);
        // Ensure the backup directory exists
        await fs_1.promises.mkdir(backupDir, { recursive: true });
        await (0, mysqldump_1.default)({
            connection,
            dumpToFile: backupPath,
        });
        return {
            message: "Database backup created successfully",
        };
    }
    catch (error) {
        throw (0, error_1.createError)({
            statusCode: 500,
            message: error.message,
        });
    }
};
