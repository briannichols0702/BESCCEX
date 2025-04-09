"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerificationForm = void 0;
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const Input_1 = __importDefault(require("@/components/elements/form/input/Input"));
const react_1 = require("react");
const next_i18next_1 = require("next-i18next");
const login_1 = require("@/stores/auth/login");
const router_1 = require("next/router");
const VerificationFormBase = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const { verificationCode, setVerificationCode, handleVerificationSubmit, loading, } = (0, login_1.useLoginStore)();
    const router = (0, router_1.useRouter)();
    return (<div>
      <div className="flex flex-col gap-4">
        <Input_1.default icon="lucide:lock" label={t("Verification Code")} color="contrast" placeholder={t("Enter verification code")} value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)}/>
      </div>

      <div className="mt-6">
        <Button_1.default color="primary" size="md" className="w-full" loading={loading} disabled={loading} onClick={() => {
            handleVerificationSubmit(router);
        }}>
          {t("Verify Email")}
        </Button_1.default>
      </div>
    </div>);
};
exports.VerificationForm = (0, react_1.memo)(VerificationFormBase);
