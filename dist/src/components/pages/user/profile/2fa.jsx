"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwoFactor = void 0;
const react_1 = require("react");
const router_1 = require("next/router");
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const Card_1 = __importDefault(require("@/components/elements/base/card/Card"));
const Input_1 = __importDefault(require("@/components/elements/form/input/Input"));
const next_i18next_1 = require("next-i18next");
const api_1 = __importDefault(require("@/utils/api"));
const sonner_1 = require("sonner");
const link_1 = __importDefault(require("next/link"));
const MashImage_1 = require("@/components/elements/MashImage");
const react_2 = require("@iconify/react");
const lottie_1 = require("@/components/elements/base/lottie");
const dashboard_1 = require("@/stores/dashboard");
const IconButton_1 = __importDefault(require("@/components/elements/base/button-icon/IconButton"));
const Tooltip_1 = require("@/components/elements/base/tooltips/Tooltip");
const TwoFactorBase = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const { profile, updateProfile2FA, setIsFetched, settings } = (0, dashboard_1.useDashboardStore)();
    const router = (0, router_1.useRouter)();
    const [otp, setOtp] = (0, react_1.useState)("");
    const [secret, setSecret] = (0, react_1.useState)("");
    const [isSubmitting, setIsSubmitting] = (0, react_1.useState)(false);
    const [isResending, setIsResending] = (0, react_1.useState)(false);
    const [isGenerating, setIsGenerating] = (0, react_1.useState)(false);
    const [step, setStep] = (0, react_1.useState)(1);
    const [type, setType] = (0, react_1.useState)(""); // No default type initially
    const [phoneNumber, setPhoneNumber] = (0, react_1.useState)("");
    const [qrCode, setQrCode] = (0, react_1.useState)(""); // For APP type
    const [sentOtpType, setSentOtpType] = (0, react_1.useState)(""); // For SMS and EMAIL types
    const handleGenerateOtp = async (selectedType) => {
        setType(selectedType);
        const requestBody = { type: selectedType };
        if (selectedType === "SMS")
            requestBody.phoneNumber = phoneNumber;
        setIsGenerating(true);
        const { data, error, validationErrors } = await (0, api_1.default)({
            url: "/api/auth/otp/generate",
            method: "POST",
            body: requestBody,
            silent: selectedType === "APP",
        });
        if (data && !error) {
            setSecret(data.secret);
            if (data.qrCode)
                setQrCode(data.qrCode);
            if (["SMS"].includes(type))
                setSentOtpType(type);
            setStep(2);
        }
        else {
            if (validationErrors) {
                for (const key in validationErrors) {
                    sonner_1.toast.error(validationErrors[key]);
                }
            }
        }
        setIsGenerating(false);
    };
    const handleResendOtp = async () => {
        setIsResending(true);
        const { data, error } = await (0, api_1.default)({
            url: "/api/auth/otp/resend",
            method: "POST",
            body: { id: profile.id, secret, type },
        });
        setIsResending(false);
    };
    const handleVerifyOtp = async () => {
        if (!otp) {
            sonner_1.toast.error(t("Please enter the OTP"));
            return;
        }
        setIsSubmitting(true);
        const { data, error } = await (0, api_1.default)({
            url: "/api/auth/otp/verify",
            method: "POST",
            body: { otp, secret, type },
            silent: false,
        });
        setIsSubmitting(false);
        if (data && !error) {
            setIsFetched(false);
            router.push("/user");
        }
    };
    const handleToggleOtp = async (status) => {
        setIsSubmitting(true);
        updateProfile2FA(status);
        setIsSubmitting(false);
    };
    // Map methodType to Lottie config keys
    const getLottieKeyForType = (methodType) => {
        switch (methodType) {
            case "APP":
                return "appVerificationLottie";
            case "SMS":
                return "mobileVerificationLottie";
            case "EMAIL":
                return "emailVerificationLottie";
            default:
                return "";
        }
    };
    const renderCard = (methodType, path, text, handleClick) => {
        var _a, _b;
        const enabledType = ((_a = profile === null || profile === void 0 ? void 0 : profile.twoFactor) === null || _a === void 0 ? void 0 : _a.type) || "";
        const status = ((_b = profile === null || profile === void 0 ? void 0 : profile.twoFactor) === null || _b === void 0 ? void 0 : _b.enabled) || false;
        const lottieKey = getLottieKeyForType(methodType);
        const isLottieEnabled = (settings === null || settings === void 0 ? void 0 : settings.lottieAnimationStatus) === "true" &&
            (settings === null || settings === void 0 ? void 0 : settings[`${lottieKey}Enabled`]) === "true";
        const lottieFile = settings === null || settings === void 0 ? void 0 : settings[`${lottieKey}File`];
        return (<Card_1.default shape="smooth" key={methodType} color={enabledType === methodType
                ? status
                    ? "success"
                    : "danger"
                : "contrast"} className={`p-6 flex flex-col items-center ${enabledType === methodType || isGenerating
                ? "cursor-not-allowed relative"
                : "cursor-pointer"}`} onClick={enabledType === methodType || isGenerating ? null : handleClick}>
        {enabledType === methodType && (<div className="absolute top-0 right-0 mt-2 mr-2">
            <Tooltip_1.Tooltip content={status ? t("Disable 2FA") : t("Enable 2FA")}>
              <IconButton_1.default type="button" color={status ? "danger" : "success"} variant="outlined" shadow={status ? "danger" : "success"} size="sm" onClick={() => handleToggleOtp(!status)} disabled={isGenerating}>
                <react_2.Icon icon={status ? "mdi:close" : "mdi:check"} className="w-4 h-4"/>
              </IconButton_1.default>
            </Tooltip_1.Tooltip>
          </div>)}

        {/* Conditional logic to render Lottie or fallback image */}
        {isLottieEnabled ? (<lottie_1.Lottie category="otp" path={path} classNames="mx-auto max-w-[160px]" max={path === "mobile-verfication" ? 2 : undefined}/>) : lottieFile ? (<img src={lottieFile} alt={`${methodType} Verification`} className="mx-auto max-w-[160px] object-contain p-5"/>) : null}

        <p className="text-center text-sm text-muted-800 dark:text-muted-200 mb-4">
          {t(text)}
        </p>
      </Card_1.default>);
    };
    const render2FACards = () => {
        const methods = [];
        if (process.env.NEXT_PUBLIC_2FA_APP_STATUS === "true") {
            methods.push(renderCard("APP", "app-verfication", "Google Authenticator", () => handleGenerateOtp("APP")));
        }
        if (process.env.NEXT_PUBLIC_2FA_SMS_STATUS === "true") {
            methods.push(renderCard("SMS", "mobile-verfication", "Receive OTP via SMS", () => {
                setType("SMS");
                setStep(2);
            }));
        }
        if (process.env.NEXT_PUBLIC_2FA_EMAIL_STATUS === "true") {
            methods.push(renderCard("EMAIL", "email-verfication", "Receive OTP via Email", () => handleGenerateOtp("EMAIL")));
        }
        return (<div className="flex justify-center">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 lg:grid-cols-3">
          {methods}
        </div>
      </div>);
    };
    if (isGenerating) {
        return (<div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center space-y-4">
          <react_2.Icon icon="mdi:loading" className="h-12 w-12 animate-spin text-primary-500"/>
          <p className="text-xl text-primary-500">{t("Generating OTP...")}</p>
        </div>
      </div>);
    }
    return (<>
      <div className="flex grow items-center px-6 py-12 md:px-12">
        <div className="container">
          <div className="columns flex items-center">
            <div className="shrink grow md:p-3">
              <div className="mx-auto -mt-10 mb-6 max-w-[420px] text-center font-sans">
                <h1 className="mb-2 text-center font-sans text-3xl font-light leading-tight text-muted-800 dark:text-muted-100">
                  {t("Enable Two-Factor Authentication")}
                </h1>
                <p className="text-center text-sm text-muted-500">
                  {step === 1
            ? t("Choose the type of 2FA to enable")
            : t("Enter the OTP sent to your phone to enable 2FA")}
                </p>
              </div>

              {step === 1 ? (render2FACards()) : (<Card_1.default shape="smooth" color="contrast" className="mx-auto max-w-[420px] p-6 md:p-8 lg:p-10 flex flex-col gap-4">
                  {type === "APP" && qrCode && (<div className="text-center">
                      <div className="flex justify-center p-4">
                        <MashImage_1.MashImage src={qrCode} alt="QR Code" width={250} height={250}/>
                      </div>
                      <p className="text-muted-500">
                        {t("Scan this QR code with your authenticator app")}
                      </p>
                    </div>)}
                  {type === "SMS" && (<div>
                      <Input_1.default autoComplete="tel" icon="lucide:phone" color="default" size="lg" placeholder={t("Enter your phone number for SMS OTP")} label={t("Phone Number")} value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}/>
                    </div>)}
                  <Input_1.default icon="lucide:lock" color="default" size="lg" placeholder={t("Enter OTP")} label={t("OTP")} value={otp} onChange={(e) => setOtp(e.target.value)}/>

                  <div className="relative">
                    {type === "SMS" && !sentOtpType && (<div className="my-4">
                        <Button_1.default type="button" color="primary" variant="solid" shadow="primary" size="lg" className="w-full" onClick={() => handleGenerateOtp(type)} loading={isSubmitting} disabled={isSubmitting}>
                          {t("Send OTP")}
                        </Button_1.default>
                      </div>)}
                    {type === "SMS" &&
                sentOtpType === "SMS" &&
                phoneNumber &&
                otp && (<div className="my-4">
                          <Button_1.default type="button" color="primary" variant="solid" shadow="primary" size="lg" className="w-full" onClick={handleVerifyOtp} loading={isSubmitting} disabled={isSubmitting}>
                            {t("Verify OTP")}
                          </Button_1.default>
                        </div>)}
                    {["APP", "EMAIL"].includes(type) && (<div className="my-4">
                        <Button_1.default type="button" color="primary" variant="solid" shadow="primary" size="lg" className="w-full" onClick={handleVerifyOtp} loading={isSubmitting} disabled={isSubmitting}>
                          {t("Verify OTP")}
                        </Button_1.default>
                      </div>)}
                    {["EMAIL", "SMS"].includes(type) &&
                sentOtpType === type && (<div className="my-4">
                          <Button_1.default type="button" color="primary" variant="solid" shadow="primary" size="lg" className="w-full" onClick={handleResendOtp} loading={isResending} disabled={isResending}>
                            {t("Resend OTP")}
                          </Button_1.default>
                        </div>)}

                    <div className="text-center flex justify-between items-center mt-10">
                      <link_1.default className="text-sm text-muted-400 underline-offset-4 hover:text-primary-500 hover:underline flex items-center justify-center" href="/user/profile">
                        <react_2.Icon icon="mdi:cancel" className="mr-2"/>
                        {t("Cancel")}
                      </link_1.default>
                      <div className="text-sm text-muted-400 underline-offset-4 hover:text-primary-500 hover:underline flex items-center justify-center cursor-pointer" onClick={() => {
                setStep(1);
                setOtp("");
                setSecret("");
            }}>
                        <react_2.Icon icon="akar-icons:arrow-left" className="mr-2"/>
                        {t("Change Method")}
                      </div>
                    </div>
                  </div>
                </Card_1.default>)}

              <div className="mt-8 text-center">
                <p className="text-muted-500 text-sm">
                  {t("You can enable or disable 2FA at any time")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>);
};
exports.TwoFactor = TwoFactorBase;
