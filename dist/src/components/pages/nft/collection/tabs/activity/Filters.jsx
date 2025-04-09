"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Select_1 = __importDefault(require("@/components/elements/form/select/Select"));
const Input_1 = __importDefault(require("@/components/elements/form/input/Input"));
const IconButton_1 = __importDefault(require("@/components/elements/base/button-icon/IconButton"));
const react_2 = require("@iconify/react");
const Tooltip_1 = require("@/components/elements/base/tooltips/Tooltip");
const ActivityFilters = ({ search, setSearch, activityType, setActivityType, minValue, setMinValue, maxValue, setMaxValue, fromDate, setFromDate, toDate, setToDate, onFilter, }) => {
    return (<div className="flex justify-between space-x-4 text-muted-400 items-end mb-4">
      {/* Search Input */}
      <div className="w-64">
        <Input_1.default type="text" placeholder="Search by name or ID" value={search} onChange={(e) => setSearch(e.target.value)} icon="mdi:magnify" label="Search"/>
      </div>

      <div className="flex items-end gap-4">
        {/* Activity Type Select */}
        <Select_1.default className="bg-muted-800 px-4 py-2 rounded-md" value={activityType} onChange={(e) => setActivityType(e.target.value)} options={["All", "Transaction", "Bid"]} label="Activity Type"/>

        {/* Min and Max Value Inputs */}
        <Input_1.default type="number" placeholder="Min. value" value={minValue !== undefined ? minValue : ""} onChange={(e) => setMinValue(Number(e.target.value))} label="Min. value"/>
        <Input_1.default type="number" placeholder="Max. value" value={maxValue !== undefined ? maxValue : ""} onChange={(e) => setMaxValue(Number(e.target.value))} label="Max. value"/>

        {/* From and To Date Inputs */}
        <Input_1.default type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} label="From"/>
        <Input_1.default type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} label="To"/>

        {/* Filter Button */}
        <Tooltip_1.Tooltip content="Filter">
          <IconButton_1.default onClick={onFilter}>
            <react_2.Icon icon="mdi:filter"/>
          </IconButton_1.default>
        </Tooltip_1.Tooltip>
      </div>
    </div>);
};
exports.default = ActivityFilters;
