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
const api = "/api/admin/ext/staking/duration";
const columnConfig = [
    {
        field: "pool.name",
        label: "Pool",
        sublabel: "pool.id",
        type: "text",
        sortable: true,
        sortName: "pool.name",
        getValue: (row) => { var _a; return (_a = row.pool) === null || _a === void 0 ? void 0 : _a.name; },
        getSubValue: (row) => { var _a; return (_a = row.pool) === null || _a === void 0 ? void 0 : _a.id; },
        hasImage: true,
        imageKey: "pool.icon",
        placeholder: "/img/placeholder.svg",
        className: "rounded-full",
    },
    {
        field: "duration",
        label: "Duration (days)",
        type: "number",
        sortable: true,
    },
    {
        field: "interestRate",
        label: "ROI (%)",
        type: "number",
        sortable: true,
    },
];
const StakingDurations = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<Default_1.default title={t("Staking Durations")} color="muted">
      <datatable_1.DataTable title={t("Staking Durations")} endpoint={api} columnConfig={columnConfig} canView={false}/>
    </Default_1.default>);
};
exports.default = StakingDurations;
exports.permission = "Access Staking Duration Management";
