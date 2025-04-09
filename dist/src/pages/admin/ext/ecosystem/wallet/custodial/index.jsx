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
const api = "/api/admin/ext/ecosystem/wallet/custodial";
const columnConfig = [
    {
        field: "chain",
        label: "Master Wallet Chain",
        type: "text",
        getValue: (item) => { var _a; return `${(_a = item.masterWallet) === null || _a === void 0 ? void 0 : _a.chain}`; },
        sortable: true,
    },
    {
        field: "address",
        label: "Address",
        type: "text",
        sortable: true,
    },
    {
        field: "network",
        label: "Network",
        type: "text",
        sortable: true,
    },
    {
        field: "status",
        label: "Status",
        type: "select",
        sortable: true,
        options: [
            { value: "ACTIVE", label: "Active", color: "success" },
            { value: "INACTIVE", label: "Inactive", color: "warning" },
            { value: "SUSPENDED", label: "Suspended", color: "danger" },
        ],
    },
];
const CustodialWallets = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<Default_1.default title={t("Ecosystem Custodial Wallets")} color="muted">
      <datatable_1.DataTable title={t("Custodial Wallets")} endpoint={api} columnConfig={columnConfig} canEdit={true} canDelete={false} isParanoid={false} viewPath="/admin/ext/ecosystem/wallet/custodial/[id]"/>
    </Default_1.default>);
};
exports.default = CustodialWallets;
exports.permission = "Access Ecosystem Custodial Wallet Management";
