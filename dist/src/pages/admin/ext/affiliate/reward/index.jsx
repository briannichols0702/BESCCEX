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
const api = "/api/admin/ext/affiliate/reward";
const columnConfig = [
    {
        field: "referrer",
        label: "Referrer",
        sublabel: "referrer.email",
        type: "text",
        getValue: (item) => { var _a, _b; return `${(_a = item.referrer) === null || _a === void 0 ? void 0 : _a.firstName} ${(_b = item.referrer) === null || _b === void 0 ? void 0 : _b.lastName}`; },
        getSubValue: (item) => { var _a; return (_a = item.referrer) === null || _a === void 0 ? void 0 : _a.email; },
        path: "/admin/crm/user?email={referrer.email}",
        sortable: true,
        sortName: "referrer.firstName",
        hasImage: true,
        imageKey: "referrer.avatar",
        placeholder: "/img/avatars/placeholder.webp",
        className: "rounded-full",
    },
    {
        field: "condition.name",
        label: "Condition",
        type: "text",
        sortable: true,
        getValue: (row) => { var _a; return (_a = row.condition) === null || _a === void 0 ? void 0 : _a.title; },
    },
    {
        field: "reward",
        label: "Reward",
        type: "number",
        sortable: true,
        getValue: (row) => { var _a; return `${row.reward} ${(_a = row.condition) === null || _a === void 0 ? void 0 : _a.rewardCurrency}`; },
    },
    {
        field: "isClaimed",
        label: "Claimed",
        type: "switch",
        sortable: true,
        api: `${api}/:id/status`,
    },
];
const MlmReferralRewards = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<Default_1.default title={t("MLM Referral Rewards")} color="muted">
      <datatable_1.DataTable title={t("MLM Referral Rewards")} endpoint={api} columnConfig={columnConfig} hasAnalytics/>
    </Default_1.default>);
};
exports.default = MlmReferralRewards;
exports.permission = "Access MLM Referral Reward Management";
