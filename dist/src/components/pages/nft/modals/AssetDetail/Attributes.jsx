"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const AssetAttributes = ({ attributes }) => {
    if (!attributes || attributes.length === 0)
        return <p>No attributes found.</p>;
    return (<div className="space-y-4 p-4 bg-muted-100 dark:bg-muted-800 rounded-lg shadow-md">
      <h2 className="text-lg font-medium text-muted-900 dark:text-white">
        Attributes
      </h2>
      <ul className="space-y-2">
        {attributes.map((attr, index) => (<li key={index} className="flex justify-between text-sm text-muted-700 dark:text-muted-300">
            <span>{attr.trait_type}</span>
            <span className="font-semibold">{attr.value}</span>
          </li>))}
      </ul>
    </div>);
};
exports.default = AssetAttributes;
