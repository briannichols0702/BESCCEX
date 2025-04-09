"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const router_1 = require("next/router");
const link_1 = __importDefault(require("next/link"));
const Minimal_1 = __importDefault(require("@/layouts/Minimal"));
const MinimalHeader_1 = __importDefault(require("@/components/widgets/MinimalHeader"));
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const Card_1 = __importDefault(require("@/components/elements/base/card/Card"));
const Input_1 = __importDefault(require("@/components/elements/form/input/Input"));
const next_i18next_1 = require("next-i18next");
const api_1 = __importDefault(require("@/utils/api"));
const sonner_1 = require("sonner");
function PasswordReset() {
    const { t } = (0, next_i18next_1.useTranslation)();
    const router = (0, router_1.useRouter)();
    const { token } = router.query;
    const [newPassword, setNewPassword] = (0, react_1.useState)("");
    const [confirmPassword, setConfirmPassword] = (0, react_1.useState)("");
    const [isSubmitting, setIsSubmitting] = (0, react_1.useState)(false);
    const handleSubmit = async () => {
        if (!token) {
            sonner_1.toast.error(t("Invalid token"));
            return;
        }
        if (!newPassword || !confirmPassword) {
            sonner_1.toast.error(t("Please fill in all fields"));
            return;
        }
        if (newPassword !== confirmPassword) {
            sonner_1.toast.error(t("Passwords do not match"));
            return;
        }
        setIsSubmitting(true);
        const { data, error } = await (0, api_1.default)({
            url: "/api/auth/verify/reset",
            method: "POST",
            body: { token, newPassword },
            silent: false,
        });
        setIsSubmitting(false);
        if (data && !error) {
            router.push("/user");
        }
    };
    return (<Minimal_1.default title={`${t("Reset Password")}`} color="muted">
      <main className="relative min-h-screen">
        <MinimalHeader_1.default />
        <div className="flex min-h-screen flex-col items-stretch justify-between">
          <div className="flex grow items-center px-6 py-12 md:px-12">
            <div className="container">
              <div className="columns flex items-center">
                <div className="shrink grow md:p-3">
                  <div className="mx-auto -mt-10 mb-6 max-w-[420px] text-center font-sans">
                    <h1 className="mb-2 text-center font-sans text-3xl font-light leading-tight text-muted-800 dark:text-muted-100">{`${t("Reset Password")}`}</h1>
                    <p className="text-center text-sm text-muted-500">{`${t("Enter your new password")}`}</p>
                  </div>

                  <Card_1.default shape="smooth" color="contrast" className="mx-auto max-w-[420px] p-6 md:p-8 lg:p-10 flex flex-col gap-4">
                    <Input_1.default type="password" icon="lucide:lock" color="default" size="md" placeholder={`${t("New Password")}`} label={`${t("New Password")}`} value={newPassword} onChange={(e) => setNewPassword(e.target.value)}/>
                    <Input_1.default type="password" icon="lucide:lock" color="default" size="md" placeholder={`${t("Confirm Password")}`} label={`${t("Confirm Password")}`} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
                    <div className="relative">
                      <div className="my-4 ">
                        <Button_1.default type="button" color="primary" variant="solid" shadow="primary" size="md" className="w-full" onClick={handleSubmit} loading={isSubmitting} disabled={isSubmitting}>{`${t("Reset Password")}`}</Button_1.default>
                      </div>
                      <div className="text-center">
                        <link_1.default className="text-sm text-muted-400 underline-offset-4 hover:text-primary-500 hover:underline" href="/login">{`${t("Back to Login")}`}</link_1.default>
                      </div>
                    </div>
                  </Card_1.default>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Minimal_1.default>);
}
exports.default = PasswordReset;
