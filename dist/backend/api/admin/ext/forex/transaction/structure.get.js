"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionStructure = exports.metadata = void 0;
// /api/admin/transactions/structure.get.ts
const utils_1 = require("@b/utils");
const constants_1 = require("@b/utils/constants");
exports.metadata = {
    summary: "Get form structure for transactions",
    operationId: "getTransactionsStructure",
    tags: ["Admin", "Wallets", "Transactions"],
    responses: {
        200: {
            description: "Form structure for transactions",
            content: constants_1.structureSchema,
        },
    },
    permission: "Access Forex Signal Management",
};
const transactionStructure = () => {
    const type = {
        type: "select",
        label: "Type",
        name: "type",
        options: utils_1.transactionTypeOptions,
        placeholder: "Select transaction type",
    };
    const status = {
        type: "select",
        label: "Status",
        name: "status",
        options: utils_1.statusOptions,
        placeholder: "Select status",
    };
    const amount = {
        type: "input",
        label: "Amount",
        name: "amount",
        placeholder: "Enter the amount",
        ts: "number",
    };
    const fee = {
        type: "input",
        label: "Fee",
        name: "fee",
        placeholder: "Enter the transaction fee",
        ts: "number",
    };
    const description = {
        type: "textarea",
        label: "Description",
        name: "description",
        placeholder: "Enter a description of the transaction",
    };
    const metadata = {
        type: "object",
        label: "Metadata",
        name: "metadata",
        placeholder: "Enter metadata for the transaction",
    };
    const referenceId = {
        type: "input",
        label: "Reference ID",
        name: "referenceId",
        placeholder: "Enter the reference ID",
    };
    const message = {
        type: "textarea",
        label: "Message",
        name: "message",
        placeholder: "Enter a message for the transaction",
    };
    return {
        type,
        status,
        amount,
        fee,
        description,
        metadata,
        referenceId,
        message,
    };
};
exports.transactionStructure = transactionStructure;
exports.default = async () => {
    const { type, status, amount, fee, description, metadata, referenceId, message, } = (0, exports.transactionStructure)();
    return {
        get: [
            referenceId,
            [
                {
                    type: "input",
                    label: "Type",
                    name: "type",
                },
                {
                    type: "input",
                    label: "Status",
                    name: "status",
                },
            ],
            [amount, fee],
            description,
            metadata,
        ],
        set: [status, message],
    };
};
