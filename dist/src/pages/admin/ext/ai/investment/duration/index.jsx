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
const api = "/api/admin/ext/ai/investment/duration";
const columnConfig = [
    {
        field: "duration",
        label: "Duration",
        type: "number",
        sortable: true,
        getValue: (item) => { var _a; return `${item.duration} ${(_a = item.timeframe) === null || _a === void 0 ? void 0 : _a.toLowerCase()}`; },
    },
    {
        field: "timeframe",
        label: "Timeframe",
        type: "text",
        sortable: true,
    },
];
const AIDurations = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<Default_1.default title={t("AI Investment Durations")} color="muted">
      <datatable_1.DataTable title={t("AI Investment Durations")} endpoint={api} columnConfig={columnConfig} isParanoid={false}/>
    </Default_1.default>);
};
exports.default = AIDurations;
exports.permission = "Access AI Investment Duration Management";
