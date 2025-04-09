"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
// file: backend/api/admin/system/database/restore/index.post.ts
const error_1 = require("@b/utils/error");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const promise_1 = require("mysql2/promise");
const validation_1 = require("@b/utils/validation");
exports.metadata = {
    summary: "Restores the database from a backup file",
    description: "Restores the database from a specified backup file",
    operationId: "restoreDatabase",
    tags: ["Admin", "Database"],
    requiresAuth: true,
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        backupFile: {
                            type: "string",
                            description: "Path to the backup file",
                        },
                    },
                    required: ["backupFile"],
                },
            },
        },
    },
    responses: {
        200: {
            description: "Database restored successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            message: {
                                type: "string",
                                description: "Success message",
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
const getDbConnection = async () => {
    const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;
    if (!DB_HOST || !DB_USER || !DB_NAME) {
        throw new Error("Database configuration is incomplete");
    }
    const connection = await (0, promise_1.createConnection)({
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASSWORD || "", // Use an empty string if the password is not set
        database: DB_NAME,
        multipleStatements: true, // This allows executing multiple SQL statements at once
        connectTimeout: 10000, // 10 seconds
    });
    // Set max_allowed_packet size to 64MB
    await connection.query("SET GLOBAL max_allowed_packet = 67108864");
    return connection;
};
const executeSqlStatements = async (connection, sqlStatements) => {
    for (const statement of sqlStatements) {
        try {
            await connection.query(statement);
        }
        catch (error) {
            if (error.code === "ECONNRESET") {
                console.error("Connection was reset. Retrying...", error);
                await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait for 5 seconds
                await executeSqlStatements(connection, [statement]); // Retry the failed statement
            }
            else {
                throw error;
            }
        }
    }
};
const splitSqlFile = (sql) => {
    const statements = sql.split(/;\s*$/m);
    return statements
        .map((statement) => statement.trim())
        .filter((statement) => statement.length > 0);
};
const dropAndRecreateDatabase = async (connection, dbName) => {
    await connection.query(`DROP DATABASE IF EXISTS \`${dbName}\``);
    await connection.query(`CREATE DATABASE \`${dbName}\``);
    await connection.query(`USE \`${dbName}\``);
};
exports.default = async (data) => {
    try {
        checkEnvVariables();
        const { backupFile } = data.body;
        const { DB_NAME } = process.env;
        if (!backupFile) {
            throw new Error("Backup file path is required");
        }
        // Sanitize the backup file path to prevent LFI
        const sanitizedBackupFile = (0, validation_1.sanitizePath)(backupFile);
        const backupPath = path_1.default.resolve(process.cwd(), "backup", sanitizedBackupFile);
        // Ensure the backup file exists
        await fs_1.promises.access(backupPath);
        const sql = await fs_1.promises.readFile(backupPath, "utf8");
        const sqlStatements = splitSqlFile(sql);
        const connection = await getDbConnection();
        try {
            await dropAndRecreateDatabase(connection, DB_NAME);
            await executeSqlStatements(connection, sqlStatements);
            return {
                message: "Database restored successfully",
            };
        }
        finally {
            await connection.end();
        }
    }
    catch (error) {
        throw (0, error_1.createError)({
            statusCode: 500,
            message: `Error restoring database: ${error.message}`,
        });
    }
};
