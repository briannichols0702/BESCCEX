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
const SelectWalletType_1 = require("@/components/pages/user/wallet/deposit/SelectWalletType");
const SelectCurrency_1 = require("@/components/pages/user/wallet/deposit/SelectCurrency");
const SelectNetwork_1 = require("@/components/pages/user/wallet/deposit/SelectNetwork");
const DepositAddress_1 = require("@/components/pages/user/wallet/deposit/DepositAddress");
const DepositConfirmed_1 = require("@/components/pages/user/wallet/deposit/DepositConfirmed");
const deposit_1 = require("@/stores/user/wallet/deposit");
const SelectFiatDepositMethod_1 = require("@/components/pages/user/wallet/deposit/SelectFiatDepositMethod");
const FiatDepositAmount_1 = require("@/components/pages/user/wallet/deposit/FiatDepositAmount");
const ws_1 = __importDefault(require("@/utils/ws"));
const dashboard_1 = require("@/stores/dashboard");
const sonner_1 = require("sonner");
const next_i18next_1 = require("next-i18next");
const router_1 = require("next/router");
const link_1 = __importDefault(require("next/link"));
const Faq_1 = require("@/components/pages/knowledgeBase/Faq");
function AuthWizard() {
    var _a;
    const { t } = (0, next_i18next_1.useTranslation)();
    const { step, selectedWalletType, depositAddress, clearAll, transactionSent, transactionHash, selectedCurrency, selectedDepositMethod, setDeposit, setStep, setLoading, initializeWalletTypes, } = (0, deposit_1.useDepositStore)();
    const { profile, getSetting } = (0, dashboard_1.useDashboardStore)();
    const router = (0, router_1.useRouter)();
    const [wsManager, setWsManager] = (0, react_1.useState)(null);
    const depositEnabled = getSetting("deposit") !== "false";
    (0, react_1.useEffect)(() => {
        var _a, _b, _c;
        if (router.isReady &&
            getSetting("depositRestrictions") === "true" &&
            (!((_a = profile === null || profile === void 0 ? void 0 : profile.kyc) === null || _a === void 0 ? void 0 : _a.status) ||
                (parseFloat(((_b = profile === null || profile === void 0 ? void 0 : profile.kyc) === null || _b === void 0 ? void 0 : _b.level) || "0") < 2 &&
                    ((_c = profile === null || profile === void 0 ? void 0 : profile.kyc) === null || _c === void 0 ? void 0 : _c.status) !== "APPROVED")) &&
            depositEnabled) {
            router.push("/user/profile?tab=kyc");
            sonner_1.toast.error(t("Please complete your KYC to deposit funds"));
        }
    }, [router.isReady, (_a = profile === null || profile === void 0 ? void 0 : profile.kyc) === null || _a === void 0 ? void 0 : _a.status]);
    (0, react_1.useEffect)(() => {
        if (router.isReady)
            initializeWalletTypes();
    }, [router.isReady]);
    (0, react_1.useEffect)(() => {
        if (selectedWalletType.value !== "FIAT" &&
            step === 4 &&
            (profile === null || profile === void 0 ? void 0 : profile.id) &&
            depositAddress.address) {
            const wsPath = selectedWalletType.value === "ECO"
                ? `/api/ext/ecosystem/deposit?userId=${profile === null || profile === void 0 ? void 0 : profile.id}`
                : `/api/finance/deposit/spot?userId=${profile === null || profile === void 0 ? void 0 : profile.id}`;
            const manager = new ws_1.default(wsPath);
            manager.connect();
            setWsManager(manager);
            if (selectedWalletType.value === "ECO") {
                manager.on("open", () => {
                    var _a;
                    manager.send({
                        action: "SUBSCRIBE",
                        payload: {
                            currency: selectedCurrency,
                            chain: selectedDepositMethod,
                            address: (_a = depositAddress.address) === null || _a === void 0 ? void 0 : _a.toLowerCase(),
                        },
                    });
                });
            }
            // Handle incoming messages
            manager.on("message", (message) => {
                if (!message || !message.data || message.stream !== "verification")
                    return;
                switch (message.data.status) {
                    case 200:
                    case 201:
                        sonner_1.toast.success(message.data.message);
                        setDeposit(message.data);
                        setLoading(false);
                        setStep(5);
                        break;
                    case 400:
                    case 401:
                    case 403:
                    case 404:
                    case 500:
                        setLoading(false);
                        sonner_1.toast.error(message.data.message);
                        break;
                    default:
                        break;
                }
            });
            return () => {
                manager.disconnect();
            };
        }
    }, [selectedWalletType.value, step, profile === null || profile === void 0 ? void 0 : profile.id, depositAddress.address]);
    // Handling WebSocket disconnection and sending messages
    (0, react_1.useEffect)(() => {
        if (wsManager && step === 4 && transactionSent) {
            // Send a subscription message
            wsManager.send({
                action: "SUBSCRIBE",
                payload: {
                    trx: transactionHash,
                },
            });
            return () => {
                // Unsubscribe when leaving the step or after confirmation
                wsManager.send({
                    action: "UNSUBSCRIBE",
                    payload: {
                        trx: transactionHash,
                    },
                });
            };
        }
    }, [wsManager, step, transactionSent, transactionHash]);
    // Clear all state when leaving the wizard or completing the process
    (0, react_1.useEffect)(() => {
        // Change this condition as needed to control when to clear
        return () => {
            if (step === 5) {
                clearAll();
            }
        };
    }, [step]);
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
        {depositEnabled ? (<form action="#" method="POST" className="relative mx-auto flex min-h-screen max-w-4xl flex-col items-stretch pt-36 pb-20">
            {step === 1 && <SelectWalletType_1.SelectWalletType />}

            {step === 2 && <SelectCurrency_1.SelectCurrency />}

            {step === 3 && selectedWalletType.value === "FIAT" && (<SelectFiatDepositMethod_1.SelectFiatDepositMethod />)}

            {step === 4 && selectedWalletType.value === "FIAT" && (<FiatDepositAmount_1.FiatDepositAmount />)}

            {step === 3 &&
                ["ECO", "SPOT"].includes(selectedWalletType.value) && (<SelectNetwork_1.SelectNetwork />)}

            {step === 4 &&
                ["ECO", "SPOT"].includes(selectedWalletType.value) &&
                depositAddress && <DepositAddress_1.DepositAddress />}

            {step === 5 && <DepositConfirmed_1.DepositConfirmed />}

            <hr className="my-6 border-t border-muted-200 dark:border-muted-800"/>
            <div className="text-center">
              <p className="mt-4 space-x-2 font-sans text-sm leading-5 text-muted-600 dark:text-muted-400">
                <span>{t("Having any trouble")}</span>
                <link_1.default href="/user/support/ticket" className="font-medium text-primary-600 underline-offset-4 transition duration-150 ease-in-out hover:text-primary-500 hover:underline focus:underline focus:outline-hidden">
                  {t("Contact us")}
                </link_1.default>
              </p>
            </div>

            {selectedWalletType.value === "FIAT" && (<Faq_1.Faq category="DEPOSIT_FIAT"/>)}

            {selectedWalletType.value === "SPOT" && (<Faq_1.Faq category="DEPOSIT_SPOT"/>)}

            {selectedWalletType.value === "ECO" && (<Faq_1.Faq category="DEPOSIT_FUNDING"/>)}

            <div className="absolute bottom-0 left-0 right-0 p-4 bg-white shadow-md flex justify-between rounded-t-md items-center flex-col md:flex-row dark:bg-muted-800">
              <p className="text-sm text-center text-gray-500 dark:text-muted-300">
                {t("Please note that depositing funds may take some time.")}
              </p>
              <span className="text-sm text-center text-muted-500 dark:text-muted-200 underline cursor-pointer" onClick={() => {
                clearAll();
                router.back();
            }}>
                {t("Cancel")}
              </span>
            </div>
          </form>) : (<>
            <div className="relative mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center pt-36 pb-10">
              <p className="text-lg font-semibold text-red-600">
                {t("Deposits are currently disabled. Please contact support for more information.")}
              </p>

              <hr className="my-6 border-t border-muted-200 dark:border-muted-800"/>

              <div className="text-center">
                <p className="mt-4 space-x-2 font-sans text-sm leading-5 text-muted-600 dark:text-muted-400">
                  <span>{t("Having any trouble")}</span>
                  <link_1.default href="/user/support/ticket" className="font-medium text-primary-600 underline-offset-4 transition duration-150 ease-in-out hover:text-primary-500 hover:underline focus:underline focus:outline-hidden">
                    {t("Contact us")}
                  </link_1.default>
                </p>

                <span className="text-sm text-center text-muted-500 dark:text-muted-200 underline cursor-pointer" onClick={() => router.back()}>
                  {t("Go back")}
                </span>
              </div>
            </div>
          </>)}
      </main>
    </Minimal_1.default>);
}
exports.default = AuthWizard;
