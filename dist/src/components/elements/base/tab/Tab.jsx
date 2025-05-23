"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tab = void 0;
const react_1 = require("react");
const TabBase = ({ value, label, tab, setTab, color = "primary", }) => {
    return (<button type="button" className={`shrink-0 border-b-2 px-6 py-2 text-sm transition-colors duration-300
                ${tab === value
            ? `border-${color}-500 text-${color}-500 dark:text-muted-200`
            : "border-transparent text-muted-400 hover:text-muted-500 dark:text-muted-600 dark:hover:text-muted-500"}
              `} onClick={() => {
            setTab(value);
        }}>
      <span>{label}</span>
    </button>);
};
exports.Tab = (0, react_1.memo)(TabBase);
