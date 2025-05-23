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
const react_2 = require("@iconify/react");
const framer_motion_1 = require("framer-motion");
const dashboard_1 = require("@/stores/dashboard");
const cn_1 = require("@/utils/cn");
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const next_i18next_1 = require("next-i18next");
const react_3 = require("@headlessui/react");
const NotificationItem = ({ item, index, onDragEnd }) => {
    const ref = (0, react_1.useRef)(null);
    const isInView = (0, framer_motion_1.useInView)(ref, { once: true });
    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.01 },
        }),
        exit: { opacity: 0, x: -100, transition: { duration: 0.5 } },
    };
    return (<framer_motion_1.motion.li ref={ref} className="relative rounded-md p-3 hover:bg-muted-100 dark:hover:bg-muted-900 transition-colors duration-300 cursor-pointer bg-muted-50 dark:bg-muted-850" custom={index} initial="hidden" animate={isInView ? "visible" : "hidden"} exit="exit" variants={itemVariants} drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.4} onDragEnd={(event, info) => onDragEnd(event, info, item.id)} style={{
            zIndex: 100 - index,
            position: "relative",
        }}>
      <div className="flex justify-between items-start">
        <div className="flex gap-3.5">
          <div className="relative flex h-12 w-12 items-center bg-white dark:bg-muted-900 justify-center rounded-full border border-muted-200 shadow-lg shadow-muted-300/30 dark:border-muted-800 dark:shadow-muted-800/30">
            <react_2.Icon icon="ph:notification-duotone" className="h-4 w-4 stroke-primary-500 stroke-[1.28px] text-primary-500 transition-[stroke] duration-300"/>
          </div>
          <div>
            <p className="text-sm leading-snug text-muted-500">
              {item.link ? (<a href={item.link} className="cursor-pointer font-medium text-primary-500 hover:underline">
                  {item.title}
                </a>) : (<span className="font-medium text-primary-500">
                  {item.title}
                </span>)}{" "}
              {item.message}
            </p>
            <small className="text-xs text-muted-400">
              {new Date(item.createdAt).toLocaleTimeString()}
            </small>
          </div>
        </div>
      </div>
    </framer_motion_1.motion.li>);
};
const NotificationTabs = ({ shape = "smooth", }) => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const { notifications, removeNotification, clearNotifications } = (0, dashboard_1.useDashboardStore)();
    const [clearIcon, setClearIcon] = (0, react_1.useState)({});
    const categories = {
        activity: notifications.filter((notification) => notification.type.toLowerCase() === "activity"),
        system: notifications.filter((notification) => notification.type.toLowerCase() === "system"),
        security: notifications.filter((notification) => notification.type.toLowerCase() === "security"),
    };
    const handleDragEnd = (event, info, id) => {
        if (info.point.x <= 25) {
            removeNotification(id);
        }
    };
    const handleClearClick = (category) => {
        if (clearIcon[category]) {
            clearNotifications(category);
        }
        else {
            setClearIcon((prev) => ({ ...prev, [category]: true }));
        }
    };
    return (<div className="relative w-full h-full flex flex-col overflow-x-hidden slimscroll">
      <div className="shrink-0 pe-1">
        <react_3.Tab.Group>
          <react_3.Tab.List className={`
              flex space-x-1 bg-muted-100 p-1 dark:bg-muted-900
              ${shape === "rounded-sm" ? "rounded-md" : ""}
              ${shape === "smooth" ? "rounded-lg" : ""}
              ${shape === "curved" ? "rounded-xl" : ""}
              ${shape === "full" ? "rounded-full" : ""}
            `}>
            {Object.keys(categories).map((category) => (<react_3.Tab key={category} className={({ selected }) => (0, cn_1.cn)("w-full py-2.5 text-sm font-medium leading-5", shape === "rounded-sm" ? "rounded-md" : "", shape === "smooth" ? "rounded-lg" : "", shape === "curved" ? "rounded-xl" : "", shape === "full" ? "rounded-full" : "", selected
                ? "bg-white text-primary-500 shadow-sm dark:bg-muted-800"
                : "text-muted-400 hover:text-muted-500 dark:hover:text-muted-100")}>
                {category.charAt(0).toUpperCase() + category.slice(1)} (
                {categories[category].length})
              </react_3.Tab>))}
          </react_3.Tab.List>
          <react_3.Tab.Panels className="grow mt-2">
            {Object.entries(categories).map(([category, items]) => (<react_3.Tab.Panel key={category} className="relative py-3">
                {items.length === 0 ? (<div className="text-center text-muted-500 text-md">
                    {t("All caught up")}
                  </div>) : (<>
                    <framer_motion_1.AnimatePresence initial={false}>
                      <ul className="relative space-y-2">
                        {items.map((item, index) => (<NotificationItem key={item.id} // Ensure this key is unique for each item
                 item={item} index={index} onDragEnd={handleDragEnd}/>))}
                      </ul>
                    </framer_motion_1.AnimatePresence>
                    <div className="flex justify-end mt-2">
                      <Button_1.default variant={"pastel"} size={"sm"} color={"danger"} shape={"rounded-sm"} onClick={() => handleClearClick(category)}>
                        {clearIcon[category] ? (`Clear ${category} notifications`) : (<react_2.Icon icon="ph:x-bold" className="h-4 w-4 text-danger-500"/>)}
                      </Button_1.default>
                    </div>
                  </>)}
              </react_3.Tab.Panel>))}
          </react_3.Tab.Panels>
        </react_3.Tab.Group>
      </div>
    </div>);
};
exports.default = NotificationTabs;
