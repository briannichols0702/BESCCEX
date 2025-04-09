"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const error_1 = require("@b/utils/error");
const promise_1 = require("mysql2/promise");
const uuid_1 = require("uuid");
const zlib_1 = require("zlib");
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const Websocket_1 = require("@b/handler/Websocket");
const utils_1 = require("./utils");
const sql2json_1 = __importDefault(require("@b/utils/sql2json")); // Ensure this path is correct
exports.metadata = {
    summary: "Migrates data from a SQL file to the new database",
    description: "Transforms field names and inserts records into the new database",
    operationId: "migrateDatabase",
    tags: ["Admin", "Database"],
    requiresAuth: true,
    responses: {
        200: {
            description: "Database migration initiated",
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
    permission: "Access Database Migration Management"
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
        password: DB_PASSWORD || "",
        database: DB_NAME,
        multipleStatements: true,
        connectTimeout: 10000,
    });
    return connection;
};
const generateIdMapping = (records, tableName, hasUuid) => {
    const idMapping = {};
    records.forEach((record) => {
        const oldId = record[0]; // Assuming id is the first column
        const newId = hasUuid && record[1] ? record[1] : (0, uuid_1.v4)(); // Use existing uuid or generate new one
        idMapping[`${tableName}_${oldId}`] = newId;
    });
    return idMapping;
};
const sendMessage = async (route, message, status) => {
    await (0, Websocket_1.sendMessageToRoute)(route, {}, { status, message });
};
const migrateTable = async (connection, tableConfig, records, idMapping, blacklist, tableStats, lastSuccessMessagePerTable) => {
    const { newTable, transform, oldTable } = tableConfig;
    const transformedRecords = records
        .map((record) => {
        if (record.address && typeof record.address === "string") {
            try {
                record.address = JSON.parse(record.address);
            }
            catch (e) {
                console.error(`Failed to parse address JSON: ${record.address}`);
                tableStats[oldTable].failed++;
                return null;
            }
        }
        return transform(record, idMapping, oldTable);
    })
        .filter((record) => record !== null); // Skip null records
    for (let i = 0; i < transformedRecords.length; i++) {
        const record = transformedRecords[i];
        const columns = Object.keys(record)
            .map((col) => `\`${col}\``) // Enclose column names in backticks
            .join(", ");
        const placeholders = Object.keys(record)
            .map(() => "?")
            .join(", ");
        const values = Object.values(record);
        const percentage = ((i + 1) / transformedRecords.length) * 100;
        const message = `[${i + 1}/${transformedRecords.length}, ${percentage.toFixed(2)}%] Processing table: ${oldTable}`;
        try {
            await connection.query(`INSERT INTO \`${newTable}\` (${columns}) VALUES (${placeholders})`, values);
            tableStats[oldTable].inserted++;
            if (lastSuccessMessagePerTable[oldTable] === message) {
                await sendMessage("/api/admin/system/database/migrate", message, true);
            }
            else {
                await sendMessage("/api/admin/system/database/migrate", message, true);
                lastSuccessMessagePerTable[oldTable] = message;
            }
        }
        catch (error) {
            tableStats[oldTable].failed++;
            await sendMessage("/api/admin/system/database/migrate", `Failed to insert into ${newTable}: ${error.message}`, false);
            if (error.code === "ER_NO_REFERENCED_ROW_2" ||
                error.code === "ER_ROW_IS_REFERENCED_2") {
                console.error(`Foreign key constraint error for record: ${JSON.stringify(record)}`);
                continue;
            }
            if (error.code === "ER_DUP_ENTRY") {
                const duplicateFieldMatch = error.message.match(/for key '(.+)'/);
                if (duplicateFieldMatch) {
                    const duplicateField = duplicateFieldMatch[1];
                    blacklist.add(duplicateField);
                    tableStats[oldTable].blacklisted++;
                    continue;
                }
            }
            throw new Error(`Failed to insert into ${newTable}: ${error.message}`);
        }
    }
};
exports.default = async (data) => {
    var _a;
    await sendMessage("/api/admin/system/database/migrate", "Migration initiated", true);
    const connection = await getDbConnection();
    const maxRetries = 5;
    const retryDelay = 3000; // 3 seconds
    let retries = 0;
    let success = false;
    while (retries < maxRetries && !success) {
        try {
            await connection.beginTransaction();
            checkEnvVariables();
            const filePath = path_1.default.resolve(process.cwd(), "migration.sql");
            const gzFilePath = path_1.default.resolve(process.cwd(), "migration.sql.gz");
            let sqlData;
            if (await promises_1.default
                .access(gzFilePath)
                .then(() => true)
                .catch(() => false)) {
                const buffer = await promises_1.default.readFile(gzFilePath);
                sqlData = (0, zlib_1.gunzipSync)(buffer).toString("utf-8");
            }
            else if (await promises_1.default
                .access(filePath)
                .then(() => true)
                .catch(() => false)) {
                sqlData = await promises_1.default.readFile(filePath, "utf-8");
            }
            else {
                throw new Error("Migration file not found");
            }
            await sendMessage("/api/admin/system/database/migrate", "SQL file loaded successfully", true);
            const requiredTables = new Set(utils_1.tableConfigs.map((config) => config.oldTable));
            const insertStatements = (0, sql2json_1.default)(sqlData, requiredTables);
            const idMapping = {};
            const blacklist = new Set();
            const tableStats = {};
            const lastSuccessMessagePerTable = {};
            for (const tableConfig of utils_1.tableConfigs) {
                const records = ((_a = insertStatements[tableConfig.oldTable]) === null || _a === void 0 ? void 0 : _a.values) || [];
                tableStats[tableConfig.oldTable] = {
                    total: records.length,
                    inserted: 0,
                    failed: 0,
                    blacklisted: 0,
                };
                if (records.length > 0) {
                    const tableIdMapping = generateIdMapping(records, tableConfig.oldTable, tableConfig.hasUuid);
                    Object.assign(idMapping, tableIdMapping);
                    await migrateTable(connection, tableConfig, records, idMapping, blacklist, tableStats, lastSuccessMessagePerTable);
                }
                else {
                    console.log(`No records found for table: ${tableConfig.oldTable}`);
                }
            }
            await connection.commit();
            const summaryEntries = Object.entries(tableStats).map(([table, stats]) => {
                return `${table}: Total: ${stats.total}, Inserted: ${stats.inserted}, Failed: ${stats.failed}, Blacklisted: ${stats.blacklisted}`;
            });
            for (const summary of summaryEntries) {
                await sendMessage("/api/admin/system/database/migrate", `COMPLETED\n${summary}`, true);
            }
            success = true;
        }
        catch (error) {
            await connection.rollback();
            if (error.code === "ER_LOCK_DEADLOCK") {
                retries++;
                if (retries < maxRetries) {
                    await sendMessage("/api/admin/system/database/migrate", `Deadlock encountered, retrying in ${retryDelay / 1000} seconds... (${retries}/${maxRetries})`, false);
                    await new Promise((resolve) => setTimeout(resolve, retryDelay));
                }
                else {
                    await sendMessage("/api/admin/system/database/migrate", `Error migrating database after ${maxRetries} retries: ${error.message}`, false);
                    throw (0, error_1.createError)({
                        statusCode: 500,
                        message: `Error migrating database after ${maxRetries} retries: ${error.message}`,
                    });
                }
            }
            else {
                await sendMessage("/api/admin/system/database/migrate", `Error migrating database: ${error.message}`, false);
                throw (0, error_1.createError)({
                    statusCode: 500,
                    message: `Error migrating database: ${error.message}`,
                });
            }
        }
        finally {
            await connection.end();
        }
    }
    return { message: "Migration initiated" };
};
