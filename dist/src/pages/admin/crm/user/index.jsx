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
const sonner_1 = require("sonner");
const api_1 = __importDefault(require("@/utils/api"));
const Tooltip_1 = require("@/components/elements/base/tooltips/Tooltip");
const IconButton_1 = __importDefault(require("@/components/elements/base/button-icon/IconButton"));
const react_2 = require("@iconify/react");
const api = "/api/admin/crm/user";
const exportEndpoint = "/api/admin/crm/user/export";
const columnConfig = [
    {
        field: "fullName",
        label: "Full Name",
        type: "text",
        sortable: true,
        sortName: "firstName",
        getValue: (item) => `${item.firstName} ${item.lastName}`,
        hasImage: true,
        imageKey: "avatar",
        placeholder: "/img/avatars/placeholder.webp",
        className: "rounded-full",
    },
    {
        field: "id",
        label: "ID",
        type: "text",
        sortable: true,
    },
    { field: "email", label: "Email", type: "text", sortable: true },
    {
        field: "status",
        label: "Status",
        type: "select",
        active: "ACTIVE",
        disabled: "INACTIVE",
        sortable: false,
        api: `${api}/:id/status`,
        options: [
            { value: "ACTIVE", label: "Active", color: "success" },
            { value: "INACTIVE", label: "Inactive", color: "warning" },
            { value: "BANNED", label: "Banned", color: "danger" },
            { value: "SUSPENDED", label: "Suspended", color: "info" },
        ],
    },
    {
        field: "createdAt",
        label: "Registered",
        type: "date",
        sortable: true,
        filterable: false,
        getValue: (item) => item.createdAt ? new Date(item.createdAt).toLocaleString() : "N/A",
    },
    {
        field: "lastLogin",
        label: "Last Login",
        type: "date",
        sortable: true,
        filterable: false,
        getValue: (item) => item.lastLogin ? new Date(item.lastLogin).toLocaleString() : "N/A",
    },
];
const Users = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    // Handle export button click
    const handleExport = async () => {
        try {
            await (0, api_1.default)({
                url: exportEndpoint,
            });
        }
        catch (error) {
            sonner_1.toast.error("An unexpected error occurred while exporting users.");
        }
    };
    return (<Default_1.default title={t("Users Management")} color="muted">
      <datatable_1.DataTable title={t("Users")} endpoint={api} columnConfig={columnConfig} hasAnalytics navSlot={<>
            <Tooltip_1.Tooltip content={t("Export Users to Excel")}>
              <IconButton_1.default variant="pastel" aria-label={t("Export Users")} onClick={() => handleExport()} color={"info"} size="lg">
                <react_2.Icon className="h-6 w-6" icon="mdi:file-excel"/>
              </IconButton_1.default>
            </Tooltip_1.Tooltip>
          </>}/>
    </Default_1.default>);
};
exports.default = Users;
exports.permission = "Access User Management";
