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
const api = "/api/admin/crm/role";
const columnConfig = [
    {
        field: "name",
        label: "Name",
        type: "text",
        sortable: true,
    },
    {
        field: "permissions",
        label: "Permissions",
        type: "tags",
        key: "name",
        sortable: false,
        filterable: false,
    },
];
const Roles = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<Default_1.default title={t("Roles Management")} color="muted">
      <datatable_1.DataTable title={t("Roles")} endpoint={api} columnConfig={columnConfig} isParanoid={false} canView={false}/>
    </Default_1.default>);
};
exports.default = Roles;
exports.permission = "Access Role Management";
