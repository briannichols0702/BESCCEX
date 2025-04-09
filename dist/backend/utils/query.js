"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleBulkDelete = exports.handleSingleDelete = exports.deleteRecordParams = exports.commonBulkDeleteResponses = exports.commonBulkDeleteParams = exports.storeRecord = exports.updateRecord = exports.deleteFile = exports.getRecords = exports.getRecord = exports.createRecordResponses = exports.storeRecordResponses = exports.updateRecordResponses = exports.deleteRecordResponses = exports.invalidRequestResponse = exports.serverErrorResponse = exports.notFoundMetadataResponse = exports.unauthorizedResponse = exports.updateStatus = exports.parseFilterParam = exports.getFiltered = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const sequelize_1 = require("sequelize");
const error_1 = require("./error");
const db_1 = require("@b/db");
const path_1 = __importDefault(require("path"));
const validation_1 = require("./validation");
const operatorMap = {
    equal: sequelize_1.Op.eq,
    notEqual: sequelize_1.Op.ne,
    greaterThan: sequelize_1.Op.gt,
    greaterThanOrEqual: sequelize_1.Op.gte,
    lessThan: sequelize_1.Op.lt,
    lessThanOrEqual: sequelize_1.Op.lte,
    between: sequelize_1.Op.between,
    notBetween: sequelize_1.Op.notBetween,
    like: sequelize_1.Op.like,
    notLike: sequelize_1.Op.notLike,
    startsWith: sequelize_1.Op.startsWith,
    endsWith: sequelize_1.Op.endsWith,
    substring: sequelize_1.Op.substring,
    regexp: sequelize_1.Op.regexp,
    notRegexp: sequelize_1.Op.notRegexp,
};
async function getFiltered({ model, query, where, customFilterHandler, customStatus, sortField = "createdAt", timestamps = true, paranoid = true, numericFields = [], includeModels = [], excludeFields = [], excludeRecords = [], }) {
    const page = Number(query.page) || 1;
    const perPage = Number(query.perPage) || 10;
    const offset = (page - 1) * perPage;
    const sortOrder = query.sortOrder || "desc";
    const validSortOrder = sortOrder === "asc" ? "ASC" : "DESC";
    const showDeleted = query.showDeleted === "true";
    const rawFilter = parseFilterParam(query.filter, numericFields);
    const { nestedFilters, directFilters } = buildNestedFilters(rawFilter);
    let whereClause = customFilterHandler
        ? customFilterHandler(directFilters)
        : {};
    excludeRecords.forEach((exclude) => {
        if (!exclude.model) {
            // Direct exclusion to the main model's where clause
            whereClause[exclude.key] = { [sequelize_1.Op.ne]: exclude.value };
        }
    });
    // First handle custom status configurations
    customStatus === null || customStatus === void 0 ? void 0 : customStatus.forEach(({ key, true: trueValue, false: falseValue }) => {
        if (directFilters.hasOwnProperty(key)) {
            const statusValue = directFilters[key];
            if (statusValue === "true") {
                whereClause[key] = trueValue;
            }
            else if (statusValue === "false") {
                whereClause[key] = falseValue;
            }
            delete directFilters[key];
        }
    });
    Object.entries(directFilters).forEach(([key, filterValue]) => {
        if (numericFields.includes(key) && typeof filterValue !== "object") {
            // Convert simple numeric fields to float if they are not using complex operators
            whereClause[key] = parseFloat(filterValue) || filterValue;
        }
        else if (typeof filterValue === "object" && filterValue.operator) {
            const { value, operator } = filterValue;
            const op = operatorMap[operator];
            whereClause[key] = { [op]: value };
        }
        else {
            whereClause[key] = filterValue;
        }
    });
    let hasParanoid = !showDeleted;
    if (timestamps && paranoid) {
        if (showDeleted) {
            whereClause[sequelize_1.Op.and] = { deletedAt: { [sequelize_1.Op.ne]: null } };
        }
        else {
            whereClause[sequelize_1.Op.and] = { deletedAt: null };
        }
    }
    else {
        hasParanoid = undefined;
    }
    const adjustedIncludeModels = adjustIncludeModels(includeModels, excludeRecords, nestedFilters);
    let order = [];
    if (sortField.includes(".")) {
        const [relation, attribute] = sortField.split(".");
        const association = model.associations[relation];
        if (association) {
            order = [
                [{ model: association, as: relation }, attribute, validSortOrder],
            ];
        }
        else {
            console.error("Association not found for", relation);
        }
    }
    else {
        order = [[sortField, validSortOrder]];
    }
    if (where) {
        whereClause = { ...whereClause, ...where };
    }
    const { count, rows } = await model.findAndCountAll({
        where: whereClause,
        offset,
        limit: perPage,
        include: adjustedIncludeModels,
        distinct: true,
        col: "id",
        attributes: { exclude: excludeFields },
        order,
        paranoid: hasParanoid,
    });
    return {
        items: rows.map((row) => row.get({ plain: true })),
        pagination: {
            totalItems: count,
            currentPage: page,
            perPage,
            totalPages: Math.ceil(count / perPage),
        },
    };
}
exports.getFiltered = getFiltered;
function adjustIncludeModels(includeModels, excludeRecords, filters) {
    return includeModels.map((includeModel) => {
        // Retrieve exclusion rules specifically for this model
        const exclusions = excludeRecords.filter((exclude) => exclude.model === includeModel.model);
        // Build the 'where' condition using filters specifically for its alias, if available
        const specificFilters = filters[includeModel.as] || {};
        const where = {
            ...includeModel.where, // Preserve existing conditions
            ...specificFilters, // Apply specific filters
            ...(exclusions.length
                ? {
                    [sequelize_1.Op.and]: exclusions.map((exclude) => ({
                        [exclude.key]: { [sequelize_1.Op.ne]: exclude.value },
                    })),
                }
                : {}),
        };
        // Set 'required' to false unless explicitly specified
        const required = specificFilters && Object.keys(specificFilters).length > 0
            ? true
            : includeModel.required || false;
        // Recursively adjust nested include models, if they exist
        const nestedIncludes = includeModel.includeModels
            ? adjustIncludeModels(includeModel.includeModels, excludeRecords, filters)
            : includeModel.include || [];
        return {
            ...includeModel,
            where,
            include: nestedIncludes,
            required,
        };
    });
}
function parseFilterParam(filterParam, numericFields) {
    const parsedFilters = {};
    if (!filterParam)
        return parsedFilters;
    let filtersObject = {};
    if (typeof filterParam === "string") {
        try {
            filtersObject = JSON.parse(filterParam);
        }
        catch (error) {
            console.error("Error parsing filter param:", error);
            return parsedFilters;
        }
    }
    Object.entries(filtersObject).forEach(([key, value]) => {
        const keyParts = key.split(".");
        let current = parsedFilters;
        // Iterate through key parts except the last one to navigate/build the nested structure
        keyParts.slice(0, -1).forEach((part) => {
            current[part] = current[part] || {};
            current = current[part];
        });
        // Check if the last part of the key path is a numeric field
        const isNumericField = numericFields.includes(keyParts[keyParts.length - 1]);
        let finalValue = value;
        if (isNumericField &&
            typeof value === "object" &&
            value.operator === "startsWith") {
            finalValue = {
                operator: "greaterThan",
                value: parseFloat(value.value),
            }; // Convert startsWith to greaterThan and parse value as float
        }
        // Assign the possibly modified value to the last part of the key path
        current[keyParts[keyParts.length - 1]] = finalValue;
    });
    return parsedFilters;
}
exports.parseFilterParam = parseFilterParam;
function buildNestedFilters(filters) {
    const nestedFilters = {};
    const directFilters = {};
    Object.entries(filters).forEach(([fullKey, value]) => {
        // Check if the value is a direct filter
        if (typeof value === "boolean" ||
            (typeof value === "object" && "operator" in value && "value" in value)) {
            directFilters[fullKey] = value;
        }
        else {
            // Otherwise, it's a nested filter
            const keys = fullKey.split(".");
            let current = nestedFilters;
            // Iterate over the key parts to deeply nest, except for the last part
            for (let i = 0; i < keys.length - 1; i++) {
                const key = keys[i];
                current[key] = current[key] || {};
                current = current[key];
            }
            // Apply the filter to the last key part
            const lastKey = keys[keys.length - 1];
            current[lastKey] = value;
        }
    });
    return { nestedFilters: applyOperatorMapping(nestedFilters), directFilters };
}
function applyOperatorMapping(filters) {
    const whereClause = {};
    const processFilters = (currentFilters, parentObject) => {
        Object.entries(currentFilters).forEach(([key, value]) => {
            if (value &&
                typeof value === "object" &&
                value.operator &&
                operatorMap[value.operator]) {
                // It's an object with a recognized operator
                parentObject[key] = { [operatorMap[value.operator]]: value.value };
            }
            else if (value && typeof value === "object" && !value.operator) {
                // It's a nested object, recurse further
                parentObject[key] = {};
                processFilters(value, parentObject[key]);
            }
            else {
                // It's a direct value
                parentObject[key] = value;
            }
        });
    };
    processFilters(filters, whereClause);
    return whereClause;
}
async function updateStatus(model, id, fieldValue, field = "status", modelTitle = "Record", postUpdate, where) {
    if (!db_1.models[model]) {
        throw (0, error_1.createError)({
            statusCode: 400,
            message: "Invalid model",
        });
    }
    if (!id) {
        throw (0, error_1.createError)({
            statusCode: 400,
            message: "Missing ID",
        });
    }
    if (fieldValue === undefined) {
        throw (0, error_1.createError)({
            statusCode: 400,
            message: "Missing field value",
        });
    }
    if (!field) {
        throw (0, error_1.createError)({
            statusCode: 400,
            message: "Missing field name",
        });
    }
    try {
        const updateFields = {};
        updateFields[field] = fieldValue;
        await db_1.models[model].update(updateFields, {
            where: {
                id,
                ...where,
            },
        });
        const capitalModel = model.charAt(0).toUpperCase() + model.slice(1);
        const message = `${modelTitle ? modelTitle : capitalModel + " " + field} updated successfully`;
        if (postUpdate) {
            await postUpdate(id);
        }
        return { message };
    }
    catch (error) {
        console.error(error);
        throw (0, error_1.createError)({
            statusCode: 500,
            message: error.message,
        });
    }
}
exports.updateStatus = updateStatus;
exports.unauthorizedResponse = {
    description: "Unauthorized, admin permission required",
    content: {
        "application/json": {
            schema: {
                type: "object",
                properties: {
                    message: {
                        type: "string",
                        description: "Error message",
                    },
                },
            },
        },
    },
};
const notFoundMetadataResponse = (model) => ({
    description: `${model} not found`,
    content: {
        "application/json": {
            schema: {
                type: "object",
                properties: {
                    message: {
                        type: "string",
                        description: "Error message",
                    },
                },
            },
        },
    },
});
exports.notFoundMetadataResponse = notFoundMetadataResponse;
exports.serverErrorResponse = {
    description: "Internal server error",
    content: {
        "application/json": {
            schema: {
                type: "object",
                properties: {
                    message: {
                        type: "string",
                        description: "Error message",
                    },
                },
            },
        },
    },
};
exports.invalidRequestResponse = {
    description: "Invalid request",
    content: {
        "application/json": {
            schema: {
                type: "object",
                properties: {
                    message: {
                        type: "string",
                        description: "Error message",
                    },
                },
            },
        },
    },
};
const deleteRecordResponses = (model) => {
    return {
        200: {
            description: `${model} deleted successfully`,
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            message: {
                                type: "string",
                                description: "Confirmation message indicating successful deletion",
                            },
                        },
                    },
                },
            },
        },
        401: exports.unauthorizedResponse,
        404: (0, exports.notFoundMetadataResponse)(model),
        500: exports.serverErrorResponse,
    };
};
exports.deleteRecordResponses = deleteRecordResponses;
const updateRecordResponses = (model) => {
    return {
        200: {
            description: `${model} updated successfully`,
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            message: {
                                type: "string",
                                description: "Confirmation message",
                            },
                        },
                    },
                },
            },
        },
        400: exports.invalidRequestResponse,
        401: exports.unauthorizedResponse,
        404: (0, exports.notFoundMetadataResponse)(model),
        500: exports.serverErrorResponse,
    };
};
exports.updateRecordResponses = updateRecordResponses;
const storeRecordResponses = (success, model) => {
    return {
        200: success,
        400: exports.invalidRequestResponse,
        401: exports.unauthorizedResponse,
        404: (0, exports.notFoundMetadataResponse)(model),
        500: exports.serverErrorResponse,
    };
};
exports.storeRecordResponses = storeRecordResponses;
const createRecordResponses = (model) => {
    return {
        200: {
            description: `${model} created successfully`,
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            message: {
                                type: "string",
                                description: "Confirmation message",
                            },
                        },
                    },
                },
            },
        },
        400: exports.invalidRequestResponse,
        401: exports.unauthorizedResponse,
        500: exports.serverErrorResponse,
    };
};
exports.createRecordResponses = createRecordResponses;
function resolveIncludes(includes) {
    if (!includes) {
        return undefined;
    }
    return includes.map((include) => {
        const { model, as, attributes, includeModels, through, required } = include;
        const resolvedInclude = {
            model,
            as,
            attributes: attributes === null || attributes === void 0 ? void 0 : attributes.map((attr) => Array.isArray(attr) ? attr : [attr, attr]),
            required,
        };
        if (includeModels) {
            resolvedInclude.include = resolveIncludes(includeModels);
        }
        if (through) {
            resolvedInclude.through = through;
        }
        return resolvedInclude;
    });
}
async function getRecord(modelName, id, include, exclude = []) {
    if (!id) {
        throw new Error("Missing ID");
    }
    const model = db_1.models[modelName];
    if (!model) {
        throw new Error(`Model ${modelName} not found`);
    }
    const resolvedIncludes = resolveIncludes(include);
    const data = await model.findOne({
        where: { id },
        attributes: { exclude },
        include: resolvedIncludes,
    });
    if (!data) {
        throw (0, error_1.createError)({
            statusCode: 404,
            message: `Record with ID ${id} not found`,
        });
    }
    return data.get({ plain: true });
}
exports.getRecord = getRecord;
async function getRecords(modelName, ids, include, exclude = []) {
    const model = db_1.models[modelName];
    if (!model) {
        throw new Error(`Model ${modelName} not found`);
    }
    const resolvedIncludes = resolveIncludes(include);
    try {
        const data = await model.findAll({
            where: { id: ids },
            attributes: { exclude },
            include: resolvedIncludes,
        });
        return data.map((item) => item.get({ plain: true }));
    }
    catch (error) {
        console.error(`Error fetching ${modelName}:`, error);
        throw new Error("Server error");
    }
}
exports.getRecords = getRecords;
async function deleteFile(filePath) {
    // Sanitize the file path to prevent LFI
    const sanitizedFilePath = (0, validation_1.sanitizePath)(filePath);
    const fullPath = path_1.default.join(process.cwd(), "public", sanitizedFilePath);
    await promises_1.default.unlink(fullPath);
}
exports.deleteFile = deleteFile;
async function updateRecord(modelName, id, updateData, returnResponse = false, relations = [], where) {
    const model = db_1.models[modelName];
    if (!model) {
        throw new Error(`Model ${modelName} not found.`);
    }
    const transaction = await db_1.sequelize.transaction();
    try {
        const existingRecord = await model.findByPk(id, { transaction });
        if (!existingRecord) {
            throw new Error(`${modelName} with ID ${id} not found.`);
        }
        await model.update(updateData, { where: { id, ...where }, transaction });
        for (const relation of relations) {
            const relatedModel = db_1.models[relation.model];
            if (!relatedModel) {
                console.error(`Related model ${relation.model} not found.`);
                continue;
            }
            const existingRelations = await relatedModel.findAll({
                where: { [relation.fields.source]: id },
                transaction,
            });
            const newRelationsMap = new Map(relation.data.map((item) => [item, item]));
            const toDelete = existingRelations.filter((item) => !newRelationsMap.has(item[relation.fields.target]));
            await Promise.all(toDelete.map((item) => item.destroy({ transaction })));
            for (const newItem of relation.data) {
                const existingItem = existingRelations.find((item) => item[relation.fields.target] === newItem);
                if (existingItem) {
                    await existingItem.update(newItem, { transaction });
                }
                else {
                    await relatedModel.create({
                        [relation.fields.source]: id,
                        [relation.fields.target]: newItem,
                    }, { transaction });
                }
            }
        }
        await transaction.commit();
        if (returnResponse) {
            return model.findByPk(id);
        }
        else {
            return { message: `${modelName} updated successfully` };
        }
    }
    catch (error) {
        console.error(`Error occurred, rolling back transaction. Error: ${error}`);
        await transaction.rollback();
        throw error;
    }
}
exports.updateRecord = updateRecord;
async function storeRecord({ model, data, relations, returnResponse = false, }) {
    const Model = db_1.models[model];
    if (!Model) {
        throw new Error(`Model ${model} not found.`);
    }
    const transaction = await db_1.sequelize.transaction();
    try {
        // Ensure customFields is an array or null
        if (data.customFields === undefined || data.customFields === null) {
            data.customFields = [];
        }
        // Ensure customFields is an array
        if (!Array.isArray(data.customFields)) {
            throw new Error("customFields must be an array");
        }
        const newRecord = await Model.create(data, { transaction });
        if (relations && Array.isArray(relations)) {
            for (const relation of relations) {
                const relatedModel = db_1.models[relation.model];
                if (!relatedModel) {
                    console.error(`Related model ${relation.model} not found.`);
                    continue;
                }
                // Ensure relation.data is an array before processing
                if (Array.isArray(relation.data)) {
                    // Update existing relations and create new ones
                    for (const newItem of relation.data) {
                        await relatedModel.create({
                            [relation.fields.source]: newRecord.id,
                            [relation.fields.target]: newItem,
                        }, { transaction });
                    }
                }
                else {
                    console.error(`Relation data for ${relation.model} is not an array.`);
                }
            }
        }
        await transaction.commit();
        if (returnResponse) {
            return {
                record: newRecord.get({ plain: true }),
                message: `${model} created successfully`,
            };
        }
        else {
            return { message: `${model} created successfully` };
        }
    }
    catch (error) {
        console.error(`Error occurred, rolling back transaction. Error: ${error}`);
        await transaction.rollback();
        throw error;
    }
}
exports.storeRecord = storeRecord;
const commonBulkDeleteParams = (model) => {
    return [
        {
            name: "restore",
            in: "query",
            description: `Restore the ${model} instead of deleting`,
            required: false,
            schema: {
                type: "boolean",
            },
        },
        {
            name: "force",
            in: "query",
            description: `Delete the ${model} permanently`,
            required: false,
            schema: {
                type: "boolean",
            },
        },
    ];
};
exports.commonBulkDeleteParams = commonBulkDeleteParams;
const commonBulkDeleteResponses = (model) => {
    return {
        200: {
            description: `${model} deleted successfully`,
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            message: {
                                type: "string",
                                description: "Confirmation message",
                            },
                        },
                    },
                },
            },
        },
        400: exports.invalidRequestResponse,
        401: exports.unauthorizedResponse,
        404: (0, exports.notFoundMetadataResponse)(model),
        500: exports.serverErrorResponse,
    };
};
exports.commonBulkDeleteResponses = commonBulkDeleteResponses;
const deleteRecordParams = (model) => {
    return [
        {
            index: 0,
            name: "id",
            in: "path",
            description: `ID of the ${model} to delete`,
            required: true,
            schema: {
                type: "string",
            },
        },
        {
            name: "restore",
            in: "query",
            description: `Restore the ${model} instead of deleting`,
            required: false,
            schema: {
                type: "boolean",
            },
        },
        {
            name: "force",
            in: "query",
            description: `Delete the ${model} permanently`,
            required: false,
            schema: {
                type: "boolean",
            },
        },
    ];
};
exports.deleteRecordParams = deleteRecordParams;
async function handleSingleDelete({ model, query, where = {}, id, preDelete = async () => Promise.resolve(), postDelete = async () => Promise.resolve(), restoreRelated = async () => Promise.resolve(), }) {
    if (!db_1.models[model]) {
        throw (0, error_1.createError)({
            statusCode: 400,
            message: "Invalid model",
        });
    }
    if (!id) {
        throw (0, error_1.createError)({
            statusCode: 400,
            message: "Missing ID",
        });
    }
    try {
        const whereClause = { ...where, id };
        const capitalModel = model.charAt(0).toUpperCase() + model.slice(1);
        await preDelete(); // Perform any actions required before deletion or restoration
        if (query.restore) {
            await db_1.models[model].restore({ where: whereClause });
            await restoreRelated(); // Restore related records
            await postDelete(); // Perform any cleanup after restoration
            return { message: `${capitalModel} restored successfully.` };
        }
        else if (query.force) {
            await db_1.models[model].destroy({
                where: whereClause,
                force: true,
            });
            await postDelete(); // Perform any cleanup after forced deletion
            return { message: `${capitalModel} deleted permanently.` };
        }
        else {
            await db_1.models[model].destroy({ where: whereClause });
            await postDelete(); // Perform any cleanup after standard deletion
            return { message: `${capitalModel} deleted successfully.` };
        }
    }
    catch (error) {
        console.error(error);
        throw (0, error_1.createError)({
            statusCode: 500,
            message: error.message,
        });
    }
}
exports.handleSingleDelete = handleSingleDelete;
async function handleBulkDelete({ model, ids, query, where = {}, preDelete = async () => Promise.resolve(), postDelete = async () => Promise.resolve(), restoreRelated = async () => Promise.resolve(), }) {
    if (!db_1.models[model]) {
        throw (0, error_1.createError)({
            statusCode: 400,
            message: `Invalid model: ${model}`,
        });
    }
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        throw (0, error_1.createError)({
            statusCode: 400,
            message: "Missing IDs",
        });
    }
    try {
        const whereClause = { ...where, id: ids };
        const capitalModel = model.charAt(0).toUpperCase() + model.slice(1);
        await preDelete(); // Perform any actions required before deletion or restoration
        if (query.restore) {
            await db_1.models[model].restore({ where: whereClause });
            await restoreRelated(); // Restore related records
            await postDelete(); // Perform any cleanup after restoration
            return { message: `${capitalModel} records restored successfully.` };
        }
        else if (query.force) {
            await db_1.models[model].destroy({
                where: whereClause,
                force: true,
            });
            await postDelete(); // Perform any cleanup after forced deletion
            return { message: `${capitalModel} records deleted permanently.` };
        }
        else {
            await db_1.models[model].destroy({ where: whereClause });
            await postDelete(); // Perform any cleanup after standard deletion
            return { message: `${capitalModel} records deleted successfully.` };
        }
    }
    catch (error) {
        console.error(error);
        throw (0, error_1.createError)({
            statusCode: 500,
            message: error.message,
        });
    }
}
exports.handleBulkDelete = handleBulkDelete;
