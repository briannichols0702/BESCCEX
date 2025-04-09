"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const CircleChartWidget_1 = __importDefault(require("./CircleChartWidget"));
const CircleWidget = ({ title, text, icon, circleColor = "primary", circlePercentage = 84, }) => {
    return (<div className="flex w-full items-center rounded-lg border border-muted-200 bg-white p-5 dark:border-muted-800 dark:bg-muted-900">
      <CircleChartWidget_1.default circleColor={circleColor} height={70} width={70} circlePercentage={circlePercentage}>
        {typeof icon === "string" ? (<span className="inner-text text-center font-medium text-muted-800 dark:text-muted-100">
            {icon}
          </span>) : (icon)}
      </CircleChartWidget_1.default>
      <div className="circle-meta ms-6 ">
        <h3 className="font-sans text-base font-normal text-muted-800 dark:text-muted-100">
          {title}
        </h3>
        <p className="text-xs text-muted-400 max-w-xs">{text}</p>
      </div>
    </div>);
};
exports.default = CircleWidget;
