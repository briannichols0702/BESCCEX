"use strict";
// /api/admin/forexAccounts/structure.get.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.forexAccountStructure = exports.metadata = void 0;
const constants_1 = require("@b/utils/constants");
exports.metadata = {
    summary: "Get form structure for Forex Accounts",
    operationId: "getForexAccountStructure",
    tags: ["Admin", "Forex Accounts"],
    responses: {
        200: {
            description: "Form structure for managing Forex Accounts",
            content: constants_1.structureSchema,
        },
    },
    permission: "Access Forex Account Management",
};
const forexAccountStructure = () => {
    const userId = {
        type: "input",
        label: "User",
        name: "userId",
        placeholder: "Enter the user ID",
        icon: "lets-icons:user-duotone",
    };
    const accountId = {
        type: "input",
        label: "Account ID",
        name: "accountId",
        placeholder: "Enter the Forex account ID",
    };
    const password = {
        type: "input",
        label: "Password",
        name: "password",
        placeholder: "Enter the account password",
    };
    const broker = {
        type: "input",
        label: "Broker",
        name: "broker",
        placeholder: "Enter broker name",
    };
    const mt = {
        type: "select",
        label: "MT Version",
        name: "mt",
        options: [
            { value: "4", label: "MT4" },
            { value: "5", label: "MT5" },
        ],
    };
    const balance = {
        type: "input",
        label: "Balance",
        name: "balance",
        placeholder: "Enter the account balance",
        ts: "number",
    };
    const leverage = {
        type: "input",
        label: "Leverage",
        name: "leverage",
        placeholder: "Enter leverage used",
        ts: "number",
    };
    const type = {
        type: "select",
        label: "Account Type",
        name: "type",
        options: [
            { value: "DEMO", label: "Demo" },
            { value: "LIVE", label: "Live" },
        ],
        placeholder: "Select account type",
    };
    const status = {
        type: "select",
        label: "Status",
        name: "status",
        options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
        ],
        ts: "boolean",
    };
    return {
        userId,
        accountId,
        password,
        broker,
        mt,
        balance,
        leverage,
        type,
        status,
    };
};
exports.forexAccountStructure = forexAccountStructure;
exports.default = () => {
    const { userId, accountId, password, broker, mt, balance, leverage, type, status, } = (0, exports.forexAccountStructure)();
    return {
        get: [
            userId,
            accountId,
            password,
            [broker, mt],
            [balance, leverage],
            type,
            status,
        ],
        set: [
            [userId],
            [accountId, password],
            [broker, mt, type],
            [balance, leverage],
            status,
        ],
    };
};
