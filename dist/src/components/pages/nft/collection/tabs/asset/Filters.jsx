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
const Filters = ({ listingType, setListingType, minPrice, setMinPrice, maxPrice, setMaxPrice, onFilter, }) => {
    return (<div className="flex space-x-4 text-muted-400 items-end">
      <Select_1.default className="bg-muted-800 px-4 py-2 rounded-md" value={listingType} onChange={(e) => setListingType(e.target.value)} options={["All", "Buy Now", "Auction"]} label="Listing Type"/>
      <Input_1.default type="number" placeholder="Min. value" value={minPrice !== undefined ? minPrice : ""} onChange={(e) => setMinPrice(Number(e.target.value))} label="Min. value"/>
      <Input_1.default type="number" placeholder="Max. value" value={maxPrice !== undefined ? maxPrice : ""} onChange={(e) => setMaxPrice(Number(e.target.value))} label="Max. value"/>

      <Tooltip_1.Tooltip content="Filter">
        <IconButton_1.default onClick={onFilter}>
          <react_2.Icon icon="mdi:filter"/>
        </IconButton_1.default>
      </Tooltip_1.Tooltip>
    </div>);
};
exports.default = Filters;
