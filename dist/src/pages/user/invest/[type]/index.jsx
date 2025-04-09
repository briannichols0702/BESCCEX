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
const react_1 = __importStar(require("react"));
const Default_1 = __importDefault(require("@/layouts/Default"));
const datatable_1 = require("@/components/elements/base/datatable");
const date_fns_1 = require("date-fns");
const router_1 = require("next/router");
const lodash_1 = require("lodash");
const Faq_1 = require("@/components/pages/knowledgeBase/Faq");
const api = "/api/finance/investment";
const ForexInvestments = () => {
    const router = (0, router_1.useRouter)();
    const { type } = router.query;
    const [columnConfig, setColumnConfig] = react_1.default.useState([]);
    (0, react_1.useEffect)(() => {
        if (router.isReady && type) {
            const config = [
                {
                    field: "plan",
                    label: "Plan",
                    sublabel: "plan.currency",
                    type: "text",
                    getValue: (item) => { var _a; return (_a = item.plan) === null || _a === void 0 ? void 0 : _a.title; },
                    getSubValue: (item) => { var _a; return (_a = item.plan) === null || _a === void 0 ? void 0 : _a.currency; },
                    path: `/user/invest/plan/${(type === null || type === void 0 ? void 0 : type.toLowerCase()) || "general"}/[plan.id]`,
                    sortable: true,
                    sortName: "plan.title",
                    hasImage: true,
                    imageKey: "plan.image",
                    placeholder: "/img/placeholder.svg",
                    className: "rounded-sm",
                },
                {
                    field: "amount",
                    label: "Amount",
                    type: "number",
                    sortable: true,
                },
                {
                    field: "profit",
                    label: "ROI",
                    type: "number",
                    sortable: true,
                },
                {
                    field: "status",
                    label: "Status",
                    type: "select",
                    options: [
                        { value: "ACTIVE", label: "Active", color: "primary" },
                        { value: "COMPLETED", label: "Completed", color: "success" },
                        { value: "CANCELLED", label: "Cancelled", color: "danger" },
                        { value: "REJECTED", label: "Rejected", color: "warning" },
                    ],
                    sortable: true,
                },
                {
                    field: "endDate",
                    label: "End Date",
                    type: "date",
                    sortable: true,
                    filterable: false,
                    getValue: (item) => item.endDate
                        ? (0, date_fns_1.formatDate)(new Date(item.endDate), "yyyy-MM-dd HH:mm")
                        : "N/A",
                },
            ];
            setColumnConfig(config);
        }
    }, [router.isReady, type]);
    return (<Default_1.default title={`${(0, lodash_1.capitalize)(type)} Investments`} color="muted">
      {api && columnConfig.length > 0 && (<datatable_1.DataTable title={`${(0, lodash_1.capitalize)(type)} Investments`} endpoint={api} columnConfig={columnConfig} canCreate={false} canDelete={false} canEdit={false} hasAnalytics hasStructure={false} viewPath={`/user/invest/${type}/[plan.id]`}/>)}

      <Faq_1.Faq category="INVESTMENT"/>
    </Default_1.default>);
};
exports.default = ForexInvestments;
