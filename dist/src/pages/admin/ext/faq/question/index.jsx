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
const lodash_1 = require("lodash");
const next_i18next_1 = require("next-i18next");
const api = "/api/admin/ext/faq/question";
const columnConfig = [
    {
        field: "question",
        label: "Question",
        type: "text",
        sortable: true,
        maxLength: 50,
    },
    {
        field: "answer",
        label: "Answer",
        type: "text",
        sortable: false,
        maxLength: 50,
    },
    {
        field: "videoUrl",
        label: "Video URL",
        type: "text",
        sortable: false,
        maxLength: 50,
    },
    {
        field: "faqCategory.id",
        label: "Category",
        type: "text",
        sortable: true,
        sortName: "faqCategory.id",
        getValue: (row) => { var _a; return (0, lodash_1.capitalize)((_a = row.faqCategory) === null || _a === void 0 ? void 0 : _a.id); },
        path: "/admin/ext/faq/category?id=[faqCategory.id]",
    },
];
const FAQs = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<Default_1.default title={t("FAQ Management")} color="muted">
      <datatable_1.DataTable title={t("FAQs")} endpoint={api} columnConfig={columnConfig}/>
    </Default_1.default>);
};
exports.default = FAQs;
exports.permission = "Access FAQ Management";
