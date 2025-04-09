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
const SystemStatus_1 = require("@/components/pages/admin/dashboard/SystemStatus");
const next_i18next_1 = require("next-i18next");
const columnConfig = [
    {
        field: "title",
        label: "Title",
        sublabel: "createdAt",
        type: "text",
        sortable: true,
    },
    {
        field: "message",
        label: "Message",
        sublabel: "link",
        type: "text",
        sortable: false,
    },
    {
        field: "type",
        label: "Type",
        type: "select",
        sortable: true,
        options: [
            { value: "SECURITY", label: "Security", color: "danger" },
            { value: "SYSTEM", label: "System", color: "warning" },
            { value: "ACTIVITY", label: "Activity", color: "info" },
        ],
    },
];
const TabButton = ({ label, activeTab, setActiveTab, tabKey }) => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const isActive = activeTab === tabKey;
    return (<button type="button" aria-label={t(label)} className={`shrink-0 border-b-2 px-6 pb-4 text-sm transition-colors duration-300
                  ${isActive
            ? "border-primary-500 text-primary-500 dark:text-primary-400 dark:border-primary-400"
            : "border-transparent text-muted"}
                `} onClick={() => setActiveTab(tabKey)}>
      <span>{t(label)}</span>
    </button>);
};
const NotificationsTab = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<div className="mt-8">
      <datatable_1.DataTable title={t("Notifications")} endpoint="/api/user/notification" columnConfig={columnConfig} hasStructure={false} formSize="sm" isParanoid={false} canCreate={false} canEdit={false} canDelete hasTitle={false} canView={false}/>
    </div>);
};
const AdminDashboard = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const [activeTab, setActiveTab] = (0, react_1.useState)("Notifications");
    return (<Default_1.default title={t("Feed")} color="muted">
      <div className="w-full md:w-auto flex gap-4 border-b border-muted-200 dark:border-muted-800 overflow-x-auto">
        <TabButton label="System Status" activeTab={activeTab} setActiveTab={setActiveTab} tabKey="SystemStatus"/>
        <TabButton label="Notifications" activeTab={activeTab} setActiveTab={setActiveTab} tabKey="Notifications"/>
      </div>
      {activeTab === "SystemStatus" && <SystemStatus_1.SystemStatus />}
      {activeTab === "Notifications" && <NotificationsTab />}
    </Default_1.default>);
};
exports.default = AdminDashboard;
exports.permission = "Access Admin Dashboard";
