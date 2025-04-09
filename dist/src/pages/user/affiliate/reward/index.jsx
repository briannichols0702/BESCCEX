"use client";
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
const react_1 = __importStar(require("react"));
const Default_1 = __importDefault(require("@/layouts/Default"));
const datatable_1 = require("@/components/elements/base/datatable");
const ActionItem_1 = __importDefault(require("@/components/elements/base/dropdown-action/ActionItem"));
const api_1 = __importDefault(require("@/utils/api"));
const datatable_2 = require("@/stores/datatable");
const IconButton_1 = __importDefault(require("@/components/elements/base/button-icon/IconButton"));
const react_2 = require("@iconify/react");
const Card_1 = __importDefault(require("@/components/elements/base/card/Card"));
const Modal_1 = __importDefault(require("@/components/elements/base/modal/Modal"));
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const IconBox_1 = __importDefault(require("@/components/elements/base/iconbox/IconBox"));
const next_i18next_1 = require("next-i18next");
const api = "/api/ext/affiliate/reward";
const columnConfig = [
    {
        field: "condition.name",
        label: "Condition",
        type: "text",
        sortable: true,
        getValue: (row) => { var _a; return (_a = row.condition) === null || _a === void 0 ? void 0 : _a.title; },
    },
    {
        field: "reward",
        label: "Reward",
        type: "number",
        sortable: true,
        getValue: (row) => { var _a; return `${row.reward} ${(_a = row.condition) === null || _a === void 0 ? void 0 : _a.rewardCurrency}`; },
    },
    {
        field: "isClaimed",
        label: "Status",
        type: "select",
        sortable: true,
        options: [
            { value: true, label: "Claimed", color: "success" },
            { value: false, label: "Unclaimed", color: "warning" },
        ],
    },
];
const MlmReferralRewards = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const { fetchData } = (0, datatable_2.useDataTable)();
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [isClaiming, setIsClaiming] = (0, react_1.useState)(false);
    const [selectedItem, setSelectedItem] = (0, react_1.useState)(null);
    const handleClaim = async () => {
        setIsLoading(true);
        const { error } = await (0, api_1.default)({
            url: `/api/ext/affiliate/reward/${selectedItem.id}/claim`,
            method: "POST",
        });
        if (!error) {
            fetchData();
        }
        setIsLoading(false);
    };
    return (<Default_1.default title={t("MLM Referral Rewards")} color="muted">
      <datatable_1.DataTable title={t("MLM Referral Rewards")} endpoint={api} columnConfig={columnConfig} hasStructure={false} isCrud={false} hasAnalytics dropdownActionsSlot={(item) => (<>
            <ActionItem_1.default key="claim" icon="mdi:wallet-plus-outline" text="Claim" subtext="Claim reward" onClick={async () => {
                setSelectedItem(item);
                setIsClaiming(true);
            }}/>
          </>)}/>

      <Modal_1.default open={isClaiming} size="sm">
        <Card_1.default shape="smooth">
          <div className="flex items-center justify-between p-4 md:p-6">
            <p className="font-sans text-lg font-medium text-muted-900 dark:text-white">
              {t("Claim Reward")}
            </p>

            <IconButton_1.default size="sm" shape="full" onClick={() => {
            setIsClaiming(false);
        }}>
              <react_2.Icon icon="lucide:x" className="h-4 w-4"/>
            </IconButton_1.default>
          </div>
          <div className="p-4 md:p-6 text-center">
            <div className="flex justify-center">
              <IconBox_1.default icon="mdi:wallet-plus-outline" color="success" className="mb-4" size={"xl"} variant={"pastel"}/>
            </div>
            <p className="text-muted-400 dark:text-muted-600 text-sm mb-4">
              {t("Are you sure you want to claim this reward")}
            </p>
          </div>
          <div className="p-4 md:p-6">
            <div className="flex gap-x-2 justify-end">
              <Button_1.default color="success" type="button" onClick={async () => {
            await handleClaim();
            setIsClaiming(false);
        }} disabled={isLoading} loading={isLoading}>
                {t("Claim")}
              </Button_1.default>
            </div>
          </div>
        </Card_1.default>
      </Modal_1.default>
    </Default_1.default>);
};
exports.default = MlmReferralRewards;
