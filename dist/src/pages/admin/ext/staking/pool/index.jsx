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
const link_1 = __importDefault(require("next/link"));
const IconButton_1 = __importDefault(require("@/components/elements/base/button-icon/IconButton"));
const react_2 = require("@iconify/react");
const api = "/api/admin/ext/staking/pool";
const columnConfig = [
    {
        field: "name",
        label: "Name",
        type: "text",
        sortable: true,
        hasImage: true,
        imageKey: "icon",
        placeholder: "/img/placeholder.svg",
        className: "rounded-full",
    },
    {
        field: "currency",
        label: "Currency",
        sublabel: "type",
        type: "text",
        sortable: true,
        getValue: (row) => `${row.currency} ${row.chain ? `(${row.chain})` : ""}`,
    },
    {
        field: "minStake",
        label: "Limit",
        sublabel: "maxStake",
        type: "number",
        sortable: true,
    },
    {
        field: "status",
        label: "Status",
        type: "select",
        sortable: true,
        options: [
            { value: "ACTIVE", label: "Active", color: "success" },
            { value: "INACTIVE", label: "Inactive", color: "danger" },
            { value: "COMPLETED", label: "Completed", color: "info" },
        ],
    },
];
const StakingPools = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<Default_1.default title={t("Staking Pools")} color="muted">
      <datatable_1.DataTable title={t("Staking Pools")} endpoint={api} columnConfig={columnConfig} hasAnalytics canCreate={false} editPath="/admin/ext/staking/pool/[id]" navSlot={<>
            <link_1.default color="success" href="/admin/ext/staking/pool/create">
              <IconButton_1.default variant="pastel" aria-label="Create Staking Pool" color="success" size="lg">
                <react_2.Icon icon={"mdi-plus"} className="h-6 w-6"/>
              </IconButton_1.default>
            </link_1.default>
          </>}/>
    </Default_1.default>);
};
exports.default = StakingPools;
exports.permission = "Access Staking Pool Management";
