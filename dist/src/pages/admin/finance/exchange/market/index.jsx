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
const router_1 = require("next/router");
const react_2 = require("@iconify/react");
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const api_1 = __importDefault(require("@/utils/api"));
const datatable_2 = require("@/stores/datatable");
const api = "/api/admin/finance/exchange/market";
const columnConfig = [
    {
        field: "currency",
        label: "Currency",
        type: "text",
        sortable: true,
        getValue: (item) => { var _a; return (_a = item.currency) === null || _a === void 0 ? void 0 : _a.toUpperCase(); },
        sortName: "currency",
    },
    {
        field: "pair",
        label: "Pair",
        type: "text",
        sortable: true,
        getValue: (item) => { var _a; return (_a = item.pair) === null || _a === void 0 ? void 0 : _a.toUpperCase(); },
        sortName: "pair",
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
    const router = (0, router_1.useRouter)();
    const { fetchData } = (0, datatable_2.useDataTable)();
    const [loading, setLoading] = react_1.default.useState(false);
    const importMarket = async () => {
        setLoading(true);
        const { error } = await (0, api_1.default)({
            url: `${api}/import`,
        });
        if (!error) {
            fetchData();
        }
        setLoading(false);
    };
    return (<Default_1.default title={t("Exchange Markets")} color="muted">
      <datatable_1.DataTable title={t("Markets")} endpoint={api} columnConfig={columnConfig} canCreate={false} navSlot={<>
            <Button_1.default type="button" color="primary" onClick={importMarket} loading={loading} disabled={loading}>
              <react_2.Icon icon="mdi:plus" className={`"h-6 w-6`}/>
              <span>{t("Import")}</span>
            </Button_1.default>
            <Button_1.default onClick={() => {
                router.back();
            }} type="button" color="muted">
              <react_2.Icon icon="line-md:chevron-left" className={`"h-4 w-4 mr-2`}/>
              <span>{t("Back")}</span>
            </Button_1.default>
          </>}/>
    </Default_1.default>);
};
exports.default = Markets;
exports.permission = "Access Exchange Market Management";
