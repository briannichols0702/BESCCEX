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
const columnConfig = [
    {
        field: "subject",
        label: "Subject",
        type: "text",
        sortable: true,
    },
    {
        field: "email",
        label: "Email",
        type: "select",
        sortable: false,
        options: [
            { value: true, label: "Yes", color: "success" },
            { value: false, label: "No", color: "danger" },
        ],
    },
    {
        field: "sms",
        label: "SMS",
        type: "select",
        sortable: false,
        options: [
            { value: true, label: "Yes", color: "success" },
            { value: false, label: "No", color: "danger" },
        ],
    },
    {
        field: "push",
        label: "Push",
        type: "select",
        sortable: false,
        options: [
            { value: true, label: "Yes", color: "success" },
            { value: false, label: "No", color: "danger" },
        ],
    },
];
const NotificationTemplates = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<Default_1.default title={t("Notification Templates Management")} color="muted">
      <datatable_1.DataTable title={t("Notification Templates")} endpoint="/api/admin/system/notification/template" columnConfig={columnConfig} formSize="sm" isParanoid={false} canCreate={false} canView={false} canDelete={false} editPath="/admin/system/notification/template/[id]"/>
    </Default_1.default>);
};
exports.default = NotificationTemplates;
exports.permission = "Access Notification Template Management";
