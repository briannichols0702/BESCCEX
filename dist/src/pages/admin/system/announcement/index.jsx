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
const date_fns_1 = require("date-fns");
const next_i18next_1 = require("next-i18next");
const api = "/api/admin/system/announcement";
const columnConfig = [
    {
        field: "title",
        label: "Announcement",
        sublabel: "createdAt",
        type: "text",
        sortable: true,
        placeholder: "/img/placeholder.svg",
        getSubValue: (item) => item.createdAt
            ? (0, date_fns_1.formatDate)(new Date(item.createdAt), "MMM dd, yyyy")
            : "N/A",
    },
    {
        field: "type",
        label: "Type",
        type: "select",
        options: [
            { value: "GENERAL", label: "General" },
            { value: "EVENT", label: "Event" },
            { value: "UPDATE", label: "Update" },
        ],
        sortable: true,
    },
    {
        field: "status",
        label: "Status",
        type: "switch",
        sortable: false,
        api: `${api}/:id/status`,
    },
];
const Announcements = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<Default_1.default title={t("Announcements")} color="muted">
      <datatable_1.DataTable title={t("Announcements")} endpoint={api} columnConfig={columnConfig}/>
    </Default_1.default>);
};
exports.default = Announcements;
exports.permission = "Access Announcement Management";
