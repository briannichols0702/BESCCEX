"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Tag_1 = __importDefault(require("@/components/elements/base/tag/Tag"));
const next_i18next_1 = require("next-i18next");
const OrderUserInfo = ({ order }) => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<div className="mb-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold mb-2 dark:text-white">
          {t("User Information")}
        </h2>
        <Tag_1.default color={order.status === "PENDING"
            ? "warning"
            : order.status === "COMPLETED"
                ? "success"
                : order.status === "CANCELLED"
                    ? "danger"
                    : "muted"}>
          {order.status}
        </Tag_1.default>
      </div>
      <div className="flex flex-col">
        <span className="mb-2 text-xs uppercase text-muted-400 dark:text-gray-400">
          {t("Recipient")}
        </span>
        <ul className="text-muted-800 dark:text-gray-300">
          <li className="flex divide-x divide-muted-200 border-t border-x border-muted-200 text-sm dark:divide-gray-700 dark:border-gray-700">
            <div className="w-1/4 p-2 text-muted-400 dark:text-gray-400">
              {t("Name")}
            </div>
            <div className="flex-1 p-2 font-medium text-muted-800 dark:text-gray-300">
              {order.user.firstName} {order.user.lastName}
            </div>
          </li>
          <li className="flex divide-x divide-muted-200 border border-muted-200 text-sm dark:divide-gray-700 dark:border-gray-700">
            <div className="w-1/4 p-2 text-muted-400 dark:text-gray-400">
              {t("Email")}
            </div>
            <div className="flex-1 p-2 font-medium text-muted-800 dark:text-gray-300">
              {order.user.email}
            </div>
          </li>
        </ul>
      </div>
    </div>);
};
exports.default = OrderUserInfo;
