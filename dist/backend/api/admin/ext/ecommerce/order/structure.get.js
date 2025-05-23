"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ecommerceOrderStructure = exports.metadata = void 0;
const constants_1 = require("@b/utils/constants");
const structure_1 = require("@b/utils/schema/structure");
exports.metadata = {
    summary: "Get form structure for E-commerce Orders",
    operationId: "getEcommerceOrderStructure",
    tags: ["Admin", "Ecommerce Orders"],
    responses: {
        200: {
            description: "Form structure for managing E-commerce Orders",
            content: constants_1.structureSchema,
        },
    },
    permission: "Access Ecommerce Order Management",
};
const ecommerceOrderStructure = () => {
    const userId = {
        type: "input",
        label: "User",
        name: "userId",
        placeholder: "Enter the user's ID",
        icon: "lets-icons:user-duotone",
    };
    const status = {
        type: "select",
        label: "Status",
        name: "status",
        options: [
            { value: "PENDING", label: "Pending" },
            { value: "COMPLETED", label: "Completed" },
            { value: "CANCELLED", label: "Cancelled" },
            { value: "REJECTED", label: "Rejected" },
        ],
        placeholder: "Select the status of the order",
    };
    const shippingAddress = {
        type: "object",
        name: "shippingAddress",
        label: "Shipping Address",
        fields: [
            {
                type: "input",
                label: "Name",
                name: "name",
                component: "InfoBlock",
            },
            [
                {
                    type: "input",
                    label: "Phone",
                    name: "phone",
                    component: "InfoBlock",
                },
                {
                    type: "input",
                    label: "Street",
                    name: "street",
                    component: "InfoBlock",
                },
            ],
            [
                {
                    type: "input",
                    label: "City",
                    name: "city",
                    component: "InfoBlock",
                },
                {
                    type: "input",
                    label: "State",
                    name: "state",
                    component: "InfoBlock",
                },
            ],
            [
                {
                    type: "input",
                    label: "Country",
                    name: "country",
                    component: "InfoBlock",
                },
                {
                    type: "input",
                    label: "Postal Code",
                    name: "postalCode",
                    component: "InfoBlock",
                },
            ],
        ],
    };
    return {
        userId,
        status,
        shippingAddress,
    };
};
exports.ecommerceOrderStructure = ecommerceOrderStructure;
exports.default = async () => {
    const { userId, status, shippingAddress } = (0, exports.ecommerceOrderStructure)();
    return {
        get: [
            structure_1.userInfoSchema,
            {
                type: "object",
                list: true,
                name: "products",
                label: "Products",
                grid: "column",
                fields: [
                    {
                        fields: [
                            {
                                ...structure_1.imageStructure,
                                width: structure_1.imageStructure.width / 2,
                                height: structure_1.imageStructure.width / 2,
                            },
                            {
                                fields: [
                                    {
                                        type: "input",
                                        component: "InfoBlock",
                                        label: "Name",
                                        name: "name",
                                        icon: "material-symbols-light:title",
                                    },
                                    {
                                        type: "input",
                                        label: "Quantity",
                                        name: "ecommerceOrderItem.quantity",
                                        component: "InfoBlock",
                                        icon: "material-symbols-light:production-quantity-limits-rounded",
                                    },
                                    {
                                        type: "input",
                                        component: "InfoBlock",
                                        label: "Price",
                                        name: "price, ' ',currency",
                                        icon: "ph:currency-circle-dollar-light",
                                    },
                                ],
                                grid: "column",
                            },
                        ],
                        className: "card-dashed mb-3 items-center",
                    },
                ],
            },
            status,
            shippingAddress,
        ],
        set: [[userId, status], shippingAddress],
    };
};
