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
const api = "/api/admin/content/media";
const columnConfig = [
    {
        field: "path",
        label: "Image",
        type: "image",
        sortable: false,
    },
    {
        field: "name",
        label: "Name",
        sublabel: "name",
        type: "text",
        sortable: true,
        sortName: "path",
        getValue: (row) => { var _a; 
        // remove first /
        return (_a = row.path) === null || _a === void 0 ? void 0 : _a.replace(`/${row.name}`, ""); },
        getSubValue: (row) => row.name,
    },
    {
        field: "dateModified",
        label: "Created At",
        type: "datetime",
        sortable: true,
        filterable: false,
        getValue: (row) => (0, date_fns_1.formatDate)(new Date(row.createdAt), "yyyy-MM-dd"),
    },
];
const Media = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<Default_1.default title={t("Media")} color="muted">
      <datatable_1.DataTable title={t("Media")} endpoint={api} columnConfig={columnConfig} isCrud={true} hasStructure={false} viewPath="[path]" blank={true} canEdit={false} canCreate={false} isParanoid={false}/>
    </Default_1.default>);
};
exports.default = Media;
exports.permission = "Access Media Management";
