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
const Default_1 = __importDefault(require("@/layouts/Default"));
const react_1 = __importStar(require("react"));
const dashboard_1 = require("@/stores/dashboard");
const ReferralTree_1 = require("@/components/pages/affiliate/ReferralTree");
const HeaderCardImage_1 = require("@/components/widgets/HeaderCardImage");
const next_i18next_1 = require("next-i18next");
const router_1 = require("next/router");
const sonner_1 = require("sonner");
const Alert_1 = __importDefault(require("@/components/elements/base/alert/Alert"));
const copy_to_clipboard_1 = __importDefault(require("copy-to-clipboard")); // Import copy-to-clipboard
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const AffiliateDashboard = () => {
    var _a;
    const { t } = (0, next_i18next_1.useTranslation)();
    const { profile, getSetting } = (0, dashboard_1.useDashboardStore)();
    const router = (0, router_1.useRouter)();
    (0, react_1.useEffect)(() => {
        var _a, _b, _c;
        if (router.isReady &&
            getSetting("icoRestrictions") === "true" &&
            (!((_a = profile === null || profile === void 0 ? void 0 : profile.kyc) === null || _a === void 0 ? void 0 : _a.status) ||
                (parseFloat(((_b = profile === null || profile === void 0 ? void 0 : profile.kyc) === null || _b === void 0 ? void 0 : _b.level) || "0") < 2 &&
                    ((_c = profile === null || profile === void 0 ? void 0 : profile.kyc) === null || _c === void 0 ? void 0 : _c.status) !== "APPROVED"))) {
            router.push("/user/profile?tab=kyc");
            sonner_1.toast.error(t("Please complete your KYC to access affiliate dashboard"));
        }
    }, [router.isReady, (_a = profile === null || profile === void 0 ? void 0 : profile.kyc) === null || _a === void 0 ? void 0 : _a.status]);
    const referralLink = `${process.env.NEXT_PUBLIC_SITE_URL}/register?ref=${profile === null || profile === void 0 ? void 0 : profile.id}`;
    const handleCopyLink = () => {
        (0, copy_to_clipboard_1.default)(referralLink);
        sonner_1.toast.success(t("Referral link copied to clipboard!"));
    };
    return (<Default_1.default title={t("Affiliate")} color="muted">
      <div className="mb-5">
        <HeaderCardImage_1.HeaderCardImage title={t("Earn More With Our Referral Program")} description="Invite your friends and earn a commission for every trade they make." lottie={{
            category: "communications",
            path: "referral-marketing",
            max: 2,
            height: 220,
        }} link={`/user/affiliate/program`} linkLabel="Learn More" size="lg"/>
      </div>
      <Alert_1.default color="info" canClose={false} className="mb-5" icon="mdi-information-outline" label={t("Referral Link")} sublabel={<>
            {t("Share this link with your friends and earn a commission. Your referral link")}
            :{" "}
            <a href={referralLink} target="_blank" rel="noreferrer" className="underline">
              {referralLink}
            </a>
          </>} button={<Button_1.default animated={false} onClick={handleCopyLink} size={"sm"} color="primary">
            {t("Copy Link")}
          </Button_1.default>}/>
      <ReferralTree_1.ReferralTree id={profile === null || profile === void 0 ? void 0 : profile.id}/>
    </Default_1.default>);
};
exports.default = AffiliateDashboard;
