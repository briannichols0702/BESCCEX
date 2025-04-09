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
const date_fns_1 = require("date-fns");
const next_i18next_1 = require("next-i18next");
const api = "/api/admin/ext/forex/signal";
const columnConfig = [
    {
        field: "title",
        label: "Title",
        sublabel: "createdAt",
        type: "text",
        sortable: true,
        hasImage: true,
        imageKey: "image",
        placeholder: "/img/placeholder.svg",
        getSubValue: (item) => (0, date_fns_1.formatDate)(new Date(item.createdAt), "MMM dd, yyyy"),
    },
    {
        field: "status",
        label: "Status",
        type: "switch",
        sortable: true,
        api: `${api}/:id/status`,
    },
];
const ForexSignals = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<Default_1.default title={t("Forex Signals")} color="muted">
      <datatable_1.DataTable title={t("Forex Signals")} endpoint={api} columnConfig={columnConfig} canView={false} hasAnalytics/>
    </Default_1.default>);
};
exports.default = ForexSignals;
exports.permission = "Access Forex Signal Management";
