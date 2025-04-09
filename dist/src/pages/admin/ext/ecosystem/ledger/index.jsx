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
const api = "/api/admin/ext/ecosystem/ledger";
const columnConfig = [
    {
        field: "user",
        label: "User",
        sublabel: "wallet.user.email",
        type: "text",
        getValue: (item) => { var _a, _b, _c, _d; return `${(_b = (_a = item.wallet) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.firstName} ${(_d = (_c = item.wallet) === null || _c === void 0 ? void 0 : _c.user) === null || _d === void 0 ? void 0 : _d.lastName}`; },
        getSubValue: (item) => { var _a, _b; return (_b = (_a = item.wallet) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.email; },
        path: "/admin/crm/user?email=[wallet.user.email]",
        sortable: true,
        sortName: "wallet.user.firstName",
        hasImage: true,
        imageKey: "wallet.user.avatar",
        placeholder: "/img/avatars/placeholder.webp",
        className: "rounded-full",
    },
    {
        field: "currency",
        label: "Currency",
        sublabel: "chain",
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
        field: "offchainDifference",
        label: "Offchain Difference",
        type: "number",
        sortable: true,
        precision: 2,
    },
];
const PrivateLedgers = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<Default_1.default title={t("Ecosystem Private Ledgers")} color="muted">
      <datatable_1.DataTable title={t("Private Ledgers")} endpoint={api} columnConfig={columnConfig} canCreate={false} canEdit={false} canDelete={false}/>
    </Default_1.default>);
};
exports.default = PrivateLedgers;
exports.permission = "Access Ecosystem Private Ledger Management";
