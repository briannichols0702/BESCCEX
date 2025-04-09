"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Input_1 = __importDefault(require("@/components/elements/form/input/Input"));
const SearchBar = ({ value, onChange, placeholder, }) => {
    return (<div className="w-64">
      <Input_1.default type="text" placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} icon="mdi:magnify" label="Search"/>
    </div>);
};
exports.default = SearchBar;
