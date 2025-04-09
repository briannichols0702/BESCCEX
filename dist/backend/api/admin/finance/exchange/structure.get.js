"use strict";
// /api/admin/exchanges/structure.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.exchangeStructure = exports.metadata = void 0;
const constants_1 = require("@b/utils/constants");
exports.metadata = {
    summary: "Get form structure for Exchanges",
    operationId: "getExchangeStructure",
    tags: ["Admin", "Exchanges"],
    responses: {
        200: {
            description: "Form structure for managing Exchanges",
            content: constants_1.structureSchema,
        },
    },
    permission: "Access Exchange Provider Management"
};
const exchangeStructure = () => {
    const id = {
        type: "input",
        label: "ID",
        name: "id",
        placeholder: "Automatically generated",
        readOnly: true,
    };
    const name = {
        type: "input",
        label: "Name",
        name: "name",
        placeholder: "Enter the exchange name",
    };
    const title = {
        type: "input",
        label: "Title",
        name: "title",
        placeholder: "Enter the exchange title",
    };
    const status = {
        type: "select",
        label: "Active Status",
        name: "status",
        options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
        ],
        ts: "boolean",
    };
    const username = {
        type: "input",
        label: "Username",
        name: "username",
        placeholder: "Enter the username associated with the exchange",
    };
    const licenseStatus = {
        type: "select",
        label: "License Status",
        name: "licenseStatus",
        options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
        ],
        ts: "boolean",
    };
    const version = {
        type: "input",
        label: "Version",
        name: "version",
        placeholder: "Enter the software version of the exchange",
    };
    const productId = {
        type: "input",
        label: "Product ID",
        name: "productId",
        placeholder: "Enter the product ID related to the exchange",
    };
    const type = {
        type: "input",
        label: "Type",
        name: "type",
        placeholder: "Enter the exchange type (e.g., spot, futures)",
    };
    return {
        id,
        name,
        title,
        status,
        username,
        licenseStatus,
        version,
        productId,
        type,
    };
};
exports.exchangeStructure = exchangeStructure;
exports.default = () => {
    const { id, name, title, status, username, licenseStatus, version, productId, type, } = (0, exports.exchangeStructure)();
    const exchangeInformation = {
        type: "component",
        name: "Exchange Information",
        filepath: "ExchangeInfo",
        props: {
            id,
            name,
            title,
            status,
            username,
            licenseStatus,
            version,
            productId,
            type,
        },
    };
    return {
        get: [exchangeInformation],
        set: [
            name,
            title,
            status,
            username,
            licenseStatus,
            version,
            productId,
            type,
        ],
    };
};
