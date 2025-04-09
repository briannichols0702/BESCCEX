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
const Default_1 = __importDefault(require("@/layouts/Default"));
const react_1 = __importStar(require("react"));
const dashboard_1 = require("@/stores/dashboard");
const router_1 = require("next/router");
const api_1 = __importDefault(require("@/utils/api"));
const HeaderCardImage_1 = require("@/components/widgets/HeaderCardImage");
const Avatar_1 = __importDefault(require("@/components/elements/base/avatar/Avatar"));
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const Card_1 = __importDefault(require("@/components/elements/base/card/Card"));
const Input_1 = __importDefault(require("@/components/elements/form/input/Input"));
const MashImage_1 = require("@/components/elements/MashImage");
const sonner_1 = require("sonner");
const wallet_1 = require("@/stores/user/wallet");
const panel_1 = require("@/components/elements/base/panel");
const Listbox_1 = __importDefault(require("@/components/elements/form/listbox/Listbox"));
const StakingInfo_1 = require("@/components/pages/user/staking/StakingInfo");
const Progress_1 = __importDefault(require("@/components/elements/base/progress/Progress"));
const date_fns_1 = require("date-fns");
const Faq_1 = require("@/components/pages/knowledgeBase/Faq");
const next_i18next_1 = require("next-i18next");
const PaginationControls_1 = __importDefault(require("@/components/pages/nft/collection/elements/PaginationControls"));
const StakesDashboard = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const { profile, getSetting } = (0, dashboard_1.useDashboardStore)();
    const router = (0, router_1.useRouter)();
    const [stakingPools, setStakingPools] = (0, react_1.useState)([]);
    const [selectedPool, setSelectedPool] = (0, react_1.useState)(null);
    const [filter, setFilter] = (0, react_1.useState)("");
    const [amount, setAmount] = (0, react_1.useState)(0);
    const [hasStaked, setHasStaked] = (0, react_1.useState)(false);
    const [selectedDuration, setSelectedDuration] = (0, react_1.useState)(null);
    const { wallet, fetchWallet, setWallet } = (0, wallet_1.useWalletStore)();
    const [countdown, setCountdown] = (0, react_1.useState)(null);
    const [pagination, setPagination] = (0, react_1.useState)({
        currentPage: 1,
        perPage: 10,
        totalItems: 0,
    });
    const fetchStakingPools = async () => {
        const url = "/api/ext/staking/pool";
        const { data, error } = await (0, api_1.default)({ url, silent: true });
        if (!error) {
            setStakingPools(data);
            setPagination((prev) => ({ ...prev, totalItems: data.length }));
        }
    };
    (0, react_1.useEffect)(() => {
        if (router.isReady) {
            fetchStakingPools();
        }
    }, [router.isReady]);
    const filteredPools = stakingPools.filter((pool) => pool.currency.toLowerCase().includes(filter.toLowerCase()));
    const paginatedPools = filteredPools.slice((pagination.currentPage - 1) * pagination.perPage, pagination.currentPage * pagination.perPage);
    (0, react_1.useEffect)(() => {
        if (router.isReady) {
            fetchStakingPools();
        }
    }, [router.isReady]);
    const openStake = async (pool) => {
        var _a, _b, _c, _d;
        setWallet(null);
        fetchWallet(pool.type, pool.currency);
        setHasStaked(Array.isArray(pool.stakingLogs) && pool.stakingLogs.length > 0);
        setSelectedPool(pool);
        if (!((_a = pool.stakingDurations[0]) === null || _a === void 0 ? void 0 : _a.duration))
            return;
        setSelectedDuration({
            label: `${(_b = pool.stakingDurations[0]) === null || _b === void 0 ? void 0 : _b.duration} days`,
            value: (_c = pool.stakingDurations[0]) === null || _c === void 0 ? void 0 : _c.id,
        });
        setAmount(0);
        if (pool.stakingLogs.length > 0) {
            const log = pool.stakingLogs[0];
            if (!log.createdAt)
                return;
            const durationInDays = (_d = log.duration) === null || _d === void 0 ? void 0 : _d.duration;
            const endDate = (0, date_fns_1.addDays)(new Date(log.createdAt), durationInDays);
            const countdown = calculateCountdown(log.createdAt, endDate.toISOString());
            setCountdown(countdown);
        }
    };
    const [loading, setLoading] = (0, react_1.useState)(false);
    const handleStake = async () => {
        var _a, _b, _c;
        if (getSetting("stakingRestrictions") === "true" &&
            (!((_a = profile === null || profile === void 0 ? void 0 : profile.kyc) === null || _a === void 0 ? void 0 : _a.status) ||
                (parseFloat(((_b = profile === null || profile === void 0 ? void 0 : profile.kyc) === null || _b === void 0 ? void 0 : _b.level) || "0") < 2 &&
                    ((_c = profile === null || profile === void 0 ? void 0 : profile.kyc) === null || _c === void 0 ? void 0 : _c.status) !== "APPROVED"))) {
            await router.push("/user/profile?tab=kyc");
            sonner_1.toast.error(t("Please complete your KYC to purchase this product"));
            return;
        }
        if (!wallet) {
            sonner_1.toast.error("You need to have balance in your wallet to stake");
            return;
        }
        if (!selectedPool || !selectedDuration)
            return;
        if (amount < selectedPool.minStake ||
            amount > selectedPool.maxStake ||
            amount > wallet.balance) {
            sonner_1.toast.error("Invalid amount");
            return;
        }
        setLoading(true);
        const { error } = await (0, api_1.default)({
            url: "/api/ext/staking/log",
            method: "POST",
            body: {
                poolId: selectedPool.id,
                durationId: selectedDuration.value,
                amount,
            },
        });
        if (!error) {
            fetchWallet(selectedPool.type, selectedPool.currency);
            fetchStakingPools();
            setSelectedPool(null);
        }
        setLoading(false);
    };
    (0, react_1.useEffect)(() => {
        if (selectedPool && hasStaked) {
            const intervalId = setInterval(() => {
                setCountdown((prevCountdown) => {
                    if (prevCountdown) {
                        const durationInDays = selectedPool.stakingLogs[0].duration.duration;
                        const endDate = (0, date_fns_1.addDays)(new Date(prevCountdown.startDate), durationInDays);
                        return calculateCountdown(prevCountdown.startDate, endDate.toISOString());
                    }
                    return null;
                });
            }, 1000);
            return () => clearInterval(intervalId);
        }
    }, [selectedPool, hasStaked]);
    const calculateCountdown = (startDate, endDate) => {
        const now = new Date().getTime();
        const start = new Date(startDate).getTime();
        const end = new Date(endDate).getTime();
        const isStarted = now >= start;
        const timeRemaining = Math.max((end - now) / 1000, 0);
        const totalDuration = (end - start) / 1000; // Total duration in seconds
        const progress = ((totalDuration - timeRemaining) / totalDuration) * 100;
        const days = Math.floor(timeRemaining / (60 * 60 * 24));
        const hours = Math.floor((timeRemaining % (60 * 60 * 24)) / (60 * 60));
        const minutes = Math.floor((timeRemaining % (60 * 60)) / 60);
        const seconds = Math.floor(timeRemaining % 60);
        return {
            days,
            hours,
            minutes,
            seconds,
            isStarted,
            progress,
            endDate,
            startDate,
        };
    };
    return (<Default_1.default title={t("Staking Pool")} color="muted">
      <HeaderCardImage_1.HeaderCardImage title={t("Stake your crypto and earn interest on it.")} description="Staking is the process of holding funds in a cryptocurrency wallet to support the operations of a blockchain network. Users are rewarded for simply depositing and holding coins." lottie={{
            category: "cryptocurrency-2",
            path: "payout",
            height: 240,
        }} link={`/user/staking/history`} linkLabel="View Staking History" size="lg"/>
      <div className="relative pt-5">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl">
            <span className="text-primary-500">{t("Staking")}</span>{" "}
            <span className="text-muted-800 dark:text-muted-200">
              {t("Pools")}
            </span>
          </h2>
          <div>
            <Input_1.default type="text" placeholder={t("Search for a pool")} value={filter} onChange={(e) => setFilter(e.target.value)}/>
          </div>
        </div>
        <div className="flex flex-col gap-5">
          {paginatedPools.map((pool, index) => (<Card_1.default key={index} shape="smooth" color="contrast" shadow="hover" className="flex flex-col items-center p-6 sm:flex-row">
              <div className="contact flex w-full flex-row items-center gap-3 justify-start">
                <div className="relative">
                  <Avatar_1.default size="md" src={pool.icon ||
                `/img/crypto/${pool.currency.toLowerCase()}.webp`}/>
                  {(pool === null || pool === void 0 ? void 0 : pool.chain) && (<MashImage_1.MashImage src={`/img/crypto/${pool.chain.toLowerCase()}.webp`} width={16} height={16} alt="chain" className="absolute right-0 bottom-0 rounded-full"/>)}
                </div>
                <div className="text-start font-sans">
                  <h4 className="text-base font-medium leading-tight text-muted-800 dark:text-muted-100">
                    {pool.currency} ({pool.name})
                  </h4>
                  <p className="font-sans text-xs text-muted-400">
                    {pool.description.length > 100
                ? `${pool.description.slice(0, 100)}...`
                : pool.description}
                  </p>
                </div>
              </div>
              <div className="my-4 px-4 text-center lg:my-0 lg:me-8 lg:text-start">
                <span className="block text-xs uppercase leading-snug text-muted-400">
                  {t("Limits")}
                </span>
                <span className="block whitespace-nowrap text-[1.1rem] font-medium leading-snug text-muted-800 dark:text-muted-100">
                  {pool.minStake} - {pool.maxStake} {pool.currency}
                </span>
              </div>
              <div className="status px-4">
                <span className=" text-info-500 text-sm">{pool.type}</span>
              </div>
              <div className="my-6 flex items-center justify-center gap-3 lg:my-0 lg:me-8 lg:justify-end"></div>
              <div className="flex items-center">
                <Button_1.default onClick={() => openStake(pool)} color={"primary"} shape={"rounded-sm"}>
                  {t("Stake")}
                </Button_1.default>
              </div>
            </Card_1.default>))}
        </div>

        {/* Pagination */}
        <PaginationControls_1.default pagination={pagination} setPagination={setPagination}/>
      </div>
      <panel_1.Panel isOpen={!!selectedPool} title={t("Stake")} tableName={t("Stake")} size="xl" onClose={() => setSelectedPool(null)}>
        {selectedPool && (<div className="flex flex-col justify-between gap-5 text-sm text-muted-800 dark:text-muted-200">
            <div className="contact flex w-full flex-row items-center justify-center gap-3 lg:justify-start">
              <div className="relative">
                <MashImage_1.MashImage src={selectedPool.icon ||
                `/img/crypto/${selectedPool.currency.toLowerCase()}.webp`} alt={selectedPool.currency} width={96} height={96} className="rounded-full w-full h-full"/>
                {selectedPool.chain && (<MashImage_1.MashImage src={`/img/crypto/${selectedPool.chain.toLowerCase()}.webp`} width={16} height={16} alt="chain" className="absolute right-0 bottom-0 rounded-full"/>)}
              </div>
              <div className="text-start font-sans">
                <h4 className="text-base font-medium leading-tight text-muted-800 dark:text-muted-100">
                  {selectedPool.currency} ({selectedPool.name})
                </h4>
                <p className="font-sans text-xs text-muted-400">
                  {selectedPool.description}
                </p>
              </div>
            </div>

            <StakingInfo_1.StakingInfo hasStaked={hasStaked} selectedPool={selectedPool} wallet={{ balance: wallet === null || wallet === void 0 ? void 0 : wallet.balance }} selectedDuration={selectedDuration} amount={amount}/>

            {hasStaked && countdown && (<div className="mt-6 w-full">
                <Progress_1.default size="xs" color="success" value={countdown.progress}/>
                <div className="flex justify-between mt-1 w-full text-xs text-muted-500 dark:text-muted-400">
                  <p>{t("Collectable in")}</p>
                  <p>
                    {countdown.days}d {countdown.hours}h {countdown.minutes}m{" "}
                    {countdown.seconds}s{" "}
                    <span className="text-success-500">
                      ({countdown.progress.toFixed(2)}%)
                    </span>
                  </p>
                </div>
              </div>)}

            {hasStaked ? (<>
                <Card_1.default className="p-2 w-full">
                  <Button_1.default onClick={() => { }} color="primary" shape="rounded-sm" className="w-full" disabled>
                    {t("Collect")}
                  </Button_1.default>
                </Card_1.default>
              </>) : (<>
                <div className="flex flex-col gap-5 md:flex-row">
                  <Listbox_1.default label={t("Select Duration")} selected={selectedDuration} setSelected={(d) => {
                    setSelectedDuration(d);
                }} options={selectedPool.stakingDurations.map((d) => ({
                    label: `${d.duration} days`,
                    value: d.id,
                }) || [])}/>
                  <Input_1.default label={t("Amount")} type="number" value={amount} onChange={(e) => setAmount(+e.target.value)}/>
                </div>
                <Card_1.default className="p-2 w-full">
                  <Button_1.default onClick={handleStake} color="primary" shape="rounded-sm" className="w-full" loading={loading} disabled={loading}>
                    {t("Stake")}
                  </Button_1.default>
                </Card_1.default>
              </>)}
          </div>)}
      </panel_1.Panel>

      <Faq_1.Faq category="STAKING"/>
    </Default_1.default>);
};
exports.default = StakesDashboard;
