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
const api_1 = __importDefault(require("@/utils/api"));
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const react_2 = require("@iconify/react");
const datatable_2 = require("@/stores/datatable");
const api = "/api/admin/system/log";
const columnConfig = [
    // category
    {
        field: "category",
        label: "Category",
        sublabel: "file",
        type: "text",
        sortable: true,
    },
    // timestamp
    {
        field: "timestamp",
        label: "Timestamp",
        type: "datetime",
        sortable: true,
        filterable: false,
    },
    {
        field: "level",
        label: "Level",
        type: "select",
        sortable: true,
        options: [
            {
                label: "Error",
                value: "error",
                color: "danger",
            },
            {
                label: "Warn",
                value: "warn",
                color: "warning",
            },
            {
                label: "Info",
                value: "info",
                color: "info",
            },
            {
                label: "Debug",
                value: "debug",
            },
        ],
    },
    // message
    {
        field: "message",
        label: "Message",
        type: "text",
        sortable: true,
    },
];
const Log = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const { fetchData } = (0, datatable_2.useDataTable)();
    const cleanLogs = async () => {
        const { data, error } = await (0, api_1.default)({
            url: "/api/admin/system/log/clean",
            method: "DELETE",
        });
        if (!error) {
            fetchData();
        }
    };
    return (<Default_1.default title={t("Log Monitor")} color="muted">
      <datatable_1.DataTable title={t("Log")} endpoint={api} columnConfig={columnConfig} isParanoid={false} canCreate={false} canEdit={false} canView={false} hasStructure={false} navSlot={<>
            <Button_1.default onClick={cleanLogs} color="danger" shape={"rounded-sm"}>
              <react_2.Icon icon="mdi:delete"/>
              {t("Clean Logs")}
            </Button_1.default>
          </>}/>
    </Default_1.default>);
};
exports.default = Log;
exports.permission = "Access Log Monitor";
