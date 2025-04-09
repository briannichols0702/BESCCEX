"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginForms = exports.googleClientId = void 0;
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const Checkbox_1 = __importDefault(require("@/components/elements/form/checkbox/Checkbox"));
const Input_1 = __importDefault(require("@/components/elements/form/input/Input"));
const react_1 = require("@iconify/react");
const link_1 = __importDefault(require("next/link"));
const react_2 = require("react");
const next_i18next_1 = require("next-i18next");
const login_1 = require("@/stores/auth/login");
const router_1 = require("next/router");
const GoogleAuth_1 = require("./GoogleAuth");
const google_1 = require("@react-oauth/google");
const googleAuthStatus = process.env.NEXT_PUBLIC_GOOGLE_AUTH_STATUS === "true" || false;
exports.googleClientId = process.env
    .NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const LoginFormsBase = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const { email, setEmail, password, setPassword, handleSubmit, loading, errors, } = (0, login_1.useLoginStore)();
    const [showPassword, setShowPassword] = (0, react_2.useState)(false); // New state for password visibility
    const router = (0, router_1.useRouter)();
    return (<>
      {exports.googleClientId && googleAuthStatus && (<>
          <google_1.GoogleOAuthProvider clientId={exports.googleClientId}>
            <GoogleAuth_1.GoogleAuth />
          </google_1.GoogleOAuthProvider>
          <div className="relative">
            <hr className="my-8 w-full border-muted-300 dark:border-muted-800"/>
            <div className="absolute inset-x-0 -top-3 mx-auto text-center">
              <span className="bg-white px-4 py-1 font-sans text-sm text-muted-400 dark:bg-muted-900">
                {t("or sign in with email")}
              </span>
            </div>
          </div>
        </>)}
      <div>
        <div className="space-y-4">
          <Input_1.default icon="lucide:mail" label={t("Email address")} color="muted" placeholder={t("ex: johndoe@gmail.com")} value={email} onChange={(e) => setEmail(e.target.value)} error={errors["email"]}/>

          <div className="relative">
            <Input_1.default type={showPassword ? "text" : "password"} // Conditionally change the input type
     icon="lucide:lock" label={t("Password")} color="muted" placeholder="" value={password} onChange={(e) => setPassword(e.target.value)} error={errors["password"]}/>
            <button type="button" className="absolute right-4 top-[34px] font-sans" // Adjust the position as needed
     onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
    >
              <react_1.Icon icon={showPassword ? "lucide:eye" : "lucide:eye-off"} className="w-4 h-4 text-muted-400 hover:text-primary-500 dark:text-muted-500 dark:hover:text-primary-500"/>
            </button>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center">
            <Checkbox_1.default id="remember-me" label={t("Remember me")} shape="full" color="primary"/>
          </div>

          <div className="text-sm leading-5">
            <link_1.default href="/forgot" className="font-medium text-primary-600 underline-offset-4 transition duration-150 ease-in-out hover:text-primary-500 hover:underline focus:underline focus:outline-hidden">
              {t("Forgot your password")}
            </link_1.default>
          </div>
        </div>

        <div className="mt-6">
          <Button_1.default color="primary" size="md" className="w-full" loading={loading} disabled={loading} onClick={() => handleSubmit(router)}>
            {t("Sign in")}
          </Button_1.default>
        </div>
      </div>

      <hr className="my-6 w-full border-muted-300 dark:border-muted-800"/>

      <p className="mt-8 space-x-2 font-sans text-sm leading-5 text-muted-600 dark:text-muted-400">
        <span>{t("Need an account")}</span>
        <link_1.default href="/register" className="font-medium text-primary-600 underline-offset-4 transition duration-150 ease-in-out hover:text-primary-500 hover:underline focus:underline focus:outline-hidden">
          {t("Create an account")}
        </link_1.default>
      </p>
    </>);
};
exports.LoginForms = (0, react_2.memo)(LoginFormsBase);
