"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_2 = require("@iconify/react");
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const ModalHeader = ({ onPrev, onNext, index }) => {
    return (<div className="flex justify-between items-center">
      <div className="flex gap-2">
        <Button_1.default onClick={onPrev} type="button" disabled={index === 1}>
          <react_2.Icon icon="mdi:arrow-left"/> Previous
        </Button_1.default>
        <Button_1.default onClick={onNext} type="button">
          Next <react_2.Icon icon="mdi:arrow-right"/>
        </Button_1.default>
      </div>
    </div>);
};
exports.default = ModalHeader;
