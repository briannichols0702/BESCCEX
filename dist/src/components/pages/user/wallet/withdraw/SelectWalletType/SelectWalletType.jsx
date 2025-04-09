"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectWalletType = void 0;
const react_1 = require("react");
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const react_2 = require("@iconify/react");
const link_1 = __importDefault(require("next/link"));
const withdraw_1 = require("@/stores/user/wallet/withdraw");
const next_i18next_1 = require("next-i18next");
const RadioHeadless_1 = __importDefault(require("@/components/elements/form/radio/RadioHeadless"));
const SelectWalletTypeBase = ({}) => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const { walletTypes, selectedWalletType, setSelectedWalletType, setStep, fetchCurrencies, } = (0, withdraw_1.useWithdrawStore)();
    // Determine the number of columns based on the number of wallet types
    const getGridCols = () => {
        switch (walletTypes.length) {
            case 1:
                return "grid-cols-1";
            case 2:
                return "grid-cols-1 sm:grid-cols-2";
            case 3:
                return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
            default:
                return "grid-cols-1";
        }
    };
    return (<div>
      <div className="mb-12 space-y-1 text-center font-sans">
        <h2 className="text-2xl font-light text-muted-800 dark:text-muted-100">
          {t("Select a Wallet Type")}
        </h2>
        <p className="text-sm text-muted-400">
          {t("Pick one of the following wallet types to continue")}
        </p>
      </div>

      <div className="mx-auto mb-4 w-full max-w-lg rounded-sm px-8 pb-8">
        <div className={`grid gap-4 ${getGridCols()}`}>
          {walletTypes.map((walletType) => (<RadioHeadless_1.default key={walletType.value} name="walletType" checked={selectedWalletType.value === walletType.value} onChange={() => setSelectedWalletType(walletType)}>
              <div className={`flex items-center justify-between p-4 bg-white dark:bg-muted-800 rounded-md border ${selectedWalletType.value === walletType.value
                ? "border-success-500"
                : "border-muted-200 dark:border-muted-800"}`}>
                <div className="flex items-center space-x-4">
                  <h5 className="text-lg font-medium text-muted-800 dark:text-muted-100">
                    {t(walletType.label)}
                  </h5>
                </div>
                <div className="flex items-center">
                  {selectedWalletType.value === walletType.value && (<react_2.Icon icon="ph:check-circle-duotone" className="h-6 w-6 text-success-500"/>)}
                </div>
              </div>
            </RadioHeadless_1.default>))}
        </div>

        <div className="mt-6">
          <Button_1.default type="button" color="primary" size="lg" className="w-full" onClick={() => {
            fetchCurrencies();
            setStep(2);
        }} disabled={selectedWalletType.value === ""}>
            {t("Continue")}
            <react_2.Icon icon="mdi:chevron-right" className="h-5 w-5"/>
          </Button_1.default>
        </div>
        <hr className="my-6 border-t border-muted-200 dark:border-muted-800"/>
        <div className="text-center">
          <p className="mt-8 space-x-2 font-sans text-sm leading-5 text-muted-600 dark:text-muted-400">
            <span>{t("Having any trouble")}</span>
            <link_1.default href="#" className="font-medium text-primary-600 underline-offset-4 transition duration-150 ease-in-out hover:text-primary-500 hover:underline focus:underline focus:outline-hidden">
              {t("Contact us")}
            </link_1.default>
          </p>
        </div>
      </div>
    </div>);
};
exports.SelectWalletType = (0, react_1.memo)(SelectWalletTypeBase);
