"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderInput = void 0;
const react_1 = require("react");
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const compactInput_1 = __importDefault(require("@/components/elements/form/input/compactInput"));
const Select_1 = __importDefault(require("@/components/elements/form/select/Select"));
const lodash_1 = require("lodash");
const RangeSlider_1 = __importDefault(require("@/components/elements/addons/range-slider/RangeSlider"));
const dashboard_1 = require("@/stores/dashboard");
const order_1 = require("@/stores/futures/order");
const router_1 = require("next/router");
const react_2 = require("@iconify/react");
const link_1 = __importDefault(require("next/link"));
const Tooltip_1 = require("@/components/elements/base/tooltips/Tooltip");
const market_1 = __importDefault(require("@/stores/futures/market"));
const next_i18next_1 = require("next-i18next");
const sonner_1 = require("sonner");
const OrderInputBase = ({ type, side }) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    const { t } = (0, next_i18next_1.useTranslation)();
    const router = (0, router_1.useRouter)();
    const { profile, getSetting } = (0, dashboard_1.useDashboardStore)();
    const { market } = (0, market_1.default)();
    const getPrecision = (type) => {
        var _a;
        const precision = Number(((_a = market === null || market === void 0 ? void 0 : market.precision) === null || _a === void 0 ? void 0 : _a[type]) || 8);
        return Math.min(Math.max(precision, 0), 100);
    };
    const minAmount = Number(((_b = (_a = market === null || market === void 0 ? void 0 : market.limits) === null || _a === void 0 ? void 0 : _a.amount) === null || _b === void 0 ? void 0 : _b.min) || 0);
    const maxAmount = Number(((_d = (_c = market === null || market === void 0 ? void 0 : market.limits) === null || _c === void 0 ? void 0 : _c.amount) === null || _d === void 0 ? void 0 : _d.max) || 0);
    const minPrice = Number(((_f = (_e = market === null || market === void 0 ? void 0 : market.limits) === null || _e === void 0 ? void 0 : _e.price) === null || _f === void 0 ? void 0 : _f.min) || 0);
    const maxPrice = Number(((_h = (_g = market === null || market === void 0 ? void 0 : market.limits) === null || _g === void 0 ? void 0 : _g.price) === null || _h === void 0 ? void 0 : _h.max) || 0);
    const { placeOrder, pairBalance, ask, bid } = (0, order_1.useFuturesOrderStore)();
    const [amount, setAmount] = (0, react_1.useState)(0);
    const leverageValues = ((_j = market === null || market === void 0 ? void 0 : market.limits) === null || _j === void 0 ? void 0 : _j.leverage)
        ? market.limits.leverage.split(",").map(Number)
        : [1];
    const leverageOptions = leverageValues.map((value) => ({
        label: `${value}x`,
        value,
    }));
    const [leverage, setLeverage] = (0, react_1.useState)(leverageOptions[0].value);
    const [stopPrice, setStopPrice] = (0, react_1.useState)(undefined);
    const [takeProfitPrice, setTakeProfitPrice] = (0, react_1.useState)(undefined);
    const options = type === "MARKET"
        ? [
            { value: "AMOUNT", label: "Amount" },
            { value: "TOTAL", label: "Total" },
        ]
        : [];
    const [inputType, setInputType] = (0, react_1.useState)("AMOUNT");
    const [price, setPrice] = (0, react_1.useState)(0);
    const [percentage, setPercentage] = (0, react_1.useState)(0);
    (0, react_1.useEffect)(() => {
        setPercentage(0);
        if (type === "MARKET") {
            setPrice(0);
        }
        else if (price === 0) {
            setPrice(side === "BUY" ? ask : bid);
        }
        setInputType("AMOUNT");
    }, [type, side, ask, bid]);
    const handleSliderChange = (value) => {
        setPercentage(value);
        let total = 0;
        const calculateTotal = (balance, divisor, precisionType) => {
            const divisorValue = divisor ? Number(divisor) : 1; // Ensure divisor is a number
            return parseFloat(((balance * value) / 100 / divisorValue).toFixed(getPrecision(precisionType)));
        };
        if (type === "MARKET") {
            if (side === "BUY") {
                total =
                    inputType === "AMOUNT"
                        ? calculateTotal(pairBalance, ask, "amount")
                        : calculateTotal(pairBalance, null, "price");
            }
            else {
                total = calculateTotal(pairBalance, null, "amount");
            }
        }
        else {
            if (side === "BUY") {
                total = calculateTotal(pairBalance, price, "amount");
            }
            else {
                total = calculateTotal(pairBalance, null, "amount");
            }
        }
        setAmount(total);
    };
    const handlePlaceOrder = async () => {
        var _a, _b, _c;
        if (getSetting("tradeRestrictions") === "true" &&
            (!((_a = profile === null || profile === void 0 ? void 0 : profile.kyc) === null || _a === void 0 ? void 0 : _a.status) ||
                (parseFloat(((_b = profile === null || profile === void 0 ? void 0 : profile.kyc) === null || _b === void 0 ? void 0 : _b.level) || "0") < 2 &&
                    ((_c = profile === null || profile === void 0 ? void 0 : profile.kyc) === null || _c === void 0 ? void 0 : _c.status) !== "APPROVED"))) {
            await router.push("/user/profile?tab=kyc");
            sonner_1.toast.error(t("Please complete your KYC to start trading"));
            return;
        }
        let calculatedAmount = amount;
        if (type === "MARKET" && inputType === "TOTAL")
            calculatedAmount = amount / (side === "BUY" ? ask : bid);
        await placeOrder(market === null || market === void 0 ? void 0 : market.currency, market === null || market === void 0 ? void 0 : market.pair, type, side, calculatedAmount, type === "MARKET" ? undefined : price, leverage, stopPrice, takeProfitPrice);
        setPercentage(0);
        setStopPrice(undefined);
        setTakeProfitPrice(undefined);
    };
    return (<div className="flex flex-col gap-2 justify-between h-full w-full">
      <div className="flex flex-col w-full gap-3">
        <div className="flex gap-1 justify-between items-center">
          <div className="flex gap-2 items-center">
            <span className="text-muted-400 dark:text-muted-400 text-xs">
              {t("Available")} {pairBalance.toFixed(getPrecision("amount"))}{" "}
              {market === null || market === void 0 ? void 0 : market.pair}
            </span>
            <Tooltip_1.Tooltip content={`Transfer ${market === null || market === void 0 ? void 0 : market.pair}`}>
              <link_1.default href={(profile === null || profile === void 0 ? void 0 : profile.id)
            ? "/user/wallet/transfer"
            : "/login?return=/user/wallet/deposit"}>
                <react_2.Icon icon="mdi:plus" className="h-3 w-3 text-primary-500 cursor-pointer border border-primary-500 rounded-full hover:bg-primary-500 hover:text-white"/>
              </link_1.default>
            </Tooltip_1.Tooltip>
          </div>
          {type !== "MARKET" && (<span className="text-xs text-primary-500 dark:text-primary-400 cursor-pointer" onClick={() => setPrice(side === "BUY" ? ask : bid)}>
              {t("Best")} {side === "BUY" ? "Ask" : "Bid"}
            </span>)}
        </div>
        <div className="flex flex-col">
          <compactInput_1.default type="number" className="input" placeholder={type === "MARKET" ? "Market" : price.toString()} label={t("Price")} postLabel={market === null || market === void 0 ? void 0 : market.pair} shape={"rounded-xs"} disabled={type === "MARKET"} value={type === "MARKET" ? "" : price} onChange={(e) => setPrice(parseFloat(e.target.value))} min={minPrice} max={maxPrice} step={minPrice > 0 ? minPrice : Math.pow(10, -getPrecision("price"))}/>
        </div>
        <div className="flex flex-col gap-1">
          <compactInput_1.default type="number" className="input" placeholder="0.0" label={type === "MARKET" ? "" : "Amount"} postLabel={inputType === "AMOUNT" ? market === null || market === void 0 ? void 0 : market.currency : market === null || market === void 0 ? void 0 : market.pair} shape={"rounded-xs"} options={options} selected={inputType} setSelected={(value) => {
            setInputType(value);
        }} value={amount} onChange={(e) => setAmount(parseFloat(e.target.value))} min={minAmount} max={maxAmount} step={minAmount > 0 ? minAmount : Math.pow(10, -getPrecision("amount"))}/>
        </div>
        {type === "STOPLIMIT" && (<>
            <div className="flex flex-col">
              <compactInput_1.default type="number" className="input" placeholder="0.0" label={t("Stop Price")} postLabel={market === null || market === void 0 ? void 0 : market.pair} shape={"rounded-xs"} value={stopPrice !== null && stopPrice !== void 0 ? stopPrice : ""} onChange={(e) => setStopPrice(parseFloat(e.target.value) || undefined)} min={minPrice} max={maxPrice} step={minPrice > 0 ? minPrice : Math.pow(10, -getPrecision("price"))}/>
            </div>
            <div className="flex flex-col">
              <compactInput_1.default type="number" className="input" placeholder="0.0" label={t("Take Profit")} postLabel={market === null || market === void 0 ? void 0 : market.pair} shape={"rounded-xs"} value={takeProfitPrice !== null && takeProfitPrice !== void 0 ? takeProfitPrice : ""} onChange={(e) => setTakeProfitPrice(parseFloat(e.target.value) || undefined)} min={minPrice} max={maxPrice} step={minPrice > 0 ? minPrice : Math.pow(10, -getPrecision("price"))}/>
            </div>
          </>)}
        <div className="mt-2 mb-3">
          <RangeSlider_1.default legend min={0} max={100} steps={[0, 25, 50, 75, 100]} value={percentage} onSliderChange={handleSliderChange} color="warning" disabled={!(profile === null || profile === void 0 ? void 0 : profile.id) || (type !== "MARKET" && price === 0)}/>
        </div>
      </div>
      <div className="flex gap-1 items-end">
        <div className="min-w-24">
          {leverageOptions.length > 1 ? (<Select_1.default label={t("Leverage")} options={leverageOptions} value={leverage} onChange={(e) => setLeverage(parseFloat(e.target.value))} shape={"rounded-xs"}/>) : (<compactInput_1.default type="number" className="input" label={t("Leverage")} value={leverage} shape={"rounded-xs"} disabled/>)}
        </div>
        <div className="w-full">
          <Button_1.default type="button" color={(profile === null || profile === void 0 ? void 0 : profile.id) ? (side === "BUY" ? "success" : "danger") : "muted"} animated={false} className="w-full" shape={"rounded-xs"} onClick={() => {
            if (profile === null || profile === void 0 ? void 0 : profile.id) {
                handlePlaceOrder();
            }
            else {
                router.push("/auth/login");
            }
        }}>
            {(profile === null || profile === void 0 ? void 0 : profile.id) ? ((0, lodash_1.capitalize)(side === "BUY" ? t("Long") : t("Short")) +
            " " +
            t("Position")) : (<div className="flex gap-2">
                <span className="text-warning-500">{t("Log In")}</span>
                <span>{t("or")}</span>
                <span className="text-warning-500">{t("Register Now")}</span>
              </div>)}
          </Button_1.default>
        </div>
      </div>
    </div>);
};
exports.OrderInput = (0, react_1.memo)(OrderInputBase);
