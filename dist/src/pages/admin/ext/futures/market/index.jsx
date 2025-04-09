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
const api = "/api/admin/ext/futures/market";
const columnConfig = [
    {
        field: "symbol",
        label: "Symbol",
        type: "text",
        sortable: true,
        getValue: (item) => { var _a, _b; return `${(_a = item.currency) === null || _a === void 0 ? void 0 : _a.toUpperCase()}/${(_b = item.pair) === null || _b === void 0 ? void 0 : _b.toUpperCase()}`; },
    },
    {
        field: "isTrending",
        label: "Trending",
        type: "select",
        sortable: true,
        options: [
            { value: true, label: "Yes", color: "success" },
            { value: false, label: "No", color: "danger" },
        ],
    },
    {
        field: "isHot",
        label: "Hot",
        type: "select",
        sortable: true,
        options: [
            { value: true, label: "Yes", color: "success" },
            { value: false, label: "No", color: "danger" },
        ],
    },
    {
        field: "status",
        label: "Status",
        type: "switch",
        sortable: true,
        api: `${api}/:id/status`,
    },
];
const Markets = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<Default_1.default title={t("Futures Markets")} color="muted">
      <datatable_1.DataTable title={t("Markets")} endpoint={api} columnConfig={columnConfig} isParanoid={false} canCreate={true}/>
    </Default_1.default>);
};
exports.default = Markets;
exports.permission = "Access Futures Market Management";
