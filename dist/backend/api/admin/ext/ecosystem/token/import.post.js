"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const query_1 = require("@b/utils/query");
const utils_1 = require("./utils");
exports.metadata = {
    summary: "Imports a new Ecosystem Token",
    operationId: "importEcosystemToken",
    tags: ["Admin", "Ecosystem Tokens"],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: utils_1.ecosystemTokenImportSchema,
            },
        },
    },
    responses: (0, query_1.storeRecordResponses)(utils_1.ecosystemTokenImportSchema, "Ecosystem Token"),
    requiresAuth: true,
    permission: "Access Ecosystem Token Management",
};
exports.default = async (data) => {
    const { body } = data;
    const { icon, name, currency, chain, network, contract, contractType, decimals, precision, type, fee, limits, status, } = body;
    try {
        // Stringify JSON fields if necessary
        const sanitizedData = {
            icon,
            name,
            currency,
            chain,
            network,
            contract,
            contractType,
            decimals,
            precision,
            type,
            fee: typeof fee === "object" ? JSON.stringify(fee) : fee,
            limits: typeof limits === "object" ? JSON.stringify(limits) : limits,
            status,
        };
        const result = await (0, query_1.storeRecord)({
            model: "ecosystemToken",
            data: sanitizedData,
            returnResponse: true,
        });
        // If the import was successful and an icon was provided, update the cache
        if (result.record && icon) {
            try {
                await (0, utils_1.updateIconInCache)(currency, icon);
            }
            catch (error) {
                console.error(`Failed to update icon in cache for ${currency}:`, error);
                // Note: We don't throw this error as it shouldn't affect the main operation
            }
        }
        return result;
    }
    catch (error) {
        console.error(`Error importing ecosystem token:`, error);
        // Provide a more descriptive error message for debugging
        if (error.name === "SequelizeValidationError") {
            console.error("Validation failed for one or more fields.");
        }
        else if (error.name === "SequelizeDatabaseError") {
            console.error("Database error occurred.");
        }
        throw error;
    }
};
