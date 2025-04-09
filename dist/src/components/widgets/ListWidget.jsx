"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Card_1 = __importDefault(require("@/components/elements/base/card/Card"));
const ListWidget = ({ title, color = "contrast", shape = "smooth", children, }) => {
    const childrenArray = react_1.default.Children.toArray(children);
    return (<div className="flex w-full">
      <Card_1.default color={color} shape={shape} className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <h4 className="font-sans text-base font-medium leading-tight tracking-wider text-muted-800 dark:text-white">
              {title}
            </h4>
          </div>
        </div>
        <ul className="list-none">
          {childrenArray.map((child, index) => (<li key={index}>{child}</li>))}
        </ul>
      </Card_1.default>
    </div>);
};
exports.default = ListWidget;
