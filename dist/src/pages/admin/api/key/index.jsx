"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.permission = void 0;
const react_1 = __importDefault(require("react"));
const Default_1 = __importDefault(require("@/layouts/Default"));
const datatable_1 = require("@/components/elements/base/datatable");
const next_i18next_1 = require("next-i18next");
const link_1 = __importDefault(require("next/link"));
const IconButton_1 = __importDefault(require("@/components/elements/base/button-icon/IconButton"));
const react_2 = require("@iconify/react");
const api = "/api/admin/api";
const columnConfig = [
    {
        field: "user",
        label: "Author",
        sublabel: "user.email",
        type: "text",
        getValue: (item) => { var _a, _b; return item.user ? `${(_a = item.user) === null || _a === void 0 ? void 0 : _a.firstName} ${(_b = item.user) === null || _b === void 0 ? void 0 : _b.lastName}` : "Plugin"; },
        getSubValue: (item) => { var _a; return (_a = item.user) === null || _a === void 0 ? void 0 : _a.email; },
        path: "/admin/crm/user?email=[user.email]",
        sortable: true,
        sortName: "user.firstName",
        hasImage: true,
        imageKey: "user.avatar",
        placeholder: "/img/avatars/placeholder.webp",
        className: "rounded-full",
    },
    {
        field: "name",
        label: "API Key Name",
        type: "text",
        sortable: true,
    },
    {
        field: "key",
        label: "API Key",
        type: "text",
        sortable: true,
        getValue: (item) => `**** **** **** ${item.key.slice(-5)}`, // Mask the API key for security
    },
    {
        field: "permissions",
        label: "Permissions",
        type: "text",
        sortable: false,
        getValue: (item) => {
            // Ensure permissions is an array
            const permissions = Array.isArray(item.permissions)
                ? item.permissions
                : [];
            return permissions.length > 0 ? permissions.join(", ") : "No Permissions"; // Display permissions or a default message
        },
    },
    {
        field: "ipWhitelist",
        label: "IP Whitelist",
        type: "text",
        sortable: false,
        getValue: (item) => {
            // Ensure ipWhitelist is an array
            const ipWhitelist = Array.isArray(item.ipWhitelist)
                ? item.ipWhitelist
                : [];
            return ipWhitelist.length > 0
                ? ipWhitelist.join(", ")
                : "No IPs Whitelisted"; // Display IPs or a default message
        },
    },
    {
        field: "createdAt",
        label: "Created At",
        type: "date",
        filterable: false,
        sortable: true,
    },
];
const ApiKeys = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<Default_1.default title={t("API Key Management")}>
      <datatable_1.DataTable title={t("API Keys")} endpoint={api} columnConfig={columnConfig} canCreate={false} editPath="/admin/api/key/[id]" navSlot={<link_1.default href="/admin/api/key/create">
            <IconButton_1.default variant="pastel" aria-label="Create API Key" color="success" size="lg">
              <react_2.Icon icon={"mdi-plus"} className="h-6 w-6"/>
            </IconButton_1.default>
          </link_1.default>}/>
    </Default_1.default>);
};
exports.default = ApiKeys;
exports.permission = "Access API Key Management";
