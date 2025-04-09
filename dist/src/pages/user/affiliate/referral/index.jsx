"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Default_1 = __importDefault(require("@/layouts/Default"));
const datatable_1 = require("@/components/elements/base/datatable");
const next_i18next_1 = require("next-i18next");
const api = "/api/ext/affiliate/referral";
const columnConfig = [
    {
        field: "referred",
        label: "Referred",
        sublabel: "referred.email",
        type: "text",
        getValue: (item) => { var _a, _b; return `${(_a = item.referred) === null || _a === void 0 ? void 0 : _a.firstName} ${(_b = item.referred) === null || _b === void 0 ? void 0 : _b.lastName}`; },
        getSubValue: (item) => { var _a; return (_a = item.referred) === null || _a === void 0 ? void 0 : _a.email; },
        sortable: true,
        sortName: "referred.firstName",
        hasImage: true,
        imageKey: "referred.avatar",
        placeholder: "/img/avatars/placeholder.webp",
        className: "rounded-full",
    },
    {
        field: "status",
        label: "Status",
        type: "select",
        sortable: true,
        options: [
            { value: "PENDING", label: "Pending", color: "warning" },
            { value: "ACTIVE", label: "Approved", color: "success" },
            { value: "REJECTED", label: "Rejected", color: "danger" },
        ],
    },
];
const MlmReferrals = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<Default_1.default title={t("MLM Referrals")} color="muted">
      <datatable_1.DataTable title={t("MLM")} postTitle={t("Referrals")} endpoint={api} columnConfig={columnConfig} isCrud={false} hasStructure={false} hasAnalytics/>
    </Default_1.default>);
};
exports.default = MlmReferrals;
