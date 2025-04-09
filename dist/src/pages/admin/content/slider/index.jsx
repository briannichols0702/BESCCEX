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
const api = "/api/admin/content/slider";
const columnConfig = [
    {
        field: "image",
        label: "Slider Image",
        type: "image",
        sortable: true,
        placeholder: "/img/placeholder.svg",
    },
    {
        field: "link",
        label: "Link",
        type: "text",
        sortable: true,
        placeholder: "/img/placeholder.svg",
    },
    {
        field: "status",
        label: "Status",
        type: "switch",
        sortable: false,
        api: `${api}/:id/status`,
    },
];
const Sliders = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<Default_1.default title={t("Sliders")} color="muted">
      <datatable_1.DataTable title={t("Sliders")} endpoint={api} columnConfig={columnConfig}/>
    </Default_1.default>);
};
exports.default = Sliders;
exports.permission = "Access Slider Management";
