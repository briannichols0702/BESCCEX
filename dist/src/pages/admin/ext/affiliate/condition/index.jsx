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
const api = "/api/admin/ext/affiliate/condition";
const columnConfig = [
    {
        field: "name",
        label: "Name",
        type: "text",
        sortable: true,
    },
    {
        field: "reward",
        label: "Reward",
        type: "number",
        sortable: true,
    },
    {
        field: "rewardType",
        label: "Type",
        type: "select",
        sortable: true,
        options: [
            { value: "FIXED", label: "Fixed", color: "primary" },
            { value: "PERCENTAGE", label: "Percentage", color: "info" },
        ],
    },
    {
        field: "rewardWalletType",
        label: "Wallet Type",
        type: "select",
        sortable: true,
        options: [
            { value: "FIAT", label: "Fiat", color: "primary" },
            { value: "SPOT", label: "Spot", color: "info" },
            { value: "ECO", label: "Eco", color: "success" },
        ],
    },
    {
        field: "rewardCurrency",
        label: "Currency",
        type: "text",
        sortable: true,
    },
    {
        field: "status",
        label: "Status",
        type: "switch",
        sortable: true,
        api: `${api}/:id/status`,
    },
];
const MlmReferralConditions = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<Default_1.default title={t("MLM Referral Conditions")} color="muted">
      <datatable_1.DataTable title={t("MLM Referral Conditions")} endpoint={api} columnConfig={columnConfig} isParanoid={false} canDelete={false} canCreate={false}/>
    </Default_1.default>);
};
exports.default = MlmReferralConditions;
exports.permission = "Access MLM Referral Condition Management";
