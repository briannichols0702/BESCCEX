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
const IconBox_1 = __importDefault(require("@/components/elements/base/iconbox/IconBox"));
const link_1 = __importDefault(require("next/link"));
const api = "/api/admin/crm/kyc/template";
const columnConfig = [
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
const KYCTemplates = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<Default_1.default title={t("KYC Templates Management")} color="muted">
      <datatable_1.DataTable title={t("KYC Templates")} endpoint={api} columnConfig={columnConfig} canCreate={false} canView={false} isParanoid={false} editPath="/admin/crm/kyc/template/[id]" onlySingleActiveStatus navSlot={<>
            <link_1.default href="/admin/crm/kyc/template/create">
              <IconBox_1.default variant={"pastel"} icon={"mdi:plus"} color={"success"} shape="rounded-sm" className="cursor-pointer"/>
            </link_1.default>
          </>}/>
    </Default_1.default>);
};
exports.default = KYCTemplates;
exports.permission = "Access KYC Template Management";
