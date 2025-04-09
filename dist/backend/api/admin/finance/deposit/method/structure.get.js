"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.methodStructure = exports.metadata = void 0;
// /api/admin/deposit/methods/structure.get.ts
const constants_1 = require("@b/utils/constants");
exports.metadata = {
    summary: "Get form structure for deposit methods",
    operationId: "getDepositMethodsStructure",
    tags: ["Admin", "Deposit Methods"],
    responses: {
        200: {
            description: "Form structure for deposit methods",
            content: constants_1.structureSchema,
        },
    },
    permission: "Access Deposit Method Management"
};
const methodStructure = () => {
    const image = {
        type: "file",
        label: "Method Image",
        name: "image",
        fileType: "image",
        width: 350,
        height: 262,
        maxSize: 1,
        placeholder: "/img/placeholder.svg",
    };
    const title = {
        type: "input",
        component: "InfoBlock",
        label: "Method Title",
        name: "title",
        icon: "ph:wallet-light",
        placeholder: "Enter the method title",
    };
    const instructions = {
        type: "textarea",
        label: "Instructions",
        name: "instructions",
        placeholder: "Enter detailed instructions for using this deposit method",
    };
    const fixedFee = {
        type: "input",
        label: "Fixed Fee",
        name: "fixedFee",
        placeholder: "Enter the fixed fee for transactions",
        ts: "number",
    };
    const percentageFee = {
        type: "input",
        label: "Percentage Fee",
        name: "percentageFee",
        placeholder: "Enter the percentage fee of transaction amount",
        ts: "number",
    };
    const minAmount = {
        type: "input",
        label: "Minimum Amount",
        name: "minAmount",
        placeholder: "Enter the minimum amount for transactions",
        ts: "number",
    };
    const maxAmount = {
        type: "input",
        label: "Maximum Amount",
        name: "maxAmount",
        placeholder: "Enter the maximum amount for transactions",
        ts: "number",
    };
    const customFields = {
        type: "customFields",
        label: "Custom Fields",
        name: "customFields",
        placeholder: "Enter custom fields for this deposit method",
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
        title,
        instructions,
        image,
        fixedFee,
        percentageFee,
        minAmount,
        maxAmount,
        customFields,
        status,
    };
};
exports.methodStructure = methodStructure;
exports.default = async () => {
    const { title, instructions, image, fixedFee, percentageFee, minAmount, maxAmount, customFields, status, } = (0, exports.methodStructure)();
    return {
        get: [
            {
                fields: [
                    {
                        ...image,
                        width: image.width / 4,
                        height: image.width / 4,
                    },
                    {
                        fields: [title],
                        grid: "column",
                    },
                ],
                className: "card-dashed mb-5 items-center",
            },
            instructions,
            [fixedFee, percentageFee],
            [minAmount, maxAmount],
            customFields,
            status,
        ],
        set: [
            image,
            title,
            instructions,
            [fixedFee, percentageFee],
            [minAmount, maxAmount],
            status,
            customFields,
        ],
    };
};
