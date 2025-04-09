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
const object_table_1 = require("@/components/elements/base/object-table");
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const Modal_1 = __importDefault(require("@/components/elements/base/modal/Modal"));
const Card_1 = __importDefault(require("@/components/elements/base/card/Card"));
const IconButton_1 = __importDefault(require("@/components/elements/base/button-icon/IconButton"));
const react_2 = require("@iconify/react");
const apiListBackups = "/api/admin/system/database/backup";
const apiBackup = "/api/admin/system/database/backup";
const apiRestore = "/api/admin/system/database/restore";
const DatabaseBackupDashboard = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const router = (0, router_1.useRouter)();
    const [backups, setBackups] = (0, react_1.useState)([]);
    const [isModalOpen, setIsModalOpen] = (0, react_1.useState)(false);
    const [restoreFile, setRestoreFile] = (0, react_1.useState)(null);
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const fetchBackups = async () => {
        const { data, error } = await (0, api_1.default)({
            url: apiListBackups,
            silent: true,
        });
        if (!error) {
            setBackups(data);
        }
    };
    const initiateBackup = async () => {
        setIsLoading(true);
        const { error } = await (0, api_1.default)({
            url: apiBackup,
            method: "POST",
        });
        if (!error) {
            fetchBackups();
            setIsModalOpen(false);
        }
        setIsLoading(false);
    };
    const restoreBackup = async (filename) => {
        setIsLoading(true);
        const { error } = await (0, api_1.default)({
            url: apiRestore,
            method: "POST",
            body: { backupFile: filename },
        });
        if (!error) {
            fetchBackups();
            setRestoreFile(null);
        }
        setIsLoading(false);
    };
    (0, react_1.useEffect)(() => {
        if (router.isReady) {
            fetchBackups();
        }
    }, [router.isReady]);
    const columnConfig = [
        {
            field: "filename",
            label: "Filename",
            type: "string",
            sortable: true,
        },
        {
            field: "path",
            label: "Path",
            type: "string",
            sortable: true,
        },
        {
            field: "createdAt",
            label: "Created At",
            type: "date",
            sortable: true,
        },
        {
            field: "actions",
            label: "Actions",
            type: "actions",
            sortable: false,
            actions: [
                {
                    icon: "mdi:restore",
                    color: "primary",
                    onClick: (row) => {
                        setRestoreFile(row.filename);
                    },
                    size: "sm",
                    tooltip: "Restore Backup",
                },
            ],
        },
    ];
    return (<Default_1.default title={t("Database Backups")} color="muted">
      <object_table_1.ObjectTable title={t("Database Backups")} items={backups} setItems={setBackups} columnConfig={columnConfig} navSlot={<>
            <Button_1.default color="primary" onClick={() => setIsModalOpen(true)} className="ml-2" shape={"rounded-sm"} variant={"outlined"}>
              {t("Create Backup")}
            </Button_1.default>
          </>} shape="rounded-sm" size="sm" initialPerPage={20}/>
      <Modal_1.default open={isModalOpen} size="sm">
        <Card_1.default shape="smooth">
          <div className="flex items-center justify-between p-4 md:p-6">
            <p className="font-sans text-lg font-medium text-muted-900 dark:text-white">
              {t("Confirm Backup")}
            </p>

            <IconButton_1.default size="sm" shape="full" onClick={() => setIsModalOpen(false)}>
              <react_2.Icon icon="lucide:x" className="h-4 w-4"/>
            </IconButton_1.default>
          </div>
          <div className="p-4 md:p-6">
            <p className="text-muted-400 dark:text-muted-600 text-sm mb-4">
              {t("Are you sure you want to create a new backup?")}
            </p>
          </div>
          <div className="p-4 md:p-6">
            <div className="flex gap-x-2 justify-end">
              <Button_1.default color="primary" onClick={initiateBackup} disabled={isLoading} loading={isLoading}>
                {t("Confirm")}
              </Button_1.default>
            </div>
          </div>
        </Card_1.default>
      </Modal_1.default>

      {restoreFile && (<Modal_1.default open={Boolean(restoreFile)} size="sm">
          <Card_1.default shape="smooth">
            <div className="flex items-center justify-between p-4 md:p-6">
              <p className="font-sans text-lg font-medium text-muted-900 dark:text-white">
                {t("Confirm Restore")}
              </p>

              <IconButton_1.default size="sm" shape="full" onClick={() => setRestoreFile(null)}>
                <react_2.Icon icon="lucide:x" className="h-4 w-4"/>
              </IconButton_1.default>
            </div>
            <div className="p-4 md:p-6">
              <p className="text-muted-400 dark:text-muted-600 text-sm mb-4">
                {t(`Are you sure you want to restore the backup "${restoreFile}"?`)}
              </p>
            </div>
            <div className="p-4 md:p-6">
              <div className="flex gap-x-2 justify-end">
                <Button_1.default color="primary" onClick={() => restoreBackup(restoreFile)} disabled={isLoading} loading={isLoading}>
                  {t("Confirm")}
                </Button_1.default>
              </div>
            </div>
          </Card_1.default>
        </Modal_1.default>)}
    </Default_1.default>);
};
exports.default = DatabaseBackupDashboard;
exports.permission = "Access Database Backup Management";
