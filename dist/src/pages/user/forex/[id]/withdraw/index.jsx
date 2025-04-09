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
const Minimal_1 = __importDefault(require("@/layouts/Minimal"));
const MinimalHeader_1 = __importDefault(require("@/components/widgets/MinimalHeader"));
const StepProgress_1 = require("@/components/elements/addons/StepProgress");
const SelectWalletType_1 = require("@/components/pages/user/forex/withdraw/SelectWalletType");
const SelectCurrency_1 = require("@/components/pages/user/forex/withdraw/SelectCurrency");
const SelectNetwork_1 = require("@/components/pages/user/forex/withdraw/SelectNetwork");
const withdraw_1 = require("@/stores/user/forex/withdraw");
const WithdrawAmount_1 = require("@/components/pages/user/forex/withdraw/WithdrawAmount");
const WithdrawConfirmed_1 = require("@/components/pages/user/forex/withdraw/WithdrawConfirmed");
const router_1 = require("next/router");
const next_i18next_1 = require("next-i18next");
function AuthWizard() {
    const { t } = (0, next_i18next_1.useTranslation)();
    const { step, selectedWalletType, clearAll, fetchAccount } = (0, withdraw_1.useWithdrawStore)();
    const router = (0, router_1.useRouter)();
    const { id } = router.query;
    // Clear all state when leaving the wizard or completing the process
    (0, react_1.useEffect)(() => {
        if (router.isReady) {
            fetchAccount(id);
        }
        return () => {
            if (step === 5) {
                clearAll();
            }
        };
    }, [router.isReady, step]);
    return (<Minimal_1.default title={t("Wizard")} color="muted">
      <main className="relative min-h-screen">
        <MinimalHeader_1.default />
        <StepProgress_1.StepProgress step={step} icons={[
            "solar:wallet-bold-duotone",
            "ph:currency-dollar-simple-duotone",
            "ph:sketch-logo-duotone",
            "solar:password-minimalistic-input-line-duotone",
            "ph:flag-duotone",
        ]}/>
        <form action="#" method="POST" className="relative mx-auto flex min-h-screen max-w-4xl flex-col items-stretch pt-36">
          {step === 1 && <SelectWalletType_1.SelectWalletType />}

          {step === 2 && <SelectCurrency_1.SelectCurrency />}

          {step === 3 && ["ECO", "SPOT"].includes(selectedWalletType.value) && (<SelectNetwork_1.SelectNetwork />)}

          {step === 4 && <WithdrawAmount_1.WithdrawAmount />}

          {step === 5 && <WithdrawConfirmed_1.WithdrawConfirmed />}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-white shadow-md flex justify-between rounded-t-md items-center flex-col md:flex-row dark:bg-muted-800">
            <p className="text-sm text-center text-gray-500 dark:text-muted-300">
              {t("Please note that withdrawing funds may take some time.")}
            </p>
            <span className="text-sm text-center text-muted-500 dark:text-muted-200 underline cursor-pointer" onClick={() => router.back()}>
              {t("Cancel")}
            </span>
          </div>
        </form>
      </main>
    </Minimal_1.default>);
}
exports.default = AuthWizard;
