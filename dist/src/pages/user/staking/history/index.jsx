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
const ActionItem_1 = __importDefault(require("@/components/elements/base/dropdown-action/ActionItem"));
const panel_1 = require("@/components/elements/base/panel");
const Avatar_1 = __importDefault(require("@/components/elements/base/avatar/Avatar"));
const MashImage_1 = require("@/components/elements/MashImage");
const Progress_1 = __importDefault(require("@/components/elements/base/progress/Progress"));
const Card_1 = __importDefault(require("@/components/elements/base/card/Card"));
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const StakeLogInfo_1 = require("@/components/pages/user/staking/StakeLogInfo");
const api_1 = __importDefault(require("@/utils/api"));
const datatable_2 = require("@/stores/datatable");
const next_i18next_1 = require("next-i18next");
const api = "/api/ext/staking/log";
const columnConfig = [
    {
        field: "pool.name",
        label: "Pool",
        sublabel: "pool.currency",
        type: "text",
        sortable: true,
        sortName: "pool.name",
        hasImage: true,
        imageKey: "pool.icon",
        placeholder: "/img/placeholder.svg",
        className: "rounded-full",
        getValue: (item) => { var _a; return (_a = item.pool) === null || _a === void 0 ? void 0 : _a.name; },
        getSubValue: (item) => { var _a; return (_a = item.pool) === null || _a === void 0 ? void 0 : _a.currency; },
    },
    {
        field: "createdAt",
        label: "Start Date",
        type: "text",
        sortable: true,
        getValue: (item) => item.createdAt
            ? `${(0, date_fns_1.format)(new Date(item.createdAt), "dd MMM yyyy HH:mm")}`
            : "N/A",
    },
    {
        field: "durationId",
        label: "End Date",
        type: "text",
        sortable: true,
        getValue: (item) => item.createdAt && item.duration
            ? (0, date_fns_1.format)((0, date_fns_1.addDays)(new Date(item.createdAt), item.duration.duration), "dd MMM yyyy HH:mm")
            : "N/A",
    },
    {
        field: "amount",
        label: "Amount",
        type: "number",
        sortable: true,
    },
    {
        field: "duration.interestRate",
        label: "ROI",
        type: "number",
        sortable: true,
        getValue: (item) => {
            var _a, _b;
            return ((_a = item.duration) === null || _a === void 0 ? void 0 : _a.interestRate)
                ? `${item.amount * (((_b = item.duration) === null || _b === void 0 ? void 0 : _b.interestRate) / 100)}`
                : "N/A";
        },
    },
    {
        field: "status",
        label: "Status",
        type: "select",
        sortable: true,
        options: [
            { value: "ACTIVE", label: "Active", color: "primary" },
            { value: "RELEASED", label: "Released", color: "info" },
            { value: "COLLECTED", label: "Collected", color: "success" },
        ],
    },
];
const StakingLogs = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const [selectedItem, setSelectedItem] = (0, react_1.useState)(null);
    const { fetchData } = (0, datatable_2.useDataTable)();
    const [countdown, setCountdown] = (0, react_1.useState)(null);
    const [isCollectable, setIsCollectable] = (0, react_1.useState)(false);
    const openStake = async (item) => {
        setSelectedItem(item);
        const durationInDays = item.duration.duration;
        const endDate = (0, date_fns_1.addDays)(new Date(item.createdAt), durationInDays);
        const countdown = calculateCountdown(item.createdAt, endDate.toISOString());
        setCountdown(countdown);
    };
    (0, react_1.useEffect)(() => {
        if (selectedItem) {
            const intervalId = setInterval(() => {
                setCountdown((prevCountdown) => {
                    if (prevCountdown) {
                        const durationInDays = selectedItem.duration.duration;
                        const endDate = (0, date_fns_1.addDays)(new Date(prevCountdown.startDate), durationInDays);
                        const newCountdown = calculateCountdown(prevCountdown.startDate, endDate.toISOString());
                        setIsCollectable(newCountdown.progress >= 100);
                        return newCountdown;
                    }
                    return null;
                });
            }, 1000);
            return () => clearInterval(intervalId);
        }
    }, [selectedItem]);
    const calculateCountdown = (startDate, endDate) => {
        const now = new Date().getTime();
        const start = new Date(startDate).getTime();
        const end = new Date(endDate).getTime();
        const isStarted = now >= start;
        const timeRemaining = Math.max((end - now) / 1000, 0);
        const totalDuration = (end - start) / 1000; // Total duration in seconds
        const progress = ((totalDuration - timeRemaining) / totalDuration) * 100;
        const days = Math.floor(timeRemaining / (60 * 60 * 24));
        const hours = Math.floor((timeRemaining % (60 * 60 * 24)) / (60 * 60));
        const minutes = Math.floor((timeRemaining % (60 * 60)) / 60);
        const seconds = Math.floor(timeRemaining % 60);
        return {
            days,
            hours,
            minutes,
            seconds,
            isStarted,
            progress,
            endDate,
            startDate,
        };
    };
    const collectStake = async (id) => {
        const { error } = await (0, api_1.default)({
            url: `/api/ext/staking/log/${id}`,
            method: "POST",
        });
        if (!error) {
            setSelectedItem(null);
            fetchData();
        }
    };
    return (<Default_1.default title={t("Staking Logs")} color="muted">
      <datatable_1.DataTable title={t("Staking Logs")} endpoint={api} columnConfig={columnConfig} isCrud={false} hasStructure={false} hasAnalytics dropdownActionsSlot={(item) => (<>
            <ActionItem_1.default key="showPanel" icon="ph:eye" text="View" subtext="View details" onClick={() => {
                openStake(item);
            }}/>
          </>)}/>
      <panel_1.Panel isOpen={!!selectedItem} title={t("Stake")} tableName={t("Stake")} size="xl" onClose={() => setSelectedItem(null)}>
        {selectedItem && (<div className="flex flex-col justify-between gap-5 text-sm text-muted-800 dark:text-muted-200">
            <div className="contact flex w-full flex-row items-center justify-center gap-3 lg:justify-start">
              <div className="relative">
                <Avatar_1.default size="md" src={selectedItem.pool.icon ||
                `/img/crypto/${selectedItem.pool.currency.toLowerCase()}.webp`}/>
                <MashImage_1.MashImage src={`/img/crypto/${selectedItem.pool.chain}.webp`} width={16} height={16} alt="chain" className="absolute right-0 bottom-0"/>
              </div>
              <div className="text-start font-sans">
                <h4 className="text-base font-medium leading-tight text-muted-800 dark:text-muted-100">
                  {selectedItem.pool.currency} ({selectedItem.pool.name})
                </h4>
                <p className="font-sans text-xs text-muted-400">
                  {selectedItem.pool.description}
                </p>
              </div>
            </div>

            <StakeLogInfo_1.StakeLogInfo log={selectedItem}/>

            {countdown && (<div className="mt-6 w-full">
                <Progress_1.default size="xs" color="success" value={countdown.progress}/>
                <div className="flex justify-between mt-1 w-full text-xs text-muted-500 dark:text-muted-400">
                  <p>{t("Collectable in")}</p>
                  <p>
                    {countdown.days}d {countdown.hours}h {countdown.minutes}m{" "}
                    {countdown.seconds}s{" "}
                    <span className="text-success-500">
                      ({countdown.progress.toFixed(2)}%)
                    </span>
                  </p>
                </div>
              </div>)}

            <Card_1.default className="p-2 w-full">
              <Button_1.default onClick={() => {
                collectStake(selectedItem.id);
            }} color="primary" shape="rounded-sm" className="w-full" disabled={!isCollectable}>
                {t("Collect")}
              </Button_1.default>
            </Card_1.default>
          </div>)}
      </panel_1.Panel>
    </Default_1.default>);
};
exports.default = StakingLogs;
