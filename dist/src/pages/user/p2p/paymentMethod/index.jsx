"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Default_1 = __importDefault(require("@/layouts/Default"));
const datatable_1 = require("@/components/elements/base/datatable");
const date_fns_1 = require("date-fns");
const next_i18next_1 = require("next-i18next");
const api = "/api/ext/p2p/payment/method";
const columnConfig = [
    {
        field: "name",
        label: "Name",
        sublabel: "createdAt",
        type: "text",
        sortable: true,
        hasImage: true,
        imageKey: "image",
        placeholder: "/img/placeholder.svg",
        getSubValue: (row) => (0, date_fns_1.formatDate)(new Date(row.createdAt), "dd MMM yyyy"),
    },
    {
        field: "walletType",
        label: "Type",
        type: "select",
        sortable: true,
        options: [
            { value: "FIAT", label: "Fiat", color: "info" },
            { value: "SPOT", label: "Spot", color: "success" },
            { value: "ECO", label: "Eco", color: "warning" },
        ],
    },
    {
        field: "currency",
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
const P2pPaymentMethods = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<Default_1.default title={t("P2P Payment Methods")} color="muted">
      <datatable_1.DataTable title={t("P2P Payment Methods")} endpoint={api} columnConfig={columnConfig} canDelete={false} hasAnalytics={false} isParanoid={false}/>
    </Default_1.default>);
};
exports.default = P2pPaymentMethods;
