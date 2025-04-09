"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const UserInfo = ({ label, user }) => {
    return (<div className="flex items-center space-x-3">
      <img src={user.avatar || "/img/avatars/placeholder.webp"} alt={user.firstName} className="w-10 h-10 rounded-full"/>
      <div className="flex flex-col items-start">
        <h2 className="text-lg font-medium text-muted">{label}</h2>
        <span className="font-medium text-muted-900 dark:text-white">
          @{user.firstName}
        </span>
      </div>
    </div>);
};
exports.default = UserInfo;
