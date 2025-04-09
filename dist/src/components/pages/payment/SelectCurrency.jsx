"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectCurrency = void 0;
// components/payment/SelectCurrency.tsx
const react_1 = __importDefault(require("react"));
const react_2 = require("@iconify/react");
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const ComboBox_1 = __importDefault(require("@/components/elements/form/combobox/ComboBox"));
const next_i18next_1 = require("next-i18next");
const SelectCurrency = ({ currencies, selectedCurrency, setSelectedCurrency, onBack, onNext, }) => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<div>
      <div className="mb-12 space-y-1 text-center font-sans">
        <h2 className="text-2xl font-light text-muted-800 dark:text-muted-100">
          {t("Select a Currency")}
        </h2>
        <p className="text-sm text-muted-400">
          {t("Pick one of the following currencies to continue")}
        </p>
      </div>

      <div className="mx-auto mb-4 w-full max-w-lg rounded-sm px-4 md:px-8 pb-8">
        <div>
          <ComboBox_1.default selected={selectedCurrency} options={currencies} setSelected={setSelectedCurrency} loading={!currencies}/>
        </div>
        <div className="px-8">
          <div className="mx-auto mt-12 max-w-sm">
            <div className="flex w-full gap-4 justify-center">
              <Button_1.default type="button" size="lg" className="w-full" onClick={onBack}>
                <react_2.Icon icon="mdi:chevron-left" className="h-5 w-5"/>
                {t("Go Back")}
              </Button_1.default>
              <Button_1.default type="button" color="primary" size="lg" className="w-full" onClick={onNext} disabled={!selectedCurrency || selectedCurrency === "Select a currency"}>
                {t("Continue")}
                <react_2.Icon icon="mdi:chevron-right" className="h-5 w-5"/>
              </Button_1.default>
            </div>
          </div>
        </div>
      </div>
    </div>);
};
exports.SelectCurrency = SelectCurrency;
