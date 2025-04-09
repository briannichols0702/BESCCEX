"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const SortableHeader_1 = require("@/components/pages/trade/markets/SortableHeader");
const AssetTableHeader = ({ sortState, setSortState, }) => (<div className="grid grid-cols-5 gap-4 py-3 bg-muted-150 dark:bg-muted-900 rounded-lg text-muted-400 text-sm mb-1">
    <SortableHeader_1.SortableHeader field="index" title="Item" sort={sortState} setSort={setSortState} className="col-span-2 ps-4 text-muted-700 dark:text-muted-200" size="sm"/>
    <SortableHeader_1.SortableHeader field="price" title="Price" sort={sortState} setSort={setSortState} size="sm" className="text-muted-700 dark:text-muted-200"/>
    <span className="text-muted-700 dark:text-muted-200">Owner</span>
    <SortableHeader_1.SortableHeader field="createdAt" title="Listed Time" sort={sortState} setSort={setSortState} size="sm" className="text-muted-700 dark:text-muted-200"/>
  </div>);
exports.default = AssetTableHeader;
