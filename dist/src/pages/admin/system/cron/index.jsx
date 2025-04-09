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
const next_i18next_1 = require("next-i18next");
const api_1 = __importDefault(require("@/utils/api"));
const object_table_1 = require("@/components/elements/base/object-table");
const router_1 = require("next/router");
const IconBox_1 = __importDefault(require("@/components/elements/base/iconbox/IconBox"));
const api = "/api/admin/system/cron";
const columnConfig = [
    {
        field: "title",
        label: "Title",
        type: "text",
        sortable: true,
    },
    {
        field: "description",
        label: "Description",
        type: "text",
        sortable: true,
    },
    {
        field: "period",
        label: "Every",
        type: "text",
        sortable: true,
        getValue: (item) => {
            return item.period ? `${item.period / 60000} minutes` : "Never";
        },
    },
    {
        field: "lastRun",
        label: "Last Run",
        type: "text",
        sortable: true,
        getValue: (item) => {
            return item.lastRun ? new Date(item.lastRun).toLocaleString() : "Never";
        },
    },
];
const Log = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const [items, setItems] = (0, react_1.useState)([]);
    const fetchCron = async () => {
        const { data, error } = await (0, api_1.default)({
            url: api,
            silent: true,
        });
        if (!error) {
            setItems(data);
        }
    };
    const router = (0, router_1.useRouter)();
    (0, react_1.useEffect)(() => {
        if (router.isReady) {
            fetchCron();
        }
    }, [router.isReady]);
    const runCron = async () => {
        const { error } = await (0, api_1.default)({
            url: `/api/cron`,
        });
        if (!error) {
            fetchCron();
        }
    };
    return (<Default_1.default title={t("Cron Jobs Monitor")} color="muted">
      <object_table_1.ObjectTable title={t("Cron Jobs")} items={items} setItems={setItems} columnConfig={columnConfig} shape="rounded-sm" size="sm" filterField="title" initialPerPage={20} navSlot={<IconBox_1.default color="primary" onClick={() => runCron()} shape={"rounded-sm"} size={"sm"} variant={"pastel"} className="cursor-pointer hover:shadow-sm transition-all duration-300 ease-in-out hover:shadow-muted-300/30 dark:hover:shadow-muted-800/20 hover:bg-primary-500 hover:text-muted-100" icon="lucide:play"/>}/>
    </Default_1.default>);
};
exports.default = Log;
exports.permission = "Access Cron Job Management";
