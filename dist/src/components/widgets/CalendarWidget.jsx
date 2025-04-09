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
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_2 = require("@iconify/react");
const date_fns_1 = require("date-fns");
const class_variance_authority_1 = require("class-variance-authority");
const next_i18next_1 = require("next-i18next");
const colStartClasses = [
    "",
    "col-start-2",
    "col-start-3",
    "col-start-4",
    "col-start-5",
    "col-start-6",
    "col-start-7",
];
const calendarStyles = (0, class_variance_authority_1.cva)("mx-auto flex w-full py-2.5 items-center justify-center rounded-lg text-xs transition-colors duration-300", {
    variants: {
        isToday: { true: "", false: "" },
        isSelected: { true: "", false: "" },
        isSameMonth: {
            true: "",
            false: "",
        },
    },
    compoundVariants: [
        {
            isSelected: true,
            className: "font-semibold",
        },
        {
            isToday: true,
            className: "font-semibold bg-primary-500/10 text-primary-500",
        },
        {
            isSelected: true,
            isToday: true,
            className: "bg-primary-500 text-white",
        },
        {
            isSelected: false,
            isToday: false,
            isSameMonth: true,
            className: "text-center hover:bg-muted-200 hover:text-primary-500 dark:hover:bg-muted-800",
        },
        {
            isSelected: false,
            isToday: false,
            isSameMonth: false,
            className: "text-muted-300",
        },
        {
            isSelected: true,
            isToday: false,
            className: "bg-primary-500 text-white",
        },
    ],
});
const CalendarWidget = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const today = (0, date_fns_1.startOfToday)();
    const [selectedDay, setSelectedDay] = (0, react_1.useState)(today);
    const [currentMonth, setCurrentMonth] = (0, react_1.useState)((0, date_fns_1.format)(today, "MMM-yyyy"));
    const firstDayCurrentMonth = (0, date_fns_1.parse)(currentMonth, "MMM-yyyy", new Date());
    const days = (0, date_fns_1.eachDayOfInterval)({
        start: (0, date_fns_1.startOfWeek)(firstDayCurrentMonth),
        end: (0, date_fns_1.endOfWeek)((0, date_fns_1.endOfMonth)(firstDayCurrentMonth)),
    });
    function previousMonth() {
        const firstDayNextMonth = (0, date_fns_1.add)(firstDayCurrentMonth, { months: -1 });
        setCurrentMonth((0, date_fns_1.format)(firstDayNextMonth, "MMM-yyyy"));
    }
    function nextMonth() {
        const firstDayNextMonth = (0, date_fns_1.add)(firstDayCurrentMonth, { months: 1 });
        setCurrentMonth((0, date_fns_1.format)(firstDayNextMonth, "MMM-yyyy"));
    }
    return (<div className="w-full">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center ps-2 text-muted-800 dark:text-muted-100">
          <h3>{(0, date_fns_1.format)(firstDayCurrentMonth, "MMMM yyyy")}</h3>
        </div>
        <div className="flex items-center justify-end">
          <button onClick={previousMonth} className="relative flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted-400 transition-all duration-300 dark:text-muted-500">
            <react_2.Icon icon="lucide:chevron-left" className="text-muted-500 transition-colors duration-300"/>
          </button>
          <button onClick={nextMonth} className="relative flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted-400 transition-all duration-300 dark:text-muted-500">
            <react_2.Icon icon="lucide:chevron-right" className="text-muted-500 transition-colors duration-300"/>
          </button>
        </div>
      </div>

      <div className="w-full text-xs text-muted-800 dark:text-muted-100">
        <div className=" grid grid-cols-7 text-xs font-semibold uppercase text-muted-500 *:py-2 *:text-center">
          <div>{t("Sun")}</div>
          <div>{t("Mon")}</div>
          <div>{t("Tue")}</div>
          <div>{t("Wed")}</div>
          <div>{t("Thu")}</div>
          <div>{t("Fri")}</div>
          <div>{t("Sat")}</div>
        </div>
        <div className="grid grid-cols-7 text-sm gap-[0.2rem]">
          {days.map((day, dayIdx) => (<div key={day.toString()} className={`  ${dayIdx === 0 ? colStartClasses[(0, date_fns_1.getDay)(day)] : ""}`}>
              <button type="button" onClick={() => setSelectedDay(day)} className={calendarStyles({
                isSelected: (0, date_fns_1.isEqual)(day, selectedDay),
                isToday: (0, date_fns_1.isToday)(day),
                isSameMonth: (0, date_fns_1.isSameMonth)(day, firstDayCurrentMonth),
            })}>
                <time dateTime={(0, date_fns_1.format)(day, "yyyy-MM-dd")}>
                  {(0, date_fns_1.format)(day, "d")}
                </time>
              </button>
            </div>))}
        </div>
      </div>
    </div>);
};
exports.default = CalendarWidget;
