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
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const Input_1 = __importDefault(require("@/components/elements/form/input/Input"));
const next_i18next_1 = require("next-i18next");
const useLogout_1 = require("@/hooks/useLogout");
const api_1 = __importDefault(require("@/utils/api"));
const dashboard_1 = require("@/stores/dashboard");
const AccountDeletionPage = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const router = (0, router_1.useRouter)();
    const logout = (0, useLogout_1.useLogout)();
    const { profile } = (0, dashboard_1.useDashboardStore)();
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [step, setStep] = (0, react_1.useState)("warning");
    const [code, setCode] = (0, react_1.useState)("");
    const [error, setError] = (0, react_1.useState)(null);
    const handleRequestDeletion = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const { data, error } = await (0, api_1.default)({
                url: "/api/auth/delete",
                method: "POST",
                body: { email: profile === null || profile === void 0 ? void 0 : profile.email },
            });
            if (error) {
                setError(t("Failed to send deletion code. Please try again."));
            }
            else {
                setStep("verify");
            }
        }
        catch (e) {
            setError(t("Failed to send deletion code. Please try again."));
        }
        setIsLoading(false);
    };
    const handleVerifyAndDelete = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const { data, error } = await (0, api_1.default)({
                url: "/api/auth/delete/confirm",
                method: "POST",
                body: { email: profile === null || profile === void 0 ? void 0 : profile.email, token: code },
            });
            if (error) {
                setError(t("Invalid code or unable to delete account. Please try again."));
            }
            else {
                // Logout user after successful deletion
                logout();
                router.push("/");
            }
        }
        catch (e) {
            setError(t("Invalid code or unable to delete account. Please try again."));
        }
        setIsLoading(false);
    };
    return (<div className="mb-12 flex flex-col gap-4">
      {step === "warning" ? (<>
          <h2 className="text-xl font-bold text-muted-800 dark:text-muted-100">
            {t("Delete Your Account")}
          </h2>
          <p className="text-sm text-muted-500 dark:text-muted-400">
            {t("Deleting your account is permanent and will remove all your data. This action cannot be undone.")}
          </p>
          <p className="text-sm text-muted-500 dark:text-muted-400">
            {t("If you're sure, click the button below to request a deletion code.")}
          </p>
          <Button_1.default color="danger" onClick={handleRequestDeletion} loading={isLoading}>
            {t("Request Deletion Code")}
          </Button_1.default>
        </>) : (<>
          <h2 className="text-xl font-bold text-muted-800 dark:text-muted-100">
            {t("Confirm Account Deletion")}
          </h2>
          <p className="text-sm text-muted-500 dark:text-muted-400">
            {t("A code has been sent to your email. Enter it below to confirm account deletion.")}
          </p>
          <Input_1.default label={t("Deletion Code")} placeholder={t("Enter the code")} value={code} onChange={(e) => setCode(e.target.value)}/>
          {error && <p className="text-red-500 mt-2">{error}</p>}
          <div className="flex gap-4 mt-4">
            <Button_1.default color="default" onClick={() => router.push("/user/profile")}>
              {t("Cancel")}
            </Button_1.default>
            <Button_1.default color="danger" onClick={handleVerifyAndDelete} loading={isLoading}>
              {t("Confirm Deletion")}
            </Button_1.default>
          </div>
        </>)}
    </div>);
};
exports.default = AccountDeletionPage;
