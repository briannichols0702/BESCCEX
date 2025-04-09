"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.permission = void 0;
const Default_1 = __importDefault(require("@/layouts/Default"));
const react_1 = __importStar(require("react"));
const router_1 = require("next/router");
const api_1 = __importDefault(require("@/utils/api"));
const next_i18next_1 = require("next-i18next");
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const Modal_1 = __importDefault(require("@/components/elements/base/modal/Modal"));
const Card_1 = __importDefault(require("@/components/elements/base/card/Card"));
const IconButton_1 = __importDefault(require("@/components/elements/base/button-icon/IconButton"));
const react_2 = require("@iconify/react");
const ws_1 = __importDefault(require("@/utils/ws"));
const apiMigrate = "/api/admin/system/database/migrate";
const DatabaseMigrationDashboard = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const router = (0, router_1.useRouter)();
    const [isModalOpen, setIsModalOpen] = (0, react_1.useState)(false);
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [logs, setLogs] = (0, react_1.useState)([]);
    const logRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        if (router.isReady) {
            const wsManager = new ws_1.default("/api/admin/system/database/migrate");
            wsManager.connect();
            wsManager.on("open", () => {
                wsManager.send({ action: "SUBSCRIBE", payload: {} });
            });
            wsManager.on("message", (message) => {
                const newLog = {
                    message: `[${new Date().toLocaleTimeString()}] ${message.message}`,
                    status: message.status,
                };
                setLogs((prevLogs) => [...prevLogs, newLog]);
            });
            return () => {
                wsManager.disconnect();
            };
        }
    }, [router.isReady]);
    (0, react_1.useEffect)(() => {
        if (logRef.current) {
            logRef.current.scrollTop = logRef.current.scrollHeight;
        }
    }, [logs]);
    const initiateMigration = async () => {
        setIsModalOpen(false);
        setIsLoading(true);
        await (0, api_1.default)({
            url: apiMigrate,
            method: "POST",
        });
        setIsLoading(false);
    };
    const renderLogs = () => {
        return logs.map((log, index) => {
            const logClass = typeof log.status !== "undefined" && log.status === true
                ? "text-success-500"
                : typeof log.status !== "undefined" && log.status === false
                    ? "text-danger-500"
                    : "text-muted-800";
            return (<div key={index} className={`${logClass} whitespace-nowrap`}>
          {log.message}
        </div>);
        });
    };
    return (<Default_1.default title={t("Database Migration")} color="muted">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-medium text-muted-900 dark:text-white">
          {t("Database Migration")}
        </h1>
        <Button_1.default color="primary" onClick={() => setIsModalOpen(true)} className="ml-2" shape={"rounded-sm"} variant={"outlined"} animated={false}>
          {t("Start Migration")}
        </Button_1.default>
      </div>

      <Modal_1.default open={isModalOpen} size="sm">
        <Card_1.default shape="smooth">
          <div className="flex items-center justify-between p-4 md:p-6">
            <p className="font-sans text-lg font-medium text-muted-900 dark:text-white">
              {t("Confirm Migration")}
            </p>

            <IconButton_1.default size="sm" shape="full" onClick={() => setIsModalOpen(false)}>
              <react_2.Icon icon="lucide:x" className="h-4 w-4"/>
            </IconButton_1.default>
          </div>
          <div className="p-4 md:p-6">
            <p className="text-muted-400 dark:text-muted-600 text-sm mb-4">
              {t("Are you sure you want to start the migration?")}
            </p>
          </div>
          <div className="p-4 md:p-6">
            <div className="flex gap-x-2 justify-end">
              <Button_1.default color="primary" onClick={initiateMigration} disabled={isLoading} loading={isLoading}>
                {t("Confirm")}
              </Button_1.default>
            </div>
          </div>
        </Card_1.default>
      </Modal_1.default>

      <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-sm shadow-sm overflow-auto text-sm slimscroll h-[calc(100vh-200px)]" ref={logRef}>
        {renderLogs()}
      </div>
    </Default_1.default>);
};
exports.default = DatabaseMigrationDashboard;
exports.permission = "Access Database Migration Management";
