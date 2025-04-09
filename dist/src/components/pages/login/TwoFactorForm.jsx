"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwoFactorForm = void 0;
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const Input_1 = __importDefault(require("@/components/elements/form/input/Input"));
const react_1 = require("@iconify/react");
const react_2 = require("react");
const next_i18next_1 = require("next-i18next");
const login_1 = require("@/stores/auth/login");
const router_1 = require("next/router");
const TwoFactorFormBase = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const { otp, setOtp, twoFactorType, handle2FASubmit, handleResendOtp, resendCooldown, loading, } = (0, login_1.useLoginStore)();
    const router = (0, router_1.useRouter)();
    return (<div>
      <div className="flex flex-col gap-4">
        <Input_1.default icon="lucide:lock" label={t("2FA Code")} color="contrast" placeholder={t("Enter 2FA code")} value={otp} onChange={(e) => setOtp(e.target.value)}/>
        <p className="text-sm text-muted-500">
          {t(`Use the OTP sent to your ${twoFactorType.toLowerCase()}`)}
        </p>
      </div>

      <div className="mt-6">
        <Button_1.default color="primary" size="md" className="w-full" loading={loading} disabled={loading} onClick={() => {
            handle2FASubmit(router);
        }}>
          {t("Verify 2FA")}
        </Button_1.default>
      </div>
      <div>
        {twoFactorType !== "APP" && (<span className="mt-4 text-sm text-muted-400 dark:text-muted-600 flex items-center justify-between">
            <span>{t("Didn't receive the OTP?")}</span>
            <span className={`text-sm flex items-center justify-center gap-1 ${resendCooldown > 0 || loading
                ? "text-muted-400 dark:text-muted-600 cursor-not-allowed"
                : "text-primary-600 cursor-pointer hover:text-primary-500"}`} onClick={() => {
                if (resendCooldown > 0 || loading)
                    return;
                handleResendOtp();
            }}>
              <react_1.Icon icon="mdi:refresh" className="me-1"/>
              {resendCooldown > 0
                ? `${t("Resend OTP in")} ${resendCooldown}s`
                : t("Resend OTP")}
            </span>
          </span>)}
      </div>
    </div>);
};
exports.TwoFactorForm = (0, react_2.memo)(TwoFactorFormBase);
