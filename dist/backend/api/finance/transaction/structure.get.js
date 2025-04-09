"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionStructure = exports.metadata = void 0;
// /api/admin/transactions/structure.get.ts
const utils_1 = require("@b/utils");
const constants_1 = require("@b/utils/constants");
exports.metadata = {
    summary: "Get form structure for transactions",
    operationId: "getTransactionsStructure",
    tags: ["Finance", "Transactions"],
    responses: {
        200: {
            description: "Form structure for transactions",
            content: constants_1.structureSchema,
        },
    },
};
const transactionStructure = () => {
    const type = {
        type: "select",
        label: "Type",
        name: "type",
        options: utils_1.transactionTypeOptions,
    };
    const status = {
        type: "select",
        label: "Status",
        name: "status",
        options: utils_1.statusOptions,
    };
    const amount = {
        type: "input",
        label: "Amount",
        name: "amount",
        ts: "number",
    };
    const fee = {
        type: "input",
        label: "Fee",
        name: "fee",
        ts: "number",
    };
    const description = {
        type: "textarea",
        label: "Description",
        name: "description",
    };
    const metadata = {
        type: "object",
        label: "Metadata",
        name: "metadata",
    };
    const referenceId = {
        type: "input",
        label: "Reference ID",
        name: "referenceId",
    };
    return {
        type,
        status,
        amount,
        fee,
        description,
        metadata,
        referenceId,
    };
};
exports.transactionStructure = transactionStructure;
exports.default = async () => {
    const { type, status, amount, fee, description, metadata, referenceId } = (0, exports.transactionStructure)();
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
    };
};
