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
const api = "/api/admin/crm/kyc/applicant";
const columnConfig = [
    {
        field: "user",
        label: "User",
        sublabel: "user.email",
        type: "text",
        getValue: (item) => { var _a, _b; return `${(_a = item.user) === null || _a === void 0 ? void 0 : _a.firstName} ${(_b = item.user) === null || _b === void 0 ? void 0 : _b.lastName}`; },
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
        field: "level",
        label: "Level",
        type: "number",
        sortable: true,
    },
    {
        field: "status",
        label: "Status",
        type: "select",
        sortable: true,
        options: [
            { value: "PENDING", label: "Pending", color: "warning" },
            { value: "APPROVED", label: "Approved", color: "success" },
            { value: "REJECTED", label: "Rejected", color: "danger" },
        ],
        placeholder: "Select status",
    },
];
const KycApplications = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<Default_1.default title={t("KYC Applications Management")} color="muted">
      <datatable_1.DataTable title={t("KYC Applications")} endpoint={api} columnConfig={columnConfig} canCreate={false} canEdit={false} viewPath="/admin/crm/kyc/applicant/[id]" hasAnalytics/>
    </Default_1.default>);
};
exports.default = KycApplications;
exports.permission = "Access KYC Application Management";
