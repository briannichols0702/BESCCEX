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
const api = "/api/admin/ext/p2p/commission";
const columnConfig = [
    {
        field: "tradeId",
        label: "Trade ID",
        type: "text",
        sortable: true,
    },
    {
        field: "amount",
        label: "Amount",
        type: "number",
        sortable: true,
    },
];
const P2pCommissions = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<Default_1.default title={t("P2P Commissions")} color="muted">
      <datatable_1.DataTable title={t("P2P Commissions")} endpoint={api} columnConfig={columnConfig} canCreate={false} canView={false} hasAnalytics/>
    </Default_1.default>);
};
exports.default = P2pCommissions;
exports.permission = "Access P2P Commission Management";
