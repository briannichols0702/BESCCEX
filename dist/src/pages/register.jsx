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
const router_1 = require("next/router");
const next_i18next_1 = require("next-i18next");
const google_1 = require("@react-oauth/google");
const Minimal_1 = __importDefault(require("@/layouts/Minimal"));
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const Input_1 = __importDefault(require("@/components/elements/form/input/Input"));
const LogoText_1 = __importDefault(require("@/components/vector/LogoText"));
const ThemeSwitcher_1 = __importDefault(require("@/components/widgets/ThemeSwitcher"));
const Heading_1 = __importDefault(require("@/components/elements/base/heading/Heading"));
const Paragraph_1 = __importDefault(require("@/components/elements/base/paragraph/Paragraph"));
const ButtonLink_1 = __importDefault(require("@/components/elements/base/button-link/ButtonLink"));
const Alert_1 = __importDefault(require("@/components/elements/base/alert/Alert"));
const Checkbox_1 = __importDefault(require("@/components/elements/form/checkbox/Checkbox"));
const api_1 = __importDefault(require("@/utils/api"));
const dashboard_1 = require("@/stores/dashboard");
const link_1 = __importDefault(require("next/link"));
const react_2 = require("@iconify/react");
const GoogleLoginButton_1 = __importDefault(require("@/components/pages/auth/GoogleLoginButton"));
const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const hasGoogleClientId = googleClientId && googleClientId !== "";
const defaultUserPath = process.env.NEXT_PUBLIC_DEFAULT_USER_PATH || "/user";
function validatePassword(password) {
    return {
        "Has at least 8 characters": password.length >= 8,
        "Has uppercase letters": /[A-Z]/.test(password),
        "Has lowercase letters": /[a-z]/.test(password),
        "Has numbers": /\d/.test(password),
        "Has non-alphanumeric characters": /\W/.test(password),
    };
}
function PasswordValidation({ password }) {
    const conditions = validatePassword(password);
    const isValid = Object.values(conditions).every(Boolean);
    return (<Alert_1.default color={isValid ? "success" : "danger"} className="text-sm" canClose={false}>
      <div className="flex flex-col gap-1">
        {Object.entries(conditions).map(([condition, valid], index) => (<div key={index} className={`flex gap-2 items-center ${valid ? "text-green-500" : "text-red-500"}`}>
            <react_2.Icon icon={valid ? "mdi:check-bold" : "mdi:close-thick"}/>
            {condition}
          </div>))}
      </div>
    </Alert_1.default>);
}
function Register() {
    const { t } = (0, next_i18next_1.useTranslation)();
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [firstName, setFirstName] = (0, react_1.useState)("");
    const [lastName, setLastName] = (0, react_1.useState)("");
    const [email, setEmail] = (0, react_1.useState)("");
    const [password, setPassword] = (0, react_1.useState)("");
    const [referral, setReferral] = (0, react_1.useState)("");
    const [isVerificationStep, setIsVerificationStep] = (0, react_1.useState)(false);
    const [verificationCode, setVerificationCode] = (0, react_1.useState)("");
    const [isPasswordValid, setIsPasswordValid] = (0, react_1.useState)(false);
    const [showPassword, setShowPassword] = (0, react_1.useState)(false);
    const [isPasswordTyped, setIsPasswordTyped] = (0, react_1.useState)(false);
    const [acceptedTerms, setAcceptedTerms] = (0, react_1.useState)(false);
    const { setIsFetched, fetchProfile } = (0, dashboard_1.useDashboardStore)();
    const router = (0, router_1.useRouter)();
    const { ref, token } = router.query;
    (0, react_1.useEffect)(() => {
        if (router.query.ref) {
            setReferral(ref);
        }
        if (router.query.token) {
            setVerificationCode(token);
            handleVerificationSubmit(token);
        }
    }, [router.query]);
    (0, react_1.useEffect)(() => {
        setIsPasswordValid(Object.values(validatePassword(password)).every(Boolean));
    }, [password]);
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        if (!isPasswordTyped) {
            setIsPasswordTyped(true);
        }
    };
    const [errors, setErrors] = (0, react_1.useState)({});
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const { data, error, validationErrors } = await (0, api_1.default)({
            url: "/api/auth/register",
            method: "POST",
            body: { firstName, lastName, email, password, ref: referral },
        });
        setLoading(false);
        if (validationErrors) {
            setErrors(validationErrors);
            return;
        }
        if (data && !error) {
            if (process.env.NEXT_PUBLIC_VERIFY_EMAIL_STATUS === "true") {
                setIsVerificationStep(true);
            }
            else {
                setIsFetched(false);
                await fetchProfile();
                router.push(defaultUserPath);
            }
        }
    };
    const handleGoogleSuccess = async (tokenResponse) => {
        const { access_token } = tokenResponse;
        const { data, error } = await (0, api_1.default)({
            url: "/api/auth/register/google",
            method: "POST",
            body: { token: access_token, ref: referral },
        });
        if (data && !error) {
            setIsFetched(false);
            await fetchProfile();
            router.push(defaultUserPath);
        }
    };
    const handleGoogleError = (errorResponse) => {
        console.error("Google login failed", errorResponse);
    };
    const handleVerificationSubmit = async (verificationToken) => {
        setLoading(true);
        const tokenToVerify = verificationToken || verificationCode;
        const { data, error } = await (0, api_1.default)({
            url: "/api/auth/verify/email",
            method: "POST",
            body: { token: tokenToVerify },
        });
        setLoading(false);
        if (data && !error) {
            setIsFetched(false);
            await fetchProfile();
            router.push(defaultUserPath);
        }
    };
    return (<Minimal_1.default title={t("Register")} color="muted">
      <main className="relative min-h-screen">
        <div className="flex h-screen flex-col items-center bg-white dark:bg-muted-900 md:flex-row">
          <div className="hidden h-screen w-full bg-indigo-600 md:w-1/2 lg:flex xl:w-2/3 from-primary-900 to-primary-500 i group relative items-center justify-around overflow-hidden bg-linear-to-tr md:flex">
            <div className="mx-auto max-w-xs text-center">
              <Heading_1.default as="h2" weight="medium" className="text-white">
                {t("Have an Account")}?
              </Heading_1.default>
              <Paragraph_1.default size="sm" className="text-muted-200 mb-3">
                {t("No need to waste time on this page, let's take you back to your account")}
              </Paragraph_1.default>
              <ButtonLink_1.default href="/login" shape="curved" className="w-full">
                {t("Login to Account")}
              </ButtonLink_1.default>
            </div>
            {/* Additional decorative elements */}
          </div>

          <div className="relative flex h-screen w-full items-center justify-center bg-white px-6 dark:bg-muted-900 md:mx-auto md:w-1/2 md:max-w-md lg:max-w-full lg:px-16 xl:w-1/3 xl:px-12">
            <div className="absolute inset-x-0 top-6 mx-auto w-full max-w-sm px-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <link_1.default href="/">
                    <LogoText_1.default className="h-6 text-primary-500"/>
                  </link_1.default>
                </div>
                <div className="flex items-center justify-end">
                  <ThemeSwitcher_1.default />
                </div>
              </div>
            </div>
            <div className="mx-auto w-full max-w-sm px-4">
              <h1 className="mt-12 mb-6 font-sans text-2xl font-light leading-9 text-muted-800 dark:text-muted-100">
                {isVerificationStep
            ? t("Verify your email")
            : t("Create a new account")}
              </h1>

              {isVerificationStep ? (<form className="mt-6" onSubmit={(e) => {
                e.preventDefault();
                handleVerificationSubmit();
            }} method="POST">
                  <div className="flex flex-col gap-4">
                    <Input_1.default icon="lucide:lock" label={t("Verification Code")} color="contrast" placeholder={t("Enter verification code")} value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)}/>
                  </div>

                  <div className="mt-6">
                    <Button_1.default type="submit" color="primary" size="md" className="w-full" loading={loading} disabled={loading}>
                      {t("Verify Email")}
                    </Button_1.default>
                  </div>
                </form>) : (<>
                  {hasGoogleClientId && (<google_1.GoogleOAuthProvider clientId={googleClientId}>
                      <GoogleLoginButton_1.default onSuccess={handleGoogleSuccess} onError={handleGoogleError}/>
                    </google_1.GoogleOAuthProvider>)}

                  <form className="mt-6" onSubmit={handleSubmit} method="POST">
                    <div className="flex flex-col gap-4">
                      <div className="flex gap-4">
                        <Input_1.default autoComplete="given-name" label={t("First Name")} color="contrast" placeholder={t("John")} value={firstName} onChange={(e) => setFirstName(e.target.value)} error={errors.firstName}/>

                        <Input_1.default autoComplete="family-name" label={t("Last Name")} color="contrast" placeholder={t("Doe")} value={lastName} onChange={(e) => setLastName(e.target.value)} error={errors.lastName}/>
                      </div>
                      <Input_1.default type="email" icon="lucide:mail" label={t("Email address")} color="contrast" placeholder={t("ex: johndoe@gmail.com")} value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email}/>

                      <div className="relative">
                        <Input_1.default type={showPassword ? "text" : "password"} icon="lucide:lock" label={t("Password")} color="contrast" placeholder="" value={password} onChange={handlePasswordChange} error={errors.password}/>
                        <button type="button" className="absolute right-4 top-[34px] font-sans" onClick={() => setShowPassword(!showPassword)}>
                          <react_2.Icon icon={showPassword ? "lucide:eye" : "lucide:eye-off"} className="w-4 h-4 text-muted-400 hover:text-primary-500 dark:text-muted-500 dark:hover:text-primary-500"/>
                        </button>
                      </div>
                      {isPasswordTyped && (<PasswordValidation password={password}/>)}
                      {referral && (<Input_1.default label={t("Referral Code")} color="contrast" placeholder={t("Referral code")} value={referral} onChange={(e) => setReferral(e.target.value)} readOnly error={errors.ref}/>)}
                    </div>

                    <div className="flex items-center mt-4">
                      <Checkbox_1.default type="checkbox" id="terms" label={<>
                            {t("I accept the")}{" "}
                            <link_1.default href="/terms-and-conditions" className="font-medium text-primary-600 underline-offset-4 transition duration-150 ease-in-out hover:text-primary-500 hover:underline focus:underline focus:outline-hidden">
                              {t("Terms and Conditions")}
                            </link_1.default>
                          </>} checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} color="primary"/>
                    </div>

                    <div className="mt-6">
                      <Button_1.default type="submit" color="primary" size="md" className="w-full" loading={loading} disabled={loading || !isPasswordValid || !acceptedTerms}>
                        {t("Sign up")}
                      </Button_1.default>
                    </div>
                  </form>

                  <hr className="my-8 w-full border-muted-300 dark:border-muted-800"/>

                  <p className="mt-8 space-x-2 font-sans text-sm leading-5 text-muted-600 dark:text-muted-400">
                    <span>{t("Already have an account?")}</span>
                    <link_1.default href="/login" className="font-medium text-primary-600 underline-offset-4 transition duration-150 ease-in-out hover:text-primary-500 hover:underline focus:underline focus:outline-hidden">
                      {t("Log in")}
                    </link_1.default>
                  </p>
                </>)}
            </div>
          </div>
        </div>
      </main>
    </Minimal_1.default>);
}
exports.default = Register;
