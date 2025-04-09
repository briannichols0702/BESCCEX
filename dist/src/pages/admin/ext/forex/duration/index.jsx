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
const api = "/api/admin/ext/forex/duration";
const columnConfig = [
    {
        field: "duration",
        label: "Duration",
        type: "number",
        sortable: true,
    },
    {
        field: "timeframe",
        label: "Timeframe",
        type: "select",
        sortable: true,
        options: [
            { value: "HOUR", label: "Hour", color: "primary" },
            { value: "DAY", label: "Day", color: "info" },
            { value: "WEEK", label: "Week", color: "success" },
            { value: "MONTH", label: "Month", color: "warning" },
        ],
    },
];
const ForexDurations = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<Default_1.default title={t("Forex Durations")} color="muted">
      <datatable_1.DataTable title={t("Forex Durations")} endpoint={api} columnConfig={columnConfig} isParanoid={false} canView={false}/>
    </Default_1.default>);
};
exports.default = ForexDurations;
exports.permission = "Access Forex Duration Management";
