"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Input_1 = __importDefault(require("@/components/elements/form/input/Input"));
const MarketsToolbar = ({ t, onSearch }) => {
    const handleSearchChange = (event) => {
        const { value } = event.target;
        onSearch(value);
    };
    return (<div className="mb-4 flex items-center justify-between">
      <div className="flex items-center">
        <h2 className="font-sans text-2xl font-light text-muted-700 dark:text-muted-200">
          {t("Markets Overview")}
        </h2>
      </div>
      <div className="flex items-center justify-end gap-3">
        <div className="hidden w-full md:block md:w-auto">
          <Input_1.default icon="lucide:search" color="contrast" placeholder={t("Search...")} onChange={handleSearchChange}/>
        </div>
      </div>
    </div>);
};
exports.default = MarketsToolbar;
