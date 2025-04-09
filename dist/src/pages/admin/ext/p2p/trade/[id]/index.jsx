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
const react_1 = __importStar(require("react"));
const Default_1 = __importDefault(require("@/layouts/Default"));
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const Card_1 = __importDefault(require("@/components/elements/base/card/Card"));
const router_1 = require("next/router");
const page_header_1 = require("@/components/elements/base/page-header");
const trade_1 = __importDefault(require("@/stores/user/p2p/trade"));
const Chat_1 = require("@/components/pages/user/Chat");
const TradeInfo_1 = require("@/components/pages/user/p2p/TradeInfo");
const Modal_1 = __importDefault(require("@/components/elements/base/modal/Modal"));
const Textarea_1 = __importDefault(require("@/components/elements/form/textarea/Textarea"));
const dashboard_1 = require("@/stores/dashboard");
const IconButton_1 = __importDefault(require("@/components/elements/base/button-icon/IconButton"));
const react_2 = require("@iconify/react");
const Alert_1 = __importDefault(require("@/components/elements/base/alert/Alert"));
const next_i18next_1 = require("next-i18next");
const TradeDetails = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const { profile } = (0, dashboard_1.useDashboardStore)();
    const { trade, initializeWebSocket, disconnectWebSocket, handleFileUpload, isReplying, replyToTrade, fetchTrade, adminResolveDispute, adminCloseDispute, adminCompleteTrade, adminCancelTrade, } = (0, trade_1.default)();
    const [isResolvingDispute, setIsResolvingDispute] = (0, react_1.useState)(false);
    const [isCancelDisputeOpen, setIsCancelDisputeOpen] = (0, react_1.useState)(false);
    const [isCancellingOpen, setIsCancellingOpen] = (0, react_1.useState)(false);
    const [isCompletingOpen, setIsCompletingOpen] = (0, react_1.useState)(false);
    const [disputeReason, setDisputeReason] = (0, react_1.useState)("");
    const router = (0, router_1.useRouter)();
    const { id } = router.query;
    (0, react_1.useEffect)(() => {
        if (!router.isReady || !profile)
            return;
        fetchTrade(id);
        initializeWebSocket(profile.id, id);
        return () => {
            disconnectWebSocket();
        };
    }, [router.isReady, profile]);
    const messageSide = (userId) => {
        return userId === (profile === null || profile === void 0 ? void 0 : profile.id) ? "left" : "right";
    };
    if (!trade)
        return null;
    const renderDisputeMessage = () => {
        var _a, _b, _c;
        if (trade.status === "DISPUTE_OPEN") {
            return (<div className="w-full">
          {((_a = trade.p2pDisputes[0]) === null || _a === void 0 ? void 0 : _a.status) === "PENDING" && (<div className="px-5 pb-5">
              <Alert_1.default color="warning" className="w-full text-sm">
                {t("Trade is in dispute, please wait until it is reviewed.")}
              </Alert_1.default>
            </div>)}
          {((_b = trade.p2pDisputes[0]) === null || _b === void 0 ? void 0 : _b.status) === "IN_PROGRESS" && (<div className="px-5 pb-5">
              <Alert_1.default color="warning" className="w-full text-sm">
                {(_c = trade.p2pDisputes[0]) === null || _c === void 0 ? void 0 : _c.resolution}
              </Alert_1.default>
            </div>)}
        </div>);
        }
    };
    const renderButtons = () => {
        var _a, _b;
        const buttons = [];
        if (["DISPUTE_OPEN"].includes(trade === null || trade === void 0 ? void 0 : trade.status) &&
            ["PENDING", "IN_PROGRESS"].includes((_a = trade.p2pDisputes[0]) === null || _a === void 0 ? void 0 : _a.status)) {
            buttons.push(<div className="w-full">
          <Button_1.default key="resolve-dispute" color="success" variant="solid" className="w-full" onClick={() => { var _a; return adminResolveDispute((_a = trade.p2pDisputes[0]) === null || _a === void 0 ? void 0 : _a.resolution); }}>
            {((_b = trade.p2pDisputes[0]) === null || _b === void 0 ? void 0 : _b.resolution)
                    ? "Edit Resolution"
                    : "Resolve Dispute"}
          </Button_1.default>
        </div>);
            buttons.push(<div className="w-full">
          <Button_1.default key="close-dispute" color="success" variant="solid" className="w-full" onClick={() => adminCloseDispute()}>
            {t("Close Dispute")}
          </Button_1.default>
        </div>);
        }
        if (["PENDING", "PAID", "DISPUTE_OPEN"].includes(trade === null || trade === void 0 ? void 0 : trade.status)) {
            buttons.push(<div className="w-full">
          <Button_1.default key="cancel-trade" color="danger" variant="solid" className="w-full" onClick={() => adminCancelTrade()}>
            {t("Cancel Trade")}
          </Button_1.default>
        </div>);
        }
        if (["DISPUTE_OPEN", "PAID"].includes(trade === null || trade === void 0 ? void 0 : trade.status)) {
            buttons.push(<div className="w-full">
          <Button_1.default key="release-trade" color="success" variant="solid" className="w-full" onClick={() => adminCompleteTrade()}>
            {t("Complete Trade")}
          </Button_1.default>
        </div>);
        }
        return buttons;
    };
    const hasButtons = renderButtons().length > 0;
    return (<Default_1.default title={t("Trade Details")} color="muted" horizontal={true}>
      <div className="pt-20 pe-4">
        <page_header_1.PageHeader title={`Trade #${trade.id}`} BackPath="/admin/ext/p2p/trade"/>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 ltablet:grid-cols-12 mt-4">
          <div className="order-last md:order-1 col-span-1 lg:col-span-8 ltablet:col-span-8">
            <Chat_1.Chat messages={trade.messages || []} handleFileUpload={handleFileUpload} messageSide={messageSide} user1={profile} user2={trade.seller || trade.user} reply={replyToTrade} isReplying={isReplying} canReply={!["CANCELLED", "COMPLETED", "REFUNDED"].includes(trade.status)}/>
          </div>
          <div className="col-span-1 lg:col-span-4 ltablet:col-span-4">
            <div className="relative">
              <Card_1.default shape="smooth" color="contrast">
                <TradeInfo_1.TradeInfo />
                {renderDisputeMessage()}
                {trade.status !== "CLOSED" && hasButtons && (<div className="border-t-2 border-dashed border-muted-200 p-6 dark:border-muted-800">
                    <div className="flex flex-col items-center justify-center gap-2">
                      {renderButtons()}
                    </div>
                  </div>)}
              </Card_1.default>
            </div>
          </div>
        </div>
      </div>

      {/* admin modals */}
      <Modal_1.default open={isCancelDisputeOpen} size="sm">
        <Card_1.default shape="smooth">
          <div className="flex items-center justify-between p-4 md:p-6">
            <p className="font-sans text-lg font-medium text-muted-900 dark:text-white">
              {t("Resolve Dispute")}
            </p>
            <IconButton_1.default size="sm" shape="full" onClick={() => setIsResolvingDispute(false)}>
              <react_2.Icon icon="lucide:x" className="h-4 w-4"/>
            </IconButton_1.default>
          </div>
          <div className="p-4 md:p-6">
            <span className="text-muted-400 dark:text-muted-600">
              {t("Please enter the resolution for the dispute.")}
            </span>
            <Textarea_1.default value={disputeReason} onChange={(e) => setDisputeReason(e.target.value)} shape="curved" placeholder={t("Resolution")} label={t("Resolution")}/>
          </div>
          <div className="p-4 md:p-6">
            <div className="flex gap-x-2 justify-end">
              <Button_1.default color="warning" onClick={async () => {
            await adminResolveDispute(disputeReason);
            setIsResolvingDispute(false);
            setDisputeReason("");
        }}>
                {t("Submit")}
              </Button_1.default>
            </div>
          </div>
        </Card_1.default>
      </Modal_1.default>

      {/* cancel dispute */}
      <Modal_1.default open={isCancellingOpen} size="sm">
        <Card_1.default shape="smooth">
          <div className="flex items-center justify-between p-4 md:p-6">
            <p className="font-sans text-lg font-medium text-muted-900 dark:text-white">
              {t("Cancel Dispute")}
            </p>
            <IconButton_1.default size="sm" shape="full" onClick={() => setIsCancelDisputeOpen(false)}>
              <react_2.Icon icon="lucide:x" className="h-4 w-4"/>
            </IconButton_1.default>
          </div>
          <div className="p-4 md:p-6">
            <span className="text-muted-400 dark:text-muted-600">
              {t("Are you sure you want to cancel the dispute")}
            </span>
          </div>
          <div className="p-4 md:p-6">
            <div className="flex gap-x-2 justify-end">
              <Button_1.default color="warning" onClick={async () => {
            await adminCancelTrade();
            setIsCancelDisputeOpen(false);
        }}>
                {t("Confirm")}
              </Button_1.default>
            </div>
          </div>
        </Card_1.default>
      </Modal_1.default>

      <Modal_1.default open={isCompletingOpen} size="sm">
        <Card_1.default shape="smooth">
          <div className="flex items-center justify-between p-4 md:p-6">
            <p className="font-sans text-lg font-medium text-muted-900 dark:text-white">
              {t("Complete Trade")}
            </p>
            <IconButton_1.default size="sm" shape="full" onClick={() => setIsCompletingOpen(false)}>
              <react_2.Icon icon="lucide:x" className="h-4 w-4"/>
            </IconButton_1.default>
          </div>
          <div className="p-4 md:p-6">
            <span className="text-muted-400 dark:text-muted-600">
              {t("Are you sure you want to release the trade")}
            </span>
          </div>
          <div className="p-4 md:p-6">
            <div className="flex gap-x-2 justify-end">
              <Button_1.default color="warning" onClick={async () => {
            await adminCompleteTrade();
            setIsCompletingOpen(false);
        }}>
                {t("Confirm")}
              </Button_1.default>
            </div>
          </div>
        </Card_1.default>
      </Modal_1.default>

      <Modal_1.default open={isResolvingDispute} size="sm">
        <Card_1.default shape="smooth">
          <div className="flex items-center justify-between p-4 md:p-6">
            <p className="font-sans text-lg font-medium text-muted-900 dark:text-white">
              {t("Cancel Trade")}
            </p>
            <IconButton_1.default size="sm" shape="full" onClick={() => setIsCancellingOpen(false)}>
              <react_2.Icon icon="lucide:x" className="h-4 w-4"/>
            </IconButton_1.default>
          </div>
          <div className="p-4 md:p-6">
            <span className="text-muted-400 dark:text-muted-600">
              {t("Are you sure you want to cancel the trade")}
            </span>
          </div>
          <div className="p-4 md:p-6">
            <div className="flex gap-x-2 justify-end">
              <Button_1.default color="warning" onClick={async () => {
            await adminCancelTrade();
            setIsCancellingOpen(false);
        }}>
                {t("Confirm")}
              </Button_1.default>
            </div>
          </div>
        </Card_1.default>
      </Modal_1.default>
    </Default_1.default>);
};
exports.default = TradeDetails;
exports.permission = "Access P2P Trade Management";
