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
const Avatar_1 = __importDefault(require("@/components/elements/base/avatar/Avatar"));
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const ButtonLink_1 = __importDefault(require("@/components/elements/base/button-link/ButtonLink"));
const Card_1 = __importDefault(require("@/components/elements/base/card/Card"));
const Tag_1 = __importDefault(require("@/components/elements/base/tag/Tag"));
const Table_1 = __importDefault(require("@/components/elements/base/table/Table"));
const TH_1 = __importDefault(require("@/components/elements/base/table/TH"));
const TD_1 = __importDefault(require("@/components/elements/base/table/TD"));
const Pagination_1 = __importDefault(require("@/components/elements/base/pagination/Pagination"));
const Select_1 = __importDefault(require("@/components/elements/form/select/Select"));
const api_1 = __importDefault(require("@/utils/api"));
const date_fns_1 = require("date-fns");
const next_i18next_1 = require("next-i18next");
const TicketsTable = ({ title = "Recent Tickets" }) => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const [items, setItems] = (0, react_1.useState)([]);
    const [pagination, setPagination] = (0, react_1.useState)({
        totalItems: 0,
        currentPage: 1,
        perPage: 10,
        totalPages: 0,
    });
    // Function to fetch tickets
    const fetchTickets = async () => {
        try {
            const { data, error } = await (0, api_1.default)({
                url: "/api/user/support/ticket",
                silent: true,
            });
            if (!error) {
                setItems(data.items);
                setPagination(data.pagination);
            }
            else {
                console.error("Failed to fetch tickets:", error);
            }
        }
        catch (error) {
            console.error("Error fetching tickets:", error);
        }
    };
    // Use effect to fetch tickets on component mount
    (0, react_1.useEffect)(() => {
        fetchTickets();
    }, []);
    const tagStatusMap = {
        OPEN: "primary",
        CLOSED: "muted",
        PENDING: "warning",
        REPLIED: "info",
    };
    const importanceStatusMap = (importance, status) => {
        if (status === "CLOSED")
            return "bg-muted-200 dark:bg-muted-800";
        if (importance === "LOW" && ["OPEN", "PENDING", "REPLIED"].includes(status))
            return "bg-success-500";
        if (importance === "MEDIUM" &&
            ["OPEN", "PENDING", "REPLIED"].includes(status))
            return "bg-yellow-400";
        if (importance === "HIGH" &&
            ["OPEN", "PENDING", "REPLIED"].includes(status))
            return "bg-danger-500";
        return "";
    };
    return (<div className="w-full">
      <Card_1.default shape="smooth" color="contrast" className="overflow-x-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="font-sans text-base font-medium leading-tight tracking-wider text-muted-800 dark:text-white">
            {title}
          </h3>
          <div className="flex">
            <Button_1.default color="primary" size="sm" className="h-9! min-w-[64px]! rounded-e-none!">
              {t("All")}
            </Button_1.default>
            <Button_1.default size="sm" className="h-9! min-w-[64px]! rounded-s-none!">
              {t("Open")}
            </Button_1.default>
          </div>
        </div>
        <Table_1.default className="font-sans">
          <thead>
            <tr>
              <TH_1.default>{t("Title")}</TH_1.default>
              <TH_1.default>{t("Status")}</TH_1.default>
              <TH_1.default>{t("Priority")}</TH_1.default>
              <TH_1.default className="min-w-[180px]">{t("Customer")}</TH_1.default>
              <TH_1.default>{t("Date")}</TH_1.default>
              <TH_1.default className="ltablet:hidden">{t("Assignees")}</TH_1.default>
              <TH_1.default>{t("Action")}</TH_1.default>
            </tr>
          </thead>
          <tbody>
            {items.map((ticket, index) => {
            var _a, _b, _c, _d, _e, _f;
            return (<tr key={index} className="transition-colors duration-300 hover:bg-muted-50 dark:hover:bg-muted-900">
                <TD_1.default className="text-sm font-medium text-muted-800 dark:text-muted-100">
                  <span className="line-clamp-1">{ticket.subject}</span>
                </TD_1.default>
                <TD_1.default className="text-sm font-medium text-muted-500 dark:text-muted-400">
                  <Tag_1.default color={tagStatusMap[ticket.status] || "default"} variant={"pastel"}>
                    {ticket.status}
                  </Tag_1.default>
                </TD_1.default>
                <TD_1.default className="text-sm font-medium text-muted-500 dark:text-muted-400">
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full
                      ${importanceStatusMap(ticket.importance, ticket.status)}
                    `}></div>
                    <span className="font-sans text-sm text-muted-500 dark:text-muted-400">
                      {ticket.importance}
                    </span>
                  </div>
                </TD_1.default>
                <TD_1.default className="text-sm font-medium text-muted-800 dark:text-muted-100">
                  <div className="flex items-center gap-2">
                    <Avatar_1.default src={((_a = ticket.user) === null || _a === void 0 ? void 0 : _a.avatar) || "/img/avatars/placeholder.webp"} size="xxs"/>
                    <div className="font-sans">
                      <p className="leading-none text-sm text-muted-800 dark:text-muted-100">
                        {(_b = ticket.user) === null || _b === void 0 ? void 0 : _b.firstName} {(_c = ticket.user) === null || _c === void 0 ? void 0 : _c.lastName}
                      </p>
                      <span className="block text-xs text-muted-400">
                        {(_d = ticket.user) === null || _d === void 0 ? void 0 : _d.email}
                      </span>
                    </div>
                  </div>
                </TD_1.default>
                <TD_1.default className="text-xs font-medium text-muted-500 dark:text-muted-400">
                  {(0, date_fns_1.formatDate)(new Date(ticket.createdAt), "MMM dd, yyyy")}
                </TD_1.default>
                <TD_1.default className="ltablet:hidden">
                  <div className="flex items-center">
                    <Avatar_1.default size="xxs" overlaps src={((_f = (_e = ticket.chat) === null || _e === void 0 ? void 0 : _e.agent) === null || _f === void 0 ? void 0 : _f.avatar) ||
                    "/img/avatars/placeholder.webp"} alt="product image"/>
                  </div>
                </TD_1.default>
                <TD_1.default className="text-sm font-medium text-muted-500 dark:text-muted-400">
                  <ButtonLink_1.default href="#" size="sm">
                    {t("Details")}
                  </ButtonLink_1.default>
                </TD_1.default>
              </tr>);
        })}
          </tbody>
        </Table_1.default>
      </Card_1.default>
      <div className="mt-4 flex items-center justify-between gap-6">
        <div className="max-w-[180px]">
          <Select_1.default color="contrast" name="pageSize" value={pagination.perPage} options={[
            {
                value: "5",
                label: "5 per page",
            },
            {
                value: "10",
                label: "10 per page",
            },
            {
                value: "15",
                label: "15 per page",
            },
            {
                value: "20",
                label: "20 per page",
            },
        ]} onChange={(e) => {
            const pageSize = parseInt(e.target.value);
            setPagination({ ...pagination, perPage: pageSize });
        }}/>
        </div>
        <div>
          <Pagination_1.default buttonSize="sm" currentPage={pagination.currentPage} totalCount={pagination.totalItems} pageSize={pagination.perPage} onPageChange={(page) => {
            setPagination({ ...pagination, currentPage: page });
        }}/>
        </div>
      </div>
    </div>);
};
exports.default = TicketsTable;
