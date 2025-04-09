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
const Alert_1 = __importDefault(require("@/components/elements/base/alert/Alert"));
const api = "/api/admin/finance/exchange/provider";
const columnConfig = [
    {
        field: "name",
        label: "Name",
        type: "text",
        sortable: true,
    },
    {
        field: "title",
        label: "Title",
        type: "text",
        sortable: true,
    },
    {
        field: "status",
        label: "Status",
        type: "switch",
        sortable: false,
        api: `${api}/:id/status`,
    },
];
const Exchanges = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<Default_1.default title={t("Exchange Management")} color="muted">
      <datatable_1.DataTable title={t("Exchanges")} endpoint={api} columnConfig={columnConfig} canDelete={false} canEdit={false} canCreate={false} isParanoid={false} viewPath="/admin/finance/exchange/provider/[productId]" hasStructure={false} onlySingleActiveStatus={true}/>
      <div className="mt-8">
        <Alert_1.default label={<div className="text-xl">{t("Important Notice")}</div>} sublabel={<div className="text-md">
              {t("After activating an exchange for the first time or changing the active exchange, you have to import markets and currencies again.")}
              <br />
              {t("You need to view the exchange to check its status, credentials, and connection status.")}
            </div>} color="info" canClose={false}/>
      </div>
    </Default_1.default>);
};
exports.default = Exchanges;
exports.permission = "Access Exchange Provider Management";
