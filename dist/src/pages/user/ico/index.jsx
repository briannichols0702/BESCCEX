"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Default_1 = __importDefault(require("@/layouts/Default"));
const react_1 = __importDefault(require("react"));
const datatable_1 = require("@/components/elements/base/datatable");
const BackButton_1 = require("@/components/elements/base/button/BackButton");
const next_i18next_1 = require("next-i18next");
const api = "/api/ext/ico/contribution";
const columnConfig = [
    {
        field: "phase.token.currency",
        label: "Token",
        sublabel: "phase.token.chain",
        type: "text",
        sortable: true,
        sortName: "phase.token.currency",
        hasImage: true,
        imageKey: "phase.token.image",
        placeholder: "/img/placeholder.svg",
        className: "rounded-full",
        getValue: (row) => { var _a, _b; return (_b = (_a = row.phase) === null || _a === void 0 ? void 0 : _a.token) === null || _b === void 0 ? void 0 : _b.currency; },
        getSubValue: (row) => { var _a, _b; return (_b = (_a = row.phase) === null || _a === void 0 ? void 0 : _a.token) === null || _b === void 0 ? void 0 : _b.chain; },
    },
    {
        field: "phase.name",
        label: "Phase",
        type: "text",
        sortable: true,
        sortName: "phase.name",
        getValue: (item) => { var _a; return (_a = item.phase) === null || _a === void 0 ? void 0 : _a.name; },
    },
    {
        field: "amount",
        label: "Amount",
        type: "number",
        sortable: true,
    },
    {
        field: "status",
        label: "Status",
        type: "select",
        options: [
            { value: "PENDING", label: "Pending", color: "warning" },
            { value: "COMPLETED", label: "Completed", color: "success" },
            { value: "CANCELLED", label: "Cancelled", color: "danger" },
            { value: "REJECTED", label: "Rejected", color: "danger" },
        ],
        sortable: true,
    },
];
const ForexAccountsDashboard = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<Default_1.default title={t("Contributions")} color="muted">
      <datatable_1.DataTable title={t("ICO")} postTitle={t("Contributions")} endpoint={api} columnConfig={columnConfig} isCrud={false} hasStructure={false} navSlot={<>
            <BackButton_1.BackButton href={`/user/ico`}/>
          </>}/>
    </Default_1.default>);
};
exports.default = ForexAccountsDashboard;
