"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_2 = require("@iconify/react");
const IconButton_1 = __importDefault(require("@/components/elements/base/button-icon/IconButton"));
const Tooltip_1 = require("@/components/elements/base/tooltips/Tooltip");
const ViewToggle = ({ viewMode, setViewMode }) => {
    return (<div className="flex items-center gap-2 border-s ps-4 border-muted-200 dark:border-muted-800">
      <Tooltip_1.Tooltip content="List View">
        <IconButton_1.default onClick={() => setViewMode("list")} color={viewMode === "list" ? "purple" : "muted"}>
          <react_2.Icon icon="stash:list-ul"/>
        </IconButton_1.default>
      </Tooltip_1.Tooltip>

      <Tooltip_1.Tooltip content="Grid View">
        <IconButton_1.default onClick={() => setViewMode("grid")} color={viewMode === "grid" ? "purple" : "muted"}>
          <react_2.Icon icon="bitcoin-icons:grid-filled"/>
        </IconButton_1.default>
      </Tooltip_1.Tooltip>
    </div>);
};
exports.default = ViewToggle;
