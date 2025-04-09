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
const ListWidgetItem_1 = __importDefault(require("@/components/widgets/ListWidgetItem"));
const router_1 = require("next/router");
const page_header_1 = require("@/components/elements/base/page-header");
const Popover_1 = require("@/components/elements/addons/popover/Popover");
const TicketInformation_1 = require("@/components/pages/user/support/TicketInformation");
const support_1 = __importDefault(require("@/stores/user/support"));
const Chat_1 = require("@/components/pages/user/Chat");
const dashboard_1 = require("@/stores/dashboard");
const next_i18next_1 = require("next-i18next");
const TicketDetails = () => {
    var _a, _b, _c;
    const { t } = (0, next_i18next_1.useTranslation)();
    const { profile } = (0, dashboard_1.useDashboardStore)();
    const { ticket, initializeWebSocket, disconnectWebSocket, fetchTicket, resolveTicket, setIsSupport, replyToTicket, handleFileUpload, isReplying, } = (0, support_1.default)();
    const router = (0, router_1.useRouter)();
    const { id } = router.query;
    (0, react_1.useEffect)(() => {
        if (router.isReady) {
            setIsSupport(false);
            fetchTicket(id);
            initializeWebSocket(id);
            return () => {
                disconnectWebSocket();
            };
        }
    }, [router.isReady]);
    const messageSide = (userId) => {
        return userId === (profile === null || profile === void 0 ? void 0 : profile.id) ? "right" : "left";
    };
    return (<Default_1.default title={t("Ticket Details")} color="muted">
      <page_header_1.PageHeader title={(ticket === null || ticket === void 0 ? void 0 : ticket.subject) || "Loading..."} BackPath="/user/support/ticket"/>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 ltablet:grid-cols-12 mt-4">
        <div className="order-last md:order-1 col-span-1 lg:col-span-8 ltablet:col-span-8">
          <Chat_1.Chat messages={(ticket === null || ticket === void 0 ? void 0 : ticket.messages) || []} handleFileUpload={handleFileUpload} messageSide={messageSide} user1={ticket === null || ticket === void 0 ? void 0 : ticket.user} user2={ticket === null || ticket === void 0 ? void 0 : ticket.agent} reply={replyToTicket} isReplying={isReplying} canReply={(ticket === null || ticket === void 0 ? void 0 : ticket.status) !== "CLOSED"}/>
        </div>
        <div className="col-span-1 lg:col-span-4 ltablet:col-span-4">
          <div className="relative">
            <Card_1.default shape="smooth" color="contrast">
              <TicketInformation_1.TicketInformation />
              <div className="p-6 ">
                <h4 className="mb-4 font-sans text-xs font-medium uppercase text-muted-500">
                  {t("Supported by")}
                </h4>

                <ul className="inner-list">
                  <li>
                    <ListWidgetItem_1.default href="#" avatarSize="xxs" avatar={((_a = ticket === null || ticket === void 0 ? void 0 : ticket.agent) === null || _a === void 0 ? void 0 : _a.avatar) || "/img/avatars/placeholder.webp"} title={(ticket === null || ticket === void 0 ? void 0 : ticket.agent)
            ? `${(_b = ticket === null || ticket === void 0 ? void 0 : ticket.agent) === null || _b === void 0 ? void 0 : _b.firstName} ${(_c = ticket === null || ticket === void 0 ? void 0 : ticket.agent) === null || _c === void 0 ? void 0 : _c.lastName}`
            : "No agent assigned"} text="Support Agent" itemAction={<></>}/>
                  </li>
                </ul>
              </div>
              {(ticket === null || ticket === void 0 ? void 0 : ticket.status) !== "CLOSED" && (ticket === null || ticket === void 0 ? void 0 : ticket.type) !== "LIVE" && (<div className="border-t-2 border-dashed border-muted-200 p-6 dark:border-muted-800">
                  <div className="flex flex-col items-center justify-center gap-2 sm:flex-row">
                    <Popover_1.Popover placement="top">
                      <Popover_1.PopoverTrigger>
                        <Button_1.default color="danger" variant="solid" className="w-full">
                          {t("Close Ticket")}
                        </Button_1.default>
                      </Popover_1.PopoverTrigger>
                      <Popover_1.PopoverContent className="relative z-50 flex w-72 gap-2 rounded-lg border border-muted-200 bg-white p-4 shadow-xl shadow-muted-300/30 dark:border-muted-700 dark:bg-muted-800 dark:shadow-muted-800/20">
                        <div className="flex flex-col gap-2 w-full">
                          <h4 className="font-sans text-xs font-medium uppercase text-muted-500">
                            {(ticket === null || ticket === void 0 ? void 0 : ticket.status) === "OPEN"
                ? "Close Ticket"
                : "Reopen Ticket"}
                          </h4>
                          <p className="text-xs text-muted-400">
                            {(ticket === null || ticket === void 0 ? void 0 : ticket.status) === "OPEN"
                ? "Are you sure you want to close this ticket?"
                : "Are you sure you want to reopen this ticket?"}
                          </p>
                          <div className="flex gap-2">
                            <Popover_1.PopoverContentClose>
                              <Button_1.default color="success" variant="solid" className="w-full" onClick={() => resolveTicket(id, "CLOSED")}>
                                {t("Confirm")}
                              </Button_1.default>
                            </Popover_1.PopoverContentClose>
                          </div>
                        </div>
                      </Popover_1.PopoverContent>
                    </Popover_1.Popover>
                  </div>
                </div>)}
            </Card_1.default>
          </div>
        </div>
      </div>
    </Default_1.default>);
};
exports.default = TicketDetails;
