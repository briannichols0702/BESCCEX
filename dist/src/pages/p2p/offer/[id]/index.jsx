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
const router_1 = require("next/router");
const api_1 = __importDefault(require("@/utils/api"));
const lodash_1 = require("lodash");
const MashImage_1 = require("@/components/elements/MashImage");
const react_2 = require("@iconify/react");
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const DealCard_1 = require("@/components/pages/p2p/DealCard");
const infoBlock_1 = __importDefault(require("@/components/elements/base/infoBlock"));
const Card_1 = __importDefault(require("@/components/elements/base/card/Card"));
const date_fns_1 = require("date-fns");
const Avatar_1 = __importDefault(require("@/components/elements/base/avatar/Avatar"));
const BackButton_1 = require("@/components/elements/base/button/BackButton");
const Modal_1 = __importDefault(require("@/components/elements/base/modal/Modal"));
const IconButton_1 = __importDefault(require("@/components/elements/base/button-icon/IconButton"));
const Input_1 = __importDefault(require("@/components/elements/form/input/Input"));
const wallet_1 = require("@/stores/user/wallet");
const dashboard_1 = require("@/stores/dashboard");
const next_i18next_1 = require("next-i18next");
const P2pOffer = () => {
    var _a, _b, _c;
    const { t } = (0, next_i18next_1.useTranslation)();
    const { profile } = (0, dashboard_1.useDashboardStore)();
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const { wallet, fetchWallet } = (0, wallet_1.useWalletStore)();
    const [open, setOpen] = (0, react_1.useState)(false);
    const [amount, setAmount] = (0, react_1.useState)(0);
    const [offer, setOffer] = (0, react_1.useState)(null);
    const router = (0, router_1.useRouter)();
    const { id } = router.query;
    const fetchOffer = async () => {
        setIsLoading(true);
        const { data, error } = await (0, api_1.default)({
            url: `/api/ext/p2p/offer/${id}`,
            silent: true,
        });
        if (!error) {
            setOffer(data);
        }
        setIsLoading(false);
    };
    const debounceFetchOffer = (0, lodash_1.debounce)(fetchOffer, 100);
    (0, react_1.useEffect)(() => {
        if (router.isReady && id) {
            debounceFetchOffer();
        }
    }, [router.isReady, id]);
    (0, react_1.useEffect)(() => {
        if (offer && !wallet) {
            fetchWallet(offer.paymentMethod.walletType, offer.paymentMethod.currency);
        }
    }, [offer, wallet]);
    const offerProgress = (0, react_1.useMemo)(() => {
        if (!offer)
            return 0;
        return Number((offer.inOrder / offer.amount) * 100).toFixed(2);
    }, [offer]);
    const trade = async () => {
        setIsLoading(true);
        if (offer) {
            const { data, error } = await (0, api_1.default)({
                url: `/api/ext/p2p/trade`,
                method: "POST",
                body: {
                    offerId: offer.id,
                    amount,
                },
            });
            if (!error) {
                router.push(`/user/p2p/trade/${data.id}`);
            }
        }
        setIsLoading(false);
    };
    return (<Default_1.default title={t("P2P Offer")} color="muted">
      <main className="p-6">
        <div className="mb-6 flex w-full flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="contact flex w-full flex-row items-center justify-center gap-3 sm:justify-start">
            <div className="relative">
              <Avatar_1.default size="md" src={`/img/crypto/${offer === null || offer === void 0 ? void 0 : offer.currency.toLowerCase()}.webp`}/>
              {(offer === null || offer === void 0 ? void 0 : offer.chain) && (<MashImage_1.MashImage src={`/img/crypto/${offer.chain}.webp`} width={16} height={16} alt="chain" className="absolute right-0 bottom-0"/>)}
            </div>
            <div className="text-start font-sans">
              <h4 className="text-base font-medium leading-tight text-muted-800 dark:text-muted-100">
                {offer === null || offer === void 0 ? void 0 : offer.currency} {(offer === null || offer === void 0 ? void 0 : offer.chain) && `(${offer.chain})`}
              </h4>
              <p className="font-sans text-xs text-muted-400">
                {(offer === null || offer === void 0 ? void 0 : offer.createdAt)
            ? (0, date_fns_1.formatDate)(new Date(offer.createdAt), "dd MMM yyyy")
            : ""}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <BackButton_1.BackButton href={`/p2p`}/>
            {(profile === null || profile === void 0 ? void 0 : profile.id) !== (offer === null || offer === void 0 ? void 0 : offer.userId) && (<Button_1.default color="primary" shape={"rounded-sm"} type="button" onClick={() => {
                setOpen(true);
            }} disabled={(offer === null || offer === void 0 ? void 0 : offer.status) !== "ACTIVE" ||
                (offer ? offer.inOrder >= offer.amount : false)}>
                {t("Trade")}
              </Button_1.default>)}
          </div>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-1/2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-400">
                {t("Traded Amount")}
              </span>
              <span className="text-xs font-medium text-muted-400">
                {offerProgress}%
              </span>
            </div>
            <div className="h-1 bg-muted-200 dark:bg-muted-800 rounded-full">
              <div className="h-1 bg-primary-500 dark:bg-primary-400 rounded-full" style={{ width: `${offerProgress}%` }}></div>
            </div>
          </div>
          <div className="w-1/2 text-right">
            <span className="text-xs font-medium text-muted-400">
              {t("Offer ID")} {offer === null || offer === void 0 ? void 0 : offer.id}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
          <div className="col-span-1 flex flex-col gap-6">
            <div className="col-span-1">
              <DealCard_1.DealCard isToggle title={t("Payment Method")}>
                <infoBlock_1.default icon="bx:bx-wallet" label={t("Method")} value={offer === null || offer === void 0 ? void 0 : offer.paymentMethod.name}/>
                <infoBlock_1.default icon="bx:bx-wallet" label={t("Wallet Type")} value={offer === null || offer === void 0 ? void 0 : offer.paymentMethod.walletType}/>
                <infoBlock_1.default icon="bx:bx-dollar" label={t("Currency")} value={offer === null || offer === void 0 ? void 0 : offer.paymentMethod.currency}/>
                {(offer === null || offer === void 0 ? void 0 : offer.paymentMethod.chain) && (<infoBlock_1.default icon="bx:bx-coin-stack" label={t("Chain")} value={offer === null || offer === void 0 ? void 0 : offer.paymentMethod.chain}/>)}
              </DealCard_1.DealCard>
            </div>

            <div className="col-span-1">
              <DealCard_1.DealCard isToggle title={t("Offer Information")}>
                <infoBlock_1.default icon="bx:bx-wallet" label={t("Wallet Type")} value={offer === null || offer === void 0 ? void 0 : offer.walletType}/>
                {(offer === null || offer === void 0 ? void 0 : offer.chain) && (<infoBlock_1.default icon="bx:bx-coin-stack" label={t("Chain")} value={offer.chain}/>)}

                <infoBlock_1.default icon="bx:bx-dollar" label={t("Currency")} value={offer === null || offer === void 0 ? void 0 : offer.currency}/>
                <infoBlock_1.default icon="bx:bx-money" label={t("Price")} value={`${offer === null || offer === void 0 ? void 0 : offer.price} ${(_a = offer === null || offer === void 0 ? void 0 : offer.paymentMethod) === null || _a === void 0 ? void 0 : _a.currency}`}/>
                <infoBlock_1.default icon="bx:bx-money" label={t("Remaining Amount")} value={`${offer && (offer === null || offer === void 0 ? void 0 : offer.amount) - (offer === null || offer === void 0 ? void 0 : offer.inOrder)} ${offer === null || offer === void 0 ? void 0 : offer.currency}`}/>
              </DealCard_1.DealCard>
            </div>
          </div>
          <div className="col-span-1">
            {offer && (<DealCard_1.DealCard isToggle title={t("Recent Trades")}>
                <div className="flex flex-col gap-4">
                  {offer === null || offer === void 0 ? void 0 : offer.p2pTrades.slice(0, 5).map((trade) => (<Card_1.default key={trade.id} className="flex items-center justify-between gap-4 p-3">
                      <div className="flex items-center gap-3">
                        <MashImage_1.MashImage className="rounded-full" src={(offer === null || offer === void 0 ? void 0 : offer.user.avatar) || "/img/placeholder.svg"} height={32} width={32} alt="Deal image"/>
                        <div className="font-sans">
                          <span className="block text-sm font-medium text-muted-800 dark:text-muted-100">
                            {offer === null || offer === void 0 ? void 0 : offer.user.firstName}
                          </span>
                          <span className="block text-xs text-muted-400">
                            {offer === null || offer === void 0 ? void 0 : offer.user.lastName}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-xs font-medium text-muted-400">
                          {trade.status}
                        </span>
                        <span className="text-xs font-medium text-muted-400">
                          {trade.amount} {offer === null || offer === void 0 ? void 0 : offer.currency}
                        </span>
                      </div>
                    </Card_1.default>))}
                </div>
              </DealCard_1.DealCard>)}
          </div>
          {/* reviews */}
          <div className="col-span-1">
            {offer && (<DealCard_1.DealCard isToggle title={t("Recent Reviews")}>
                <div className="flex flex-col gap-4">
                  {offer.p2pReviews.slice(0, 5).map((review) => (<Card_1.default key={review.id} className="p-3">
                      <div className="flex items-center justify-between gap-4 ">
                        <div className="flex items-center gap-3">
                          <MashImage_1.MashImage className="rounded-full" src={review.reviewer.avatar || "/img/placeholder.svg"} height={32} width={32} alt="Deal image"/>
                          <div className="font-sans">
                            <span className="block text-sm font-medium text-muted-800 dark:text-muted-100">
                              {review.reviewer.firstName}
                            </span>
                            <span className="block text-xs text-muted-400">
                              {review.reviewer.lastName}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <div className="flex gap-1">
                            {Array.from({ length: 5 }, (_, i) => (<react_2.Icon key={i} icon={i < review.rating
                        ? "uim:star"
                        : i === review.rating &&
                            review.rating % 1 >= 0.5
                            ? "uim:star-half-alt"
                            : "uim:star"} className={`w-4 h-4 ${i < review.rating
                        ? "text-yellow-400"
                        : "text-gray-300"}`}/>))}
                          </div>
                        </div>
                      </div>

                      <span className="text-xs font-medium text-muted-400">
                        {review.comment}
                      </span>
                    </Card_1.default>))}
                </div>
              </DealCard_1.DealCard>)}
          </div>
        </div>

        <Modal_1.default open={open} size="sm">
          <Card_1.default shape="smooth">
            <div className="flex items-center justify-between p-4 md:p-6">
              <p className="font-sans text-lg font-medium text-muted-900 dark:text-white">
                {t("Trade Details")}
              </p>
              <IconButton_1.default size="sm" shape="full" onClick={() => {
            setOpen(false);
        }}>
                <react_2.Icon icon="lucide:x" className="h-4 w-4"/>
              </IconButton_1.default>
            </div>
            <div className="p-4 md:px-6 md:py-8">
              <div className="mx-auto w-full max-w-xs">
                <p className="text-sm text-muted-500 dark:text-muted-400">
                  {t("Please enter the amount you would like to trade with the user")}
                </p>
                <Input_1.default type="number" label={t("Amount in BTC")} placeholder={t("Enter Amount")} value={amount} onChange={(e) => setAmount(Number(e.target.value))} min={offer === null || offer === void 0 ? void 0 : offer.minAmount} max={wallet ? wallet.balance : offer === null || offer === void 0 ? void 0 : offer.maxAmount}/>
                {/* Calculated equivalent in the currency */}
                {amount > 0 && (<div className="mt-2 text-sm text-muted-500 dark:text-muted-400">
                    {t("Equivalent in USD")}:{" "}
                    <span className="font-medium text-muted-700 dark:text-muted-200">
                      {(amount * ((offer === null || offer === void 0 ? void 0 : offer.price) || 0)).toFixed(2)}{" "}
                      {offer === null || offer === void 0 ? void 0 : offer.paymentMethod.currency}
                    </span>
                  </div>)}
              </div>
              {/* Minimum and Maximum Trade Amount */}
              <Card_1.default className="mt-6 p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm text-muted-500 dark:text-muted-400">
                    {t("Minimum Trade Amount")}
                  </span>
                  <span className="text-sm text-muted-500 dark:text-muted-400">
                    {offer === null || offer === void 0 ? void 0 : offer.minAmount} {offer === null || offer === void 0 ? void 0 : offer.currency}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm text-muted-500 dark:text-muted-400">
                    {t("Maximum Trade Amount")}
                  </span>
                  <span className="text-sm text-muted-500 dark:text-muted-400">
                    {offer === null || offer === void 0 ? void 0 : offer.maxAmount} {offer === null || offer === void 0 ? void 0 : offer.currency}
                  </span>
                </div>
              </Card_1.default>
              {/* Wallet Balance */}
              <Card_1.default className="mt-6 p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm text-muted-500 dark:text-muted-400">
                    {t("Wallet Balance")}
                  </span>
                  <span className="text-sm text-muted-500 dark:text-muted-400">
                    {wallet ? wallet.balance : 0}{" "}
                    {(_b = offer === null || offer === void 0 ? void 0 : offer.paymentMethod) === null || _b === void 0 ? void 0 : _b.currency}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm text-muted-500 dark:text-muted-400">
                    {t("Remaining Balance")}
                  </span>
                  <span className="text-sm text-muted-500 dark:text-muted-400">
                    {wallet ? wallet.balance - amount : 0}{" "}
                    {(_c = offer === null || offer === void 0 ? void 0 : offer.paymentMethod) === null || _c === void 0 ? void 0 : _c.currency}
                  </span>
                </div>
              </Card_1.default>
            </div>
            <div className="p-4 md:p-6">
              <div className="flex w-full justify-end gap-2">
                <Button_1.default shape="smooth" onClick={() => {
            setOpen(false);
        }}>
                  {t("Cancel")}
                </Button_1.default>
                <Button_1.default variant="solid" color="primary" shape="smooth" onClick={trade} loading={isLoading} disabled={isLoading ||
            amount <= 0 ||
            (offer ? amount > offer.amount - offer.inOrder : false) ||
            (wallet ? amount > wallet.balance : false)}>
                  {t("Trade")}
                </Button_1.default>
              </div>
            </div>
          </Card_1.default>
        </Modal_1.default>
      </main>
    </Default_1.default>);
};
exports.default = P2pOffer;
