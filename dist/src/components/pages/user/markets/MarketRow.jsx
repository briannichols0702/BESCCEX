"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_2 = require("@iconify/react");
const link_1 = __importDefault(require("next/link"));
const Avatar_1 = __importDefault(require("@/components/elements/base/avatar/Avatar"));
const IconButton_1 = __importDefault(require("@/components/elements/base/button-icon/IconButton"));
const react_loading_skeleton_1 = __importDefault(require("react-loading-skeleton"));
const MarketRow = ({ item, isDark, handleNavigation, }) => {
    return (<tr className={`border-b border-muted-200 transition-colors duration-300 last:border-none 
      hover:bg-muted-200/40 dark:border-muted-800 dark:hover:bg-muted-900/60 cursor-pointer`} onClick={() => handleNavigation(item.symbol)}>
      <td className="px-4 py-3 align-middle">
        <div className="flex items-center gap-2">
          <Avatar_1.default size="xxs" src={item.icon || `/img/crypto/${item.currency.toLowerCase()}.webp`}/>
          <span className="line-clamp-1 text-md text-muted-700 dark:text-muted-200">
            {item.symbol}
          </span>
        </div>
      </td>
      <td className="px-4 py-3 align-middle">
        <span className="line-clamp-1 text-md text-muted-700 dark:text-muted-200">
          {item.price || (<react_loading_skeleton_1.default width={40} height={10} baseColor={isDark ? "#27272a" : "#f7fafc"} highlightColor={isDark ? "#3a3a3e" : "#edf2f7"}/>)}
        </span>
      </td>
      <td className="px-4 py-3 align-middle">
        <span className={`line-clamp-1 text-md text-${item.change >= 0
            ? item.change === 0
                ? "muted"
                : "success"
            : "danger"}-500`}>
          {item.change ? (`${item.change}%`) : (<react_loading_skeleton_1.default width={40} height={10} baseColor={isDark ? "#27272a" : "#f7fafc"} highlightColor={isDark ? "#3a3a3e" : "#edf2f7"}/>)}
        </span>
      </td>
      <td className="px-4 py-3 align-middle">
        <div>
          <span className="line-clamp-1 text-md text-muted-700 dark:text-muted-200">
            {item.baseVolume || (<react_loading_skeleton_1.default width={40} height={10} baseColor={isDark ? "#27272a" : "#f7fafc"} highlightColor={isDark ? "#3a3a3e" : "#edf2f7"}/>)}{" "}
            <span className="text-muted-400 text-xs">({item.currency})</span>
          </span>
          <span className="line-clamp-1 text-md text-muted-700 dark:text-muted-200">
            {item.quoteVolume || (<react_loading_skeleton_1.default width={40} height={10} baseColor={isDark ? "#27272a" : "#f7fafc"} highlightColor={isDark ? "#3a3a3e" : "#edf2f7"}/>)}{" "}
            <span className="text-muted-400 text-xs">({item.pair})</span>
          </span>
        </div>
      </td>
      <td className="px-4 py-3 align-middle text-end">
        <link_1.default href={`/trade/${item.symbol.replace("/", "_")}`}>
          <IconButton_1.default color="contrast" variant="pastel" size="sm">
            <react_2.Icon icon="akar-icons:arrow-right" width={16}/>
          </IconButton_1.default>
        </link_1.default>
      </td>
    </tr>);
};
exports.default = react_1.default.memo(MarketRow);
