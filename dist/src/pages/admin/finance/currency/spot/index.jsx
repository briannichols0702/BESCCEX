"use client";
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.permission = void 0;
const react_1 = __importStar(require("react"));
const Default_1 = __importDefault(require("@/layouts/Default"));
const datatable_1 = require("@/components/elements/base/datatable");
const next_i18next_1 = require("next-i18next");
const react_2 = require("@iconify/react");
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const Alert_1 = __importDefault(require("@/components/elements/base/alert/Alert"));
const router_1 = require("next/router");
const datatable_2 = require("@/stores/datatable");
const api_1 = __importDefault(require("@/utils/api"));
const api = "/api/admin/finance/currency/spot";
const columnConfig = [
    {
        field: "currency",
        sublabel: "name",
        label: "Currency",
        type: "text",
        sortable: true,
        sortName: "currency",
        getValue: (row) => row.currency,
        getSubValue: (row) => row.name,
    },
    {
        field: "precision",
        label: "Precision",
        type: "number",
        sortable: true,
    },
    {
        field: "price",
        label: "Price",
        type: "number",
        sortable: true,
        getValue: (item) => (<span className={item.price
                ? "text-muted-800 dark:text-gray-200"
                : "text-muted-400 dark:text-gray-500"}>
        {item.price || "N/A"}
      </span>),
    },
    {
        field: "status",
        label: "Status",
        type: "switch",
        sortable: false,
        api: `${api}/:id/status`,
    },
];
const SpotCurrencies = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const router = (0, router_1.useRouter)();
    const { fetchData } = (0, datatable_2.useDataTable)();
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [missingCurrencies, setMissingCurrencies] = (0, react_1.useState)([]);
    const importCurrency = async () => {
        setLoading(true);
        const { error } = await (0, api_1.default)({
            url: `${api}/import`,
        });
        if (!error) {
            fetchData();
        }
        setLoading(false);
    };
    const fetchMissingCurrency = async () => {
        setLoading(true);
        const { data, error } = await (0, api_1.default)({
            url: `${api}/missing`,
            silent: true,
        });
        if (!error) {
            setMissingCurrencies(data);
        }
        setLoading(false);
    };
    const activateMissingCurrencies = async () => {
        setLoading(true);
        const { error } = await (0, api_1.default)({
            url: `${api}/status`,
            method: "PUT",
            body: {
                ids: missingCurrencies.map((currency) => currency.id),
                status: true,
            },
        });
        if (!error) {
            fetchData();
            setMissingCurrencies([]);
        }
        setLoading(false);
    };
    (0, react_1.useEffect)(() => {
        if (router.isReady)
            fetchMissingCurrency();
    }, [router.isReady]);
    return (<Default_1.default title={t("Spot Currencies Management")} color="muted">
      {missingCurrencies.length > 0 && (<div className="mb-4">
          <Alert_1.default color="danger" sublabel={t("There are missing currencies that need to be activated.")} canClose={false}>
            <div className="flex justify-between items-center gap-2 text-sm w-full">
              <div className="flex items-center gap-2">
                <react_2.Icon icon="mdi:alert-circle" className="text-danger-500 h-8 w-8"/>
                <div>
                  <h2 className="text-lg">{t("Missing Currencies")}</h2>
                  <div>
                    <span className="mr-2">
                      {t("The following currencies are missing from the system:")}
                    </span>
                    <p className="inline">
                      {missingCurrencies.map((currency, index) => (<span key={currency.id}>
                          {currency.currency}
                          {index < missingCurrencies.length - 1 ? ", " : ""}
                        </span>))}
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <Button_1.default type="button" color="success" onClick={activateMissingCurrencies} loading={loading} disabled={loading}>
                  <span>{t("Activate Missing Currencies")}</span>
                </Button_1.default>
              </div>
            </div>
          </Alert_1.default>
        </div>)}
      <datatable_1.DataTable title={t("Spot Currencies")} endpoint={api} columnConfig={columnConfig} isParanoid={false} canCreate={false} canEdit={false} canView={false} navSlot={<>
            <Button_1.default type="button" color="primary" onClick={importCurrency} loading={loading} disabled={loading}>
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
exports.default = SpotCurrencies;
exports.permission = "Access Spot Currency Management";
