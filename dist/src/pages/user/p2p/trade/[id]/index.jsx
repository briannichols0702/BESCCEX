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
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const Card_1 = __importDefault(require("@/components/elements/base/card/Card"));
const router_1 = require("next/router");
const page_header_1 = require("@/components/elements/base/page-header");
const trade_1 = __importDefault(require("@/stores/user/p2p/trade"));
const Chat_1 = require("@/components/pages/user/Chat");
const TradeInfo_1 = require("@/components/pages/user/p2p/TradeInfo");
const Modal_1 = __importDefault(require("@/components/elements/base/modal/Modal"));
const Input_1 = __importDefault(require("@/components/elements/form/input/Input"));
const Textarea_1 = __importDefault(require("@/components/elements/form/textarea/Textarea"));
const dashboard_1 = require("@/stores/dashboard");
const IconButton_1 = __importDefault(require("@/components/elements/base/button-icon/IconButton"));
const react_2 = require("@iconify/react");
const Alert_1 = __importDefault(require("@/components/elements/base/alert/Alert"));
const next_i18next_1 = require("next-i18next");
const Avatar_1 = __importDefault(require("@/components/elements/base/avatar/Avatar"));
const TradeDetails = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const { profile } = (0, dashboard_1.useDashboardStore)();
    const { trade, initializeWebSocket, disconnectWebSocket, setIsSeller, isSeller, handleFileUpload, isReplying, replyToTrade, fetchTrade, cancelTrade, markAsPaidTrade, disputeTrade, cancelDisputeTrade, releaseTrade, refundTrade, submitReview, reviewRating, setReviewRating, hoverRating, setHoverRating, comment, setComment, } = (0, trade_1.default)();
    const [isCancellingOpen, setIsCancellingOpen] = (0, react_1.useState)(false);
    const [isPayingOpen, setIsPayingOpen] = (0, react_1.useState)(false);
    const [isDisputingOpen, setIsDisputingOpen] = (0, react_1.useState)(false);
    const [isCancelDisputeOpen, setIsCancelDisputeOpen] = (0, react_1.useState)(false);
    const [isReleasingOpen, setIsReleasingOpen] = (0, react_1.useState)(false);
    const [isRefundingOpen, setIsRefundingOpen] = (0, react_1.useState)(false);
    const [txHash, setTxHash] = (0, react_1.useState)("");
    const [hasReviewed, setHasReviewed] = (0, react_1.useState)(false);
    const [isReviewingOpen, setIsReviewingOpen] = (0, react_1.useState)(false);
    const [disputeReason, setDisputeReason] = (0, react_1.useState)("");
    const [isSubmitting, setIsSubmitting] = (0, react_1.useState)(false);
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
    (0, react_1.useEffect)(() => {
        if (!trade)
            return;
        setIsSeller(trade.seller.id === (profile === null || profile === void 0 ? void 0 : profile.id));
        setHasReviewed(trade.offer.p2pReviews.some((review) => review.reviewer.id === (profile === null || profile === void 0 ? void 0 : profile.id)));
    }, [trade]);
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
        var _a, _b, _c;
        const buttons = [];
        if (trade.status === "PENDING") {
            buttons.push(<div key="cancel-trade" className="w-full">
          <Button_1.default color="danger" variant="solid" className="w-full" onClick={() => setIsCancellingOpen(true)}>
            {t("Cancel Trade")}
          </Button_1.default>
        </div>);
            if (!isSeller) {
                buttons.push(<div key="pay-trade" className="w-full">
            <Button_1.default color="success" variant="solid" className="w-full" onClick={() => setIsPayingOpen(true)}>
              {t("Submit Transaction ID")}
            </Button_1.default>
          </div>);
            }
        }
        if (trade.status === "PAID" && !trade.p2pDisputes.length) {
            buttons.push(<div key="dispute-trade" className="w-full">
          <Button_1.default color="warning" variant="solid" className="w-full" onClick={() => setIsDisputingOpen(true)}>
            {t("Dispute Trade")}
          </Button_1.default>
        </div>);
        }
        if (trade.status === "DISPUTE_OPEN" &&
            ((_a = trade.p2pDisputes[0]) === null || _a === void 0 ? void 0 : _a.status) === "PENDING" &&
            ((_c = (_b = trade.p2pDisputes[0]) === null || _b === void 0 ? void 0 : _b.raisedBy) === null || _c === void 0 ? void 0 : _c.id) === (profile === null || profile === void 0 ? void 0 : profile.id)) {
            buttons.push(<div key="cancel-dispute" className="w-full">
          <Button_1.default color="warning" variant="solid" className="w-full" onClick={() => setIsCancelDisputeOpen(true)}>
            {t("Cancel Dispute")}
          </Button_1.default>
        </div>);
        }
        if (isSeller && ["DISPUTE_OPEN", "PAID"].includes(trade.status)) {
            buttons.push(<div key="release-trade" className="w-full">
          <Button_1.default color="primary" variant="solid" className="w-full" onClick={() => setIsReleasingOpen(true)}>
            {t("Release Trade")}
          </Button_1.default>
        </div>);
        }
        if (!isSeller && ["COMPLETED"].includes(trade.status) && !hasReviewed) {
            buttons.push(<div key="review-offer" className="w-full">
          <Button_1.default color="warning" variant="solid" className="w-full" onClick={() => setIsReviewingOpen(true)}>
            {t("Review Offer")}
          </Button_1.default>
        </div>);
        }
        return buttons;
    };
    const hasButtons = renderButtons().length > 0;
    const ClientInfoCard = () => {
        const client = isSeller ? trade.user : trade.seller;
        const role = isSeller ? t("Buyer") : t("Seller");
        const { offer } = trade;
        // Calculate average rating
        const averageRating = offer.p2pReviews.length > 0
            ? (offer.p2pReviews.reduce((acc, review) => acc + review.rating, 0) /
                offer.p2pReviews.length).toFixed(1)
            : t("No Ratings");
        const totalReviews = offer.p2pReviews.length;
        return (<Card_1.default className="p-6 my-5">
        <div className="flex items-start gap-4">
          {/* Client Info */}
          <Avatar_1.default src={client.avatar || "/img/placeholder.svg"} size="lg" className="rounded-full"/>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-muted-900 dark:text-muted-100">
              {client.firstName} {client.lastName}
            </h2>
            <p className="text-sm text-muted-500 dark:text-muted-400">{role}</p>
            <p className="text-sm text-muted-500 dark:text-muted-400">
              {t("Email")}: {client.email}
            </p>
          </div>
          {!isSeller && (<>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <span className="block text-sm text-muted-500 dark:text-muted-400">
                    {t("Average Rating")}
                  </span>
                  <span className="block text-sm text-muted-900 dark:text-muted-100">
                    {averageRating}
                  </span>
                </div>
                <div>
                  <span className="block text-sm text-muted-500 dark:text-muted-400">
                    {t("Total Reviews")}
                  </span>
                  <span className="block text-sm text-muted-900 dark:text-muted-100">
                    {totalReviews}
                  </span>
                </div>
              </div>
            </>)}
        </div>
      </Card_1.default>);
    };
    return (<Default_1.default title={t("Trade Details")} color="muted">
      <page_header_1.PageHeader title={`Trade #${trade.id}`} BackPath="/user/p2p/trade"/>
      <ClientInfoCard />
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 ltablet:grid-cols-12 mt-4">
        <div className="order-last md:order-1 col-span-1 lg:col-span-8 ltablet:col-span-8">
          <Chat_1.Chat messages={trade.messages || []} handleFileUpload={handleFileUpload} messageSide={messageSide} user1={trade.user} user2={trade.seller} reply={replyToTrade} isReplying={isReplying} canReply={!["CANCELLED", "COMPLETED", "REFUNDED"].includes(trade.status)}/>
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

      {/* Modals */}
      <Modal_1.default open={isCancellingOpen} size="sm">
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
            <p className="text-sm text-muted-500 dark:text-muted-400">
              {t("Are you sure you want to cancel the trade? This action cannot be undone.")}
            </p>
          </div>
          <div className="p-4 md:p-6">
            <div className="flex gap-x-2 justify-end">
              <Button_1.default color="danger" onClick={async () => {
            await cancelTrade();
            setIsCancellingOpen(false);
        }}>
                {t("Submit")}
              </Button_1.default>
            </div>
          </div>
        </Card_1.default>
      </Modal_1.default>

      <Modal_1.default open={isPayingOpen} size="sm">
        <Card_1.default shape="smooth">
          <div className="flex items-center justify-between p-4 md:p-6">
            <p className="font-sans text-lg font-medium text-muted-900 dark:text-white">
              {t("Send Payment Transaction ID")}
            </p>
            <IconButton_1.default size="sm" shape="full" onClick={() => setIsPayingOpen(false)}>
              <react_2.Icon icon="lucide:x" className="h-4 w-4"/>
            </IconButton_1.default>
          </div>
          <div className="p-4 md:p-6">
            <p className="text-muted-400 dark:text-muted-600 text-sm mb-4">
              {t("Please enter the transaction id of the payment, so the seller can verify it.")}
            </p>
            <Input_1.default value={txHash} onChange={(e) => setTxHash(e.target.value)} shape="curved" placeholder={t("Transaction Hash")} label={t("Transaction Hash")}/>
          </div>
          <div className="p-4 md:p-6">
            <div className="flex gap-x-2 justify-end">
              <Button_1.default color="success" onClick={async () => {
            await markAsPaidTrade(txHash);
            setIsPayingOpen(false);
            setTxHash("");
        }}>
                {t("Submit")}
              </Button_1.default>
            </div>
          </div>
        </Card_1.default>
      </Modal_1.default>

      <Modal_1.default open={isDisputingOpen} size="sm">
        <Card_1.default shape="smooth">
          <div className="flex items-center justify-between p-4 md:p-6">
            <p className="font-sans text-lg font-medium text-muted-900 dark:text-white">
              {t("Dispute Trade")}
            </p>
            <IconButton_1.default size="sm" shape="full" onClick={() => setIsDisputingOpen(false)}>
              <react_2.Icon icon="lucide:x" className="h-4 w-4"/>
            </IconButton_1.default>
          </div>
          <div className="p-4 md:p-6">
            <span className="text-muted-400 dark:text-muted-600">
              {t("Please enter the reason for the dispute, we will review it and get back to you.")}
            </span>
            <Textarea_1.default value={disputeReason} onChange={(e) => setDisputeReason(e.target.value)} shape="curved" placeholder={t("Reason")} label={t("Reason")}/>
          </div>
          <div className="p-4 md:p-6">
            <div className="flex gap-x-2 justify-end">
              <Button_1.default color="warning" onClick={async () => {
            await disputeTrade(disputeReason);
            setIsDisputingOpen(false);
            setDisputeReason("");
        }}>
                {t("Submit")}
              </Button_1.default>
            </div>
          </div>
        </Card_1.default>
      </Modal_1.default>

      <Modal_1.default open={isCancelDisputeOpen} size="sm">
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
            <p className="text-sm text-muted-500 dark:text-muted-400">
              {t("Are you sure you want to cancel the dispute? This action cannot be undone, and you will not be able to open a dispute again.")}
            </p>
          </div>
          <div className="p-4 md:p-6">
            <div className="flex gap-x-2 justify-end">
              <Button_1.default color="primary" onClick={async () => {
            await cancelDisputeTrade();
            setIsCancelDisputeOpen(false);
        }}>
                {t("Close Dispute")}
              </Button_1.default>
            </div>
          </div>
        </Card_1.default>
      </Modal_1.default>

      <Modal_1.default open={isReleasingOpen} size="sm">
        <Card_1.default shape="smooth">
          <div className="flex items-center justify-between p-4 md:p-6">
            <p className="font-sans text-lg font-medium text-muted-900 dark:text-white">
              {t("Release Funds")}
            </p>

            <IconButton_1.default size="sm" shape="full" onClick={() => setIsReleasingOpen(false)}>
              <react_2.Icon icon="lucide:x" className="h-4 w-4"/>
            </IconButton_1.default>
          </div>
          <div className="p-4 md:p-6">
            <p className="text-sm text-muted-500 dark:text-muted-400">
              {t("Are you sure you want to release the funds? This action cannot be undone.")}
            </p>
          </div>
          <div className="p-4 md:p-6">
            <div className="flex gap-x-2 justify-end">
              <Button_1.default color="primary" onClick={async () => {
            await releaseTrade();
            setIsReleasingOpen(false);
        }}>
                {t("Submit")}
              </Button_1.default>
            </div>
          </div>
        </Card_1.default>
      </Modal_1.default>

      <Modal_1.default open={isRefundingOpen} size="sm">
        <Card_1.default shape="smooth">
          <div className="flex items-center justify-between p-4 md:p-6">
            <p className="font-sans text-lg font-medium text-muted-900 dark:text-white">
              {t("Refund Funds")}
            </p>

            <IconButton_1.default size="sm" shape="full" onClick={() => setIsRefundingOpen(false)}>
              <react_2.Icon icon="lucide:x" className="h-4 w-4"/>
            </IconButton_1.default>
          </div>
          <div className="p-4 md:p-6">
            <p className="text-sm text-muted-500 dark:text-muted-400">
              {t("Are you sure you want to refund the funds? This action cannot be undone.")}
            </p>
          </div>
          <div className="p-4 md:p-6">
            <div className="flex gap-x-2 justify-end">
              <Button_1.default color="primary" onClick={async () => {
            await refundTrade();
            setIsRefundingOpen(false);
        }}>
                {t("Submit")}
              </Button_1.default>
            </div>
          </div>
        </Card_1.default>
      </Modal_1.default>

      <Modal_1.default open={isReviewingOpen} size="sm">
        <Card_1.default shape="smooth">
          <div className="flex items-center justify-between p-4 md:p-6">
            <p className="font-sans text-lg font-medium text-muted-900 dark:text-white">
              {t("Review Offer")}
            </p>

            <IconButton_1.default size="sm" shape="full" onClick={() => setIsReviewingOpen(false)}>
              <react_2.Icon icon="lucide:x" className="h-4 w-4"/>
            </IconButton_1.default>
          </div>
          <div className="p-4 md:p-6">
            <p className="text-sm text-muted-500 dark:text-muted-400">
              {t("Please leave a review for the offer.")}
            </p>

            <div className="flex gap-2">
              {Array.from({ length: 5 }, (_, i) => (<react_2.Icon key={i} // Add key here
         icon="uim:star" className={`w-5 h-5 ${i < (hoverRating || reviewRating)
                ? "text-yellow-400"
                : "text-gray-300"}`} onMouseOver={() => setHoverRating(i + 1)} onMouseLeave={() => setHoverRating(0)} onClick={() => setReviewRating(i + 1)}/>))}
            </div>
            <div className="space-y-5">
              <Textarea_1.default label={t("Message")} placeholder={t("Write your message...")} name="comment" value={comment} onChange={(e) => setComment(e.target.value)}/>
            </div>
          </div>
          <div className="p-4 md:p-6">
            <div className="flex gap-x-2 justify-end">
              <Button_1.default color="primary" onClick={async () => {
            setIsSubmitting(true);
            submitReview();
            setIsReviewingOpen(false);
            setIsSubmitting(false);
        }} loading={isSubmitting} disabled={isSubmitting}>
                {t("Submit")}
              </Button_1.default>
            </div>
          </div>
        </Card_1.default>
      </Modal_1.default>
    </Default_1.default>);
};
exports.default = TradeDetails;
