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
const api = "/api/admin/ext/ico/project";
const columnConfig = [
    {
        field: "name",
        label: "Name",
        sublabel: "website",
        type: "text",
        sortable: true,
        hasImage: true,
        imageKey: "image",
        placeholder: "/img/placeholder.svg",
        className: "rounded-full",
    },
    {
        field: "description",
        label: "Description",
        type: "text",
        sortable: true,
        maxLength: 100,
    },
    {
        field: "status",
        label: "Status",
        type: "select",
        options: [
            { value: "PENDING", label: "Pending", color: "warning" },
            { value: "ACTIVE", label: "Active", color: "success" },
            { value: "COMPLETED", label: "Completed", color: "success" },
            { value: "REJECTED", label: "Rejected", color: "danger" },
            { value: "CANCELLED", label: "Cancelled", color: "danger" },
        ],
        sortable: true,
    },
];
const ICOProjects = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<Default_1.default title={t("ICO Projects")} color="muted">
      <datatable_1.DataTable title={t("ICO Projects")} endpoint={api} columnConfig={columnConfig}/>
    </Default_1.default>);
};
exports.default = ICOProjects;
exports.permission = "Access ICO Project Management";
