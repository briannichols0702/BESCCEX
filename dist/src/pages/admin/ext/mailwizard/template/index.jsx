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
const api = "/api/admin/ext/mailwizard/template";
const columnConfig = [
    {
        field: "name",
        label: "Template Name",
        type: "text",
        sortable: true,
    },
];
const MailwizardTemplates = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<Default_1.default title={t("Mailwizard Templates")} color="muted">
      <datatable_1.DataTable title={t("Mailwizard Templates")} endpoint={api} columnConfig={columnConfig} editPath="/admin/ext/mailwizard/template/[id]" canView={false} canImport/>
    </Default_1.default>);
};
exports.default = MailwizardTemplates;
exports.permission = "Access Mailwizard Template Management";
