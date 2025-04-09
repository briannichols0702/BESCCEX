"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const dotColors = {
    primary: "bg-primary",
    info: "bg-info",
    yellow: "bg-yellow",
    success: "bg-success",
    warning: "bg-warning",
    danger: "bg-danger",
};
const Dot = ({ color }) => {
    return (<span className={`dot dot-${color} ${dotColors[color]} block h-3 w-3 rounded-full`}></span>);
};
exports.default = Dot;
