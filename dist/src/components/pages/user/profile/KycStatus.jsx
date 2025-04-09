"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KycStatus = void 0;
const react_1 = require("react");
const router_1 = require("next/router");
const Card_1 = __importDefault(require("@/components/elements/base/card/Card"));
const react_2 = require("@iconify/react");
const api_1 = __importDefault(require("@/utils/api"));
const Faq_1 = require("@/components/pages/knowledgeBase/Faq");
const ButtonLink_1 = __importDefault(require("@/components/elements/base/button-link/ButtonLink"));
const dashboard_1 = require("@/stores/dashboard");
const next_i18next_1 = require("next-i18next");
const lodash_1 = require("lodash");
const statusClassMap = {
    APPROVED: "text-success-700 bg-success-100 border border-success-300 rounded-lg dark:bg-muted-900 dark:border-success-800 dark:text-success-400",
    PENDING: "text-info-700 bg-info-100 border border-info-300 rounded-lg dark:bg-muted-900 dark:border-info-800 dark:text-info-400",
    REJECTED: "text-danger-700 bg-danger-100 border border-danger-300 rounded-lg dark:bg-muted-900 dark:border-danger-800 dark:text-danger-400",
    MUTED: "text-muted-900 bg-muted-100 border border-muted-300 rounded-lg dark:bg-muted-900 dark:border-muted-700 dark:text-muted-400",
};
const IdentityVerification = () => {
    var _a, _b, _c, _d;
    const { t } = (0, next_i18next_1.useTranslation)();
    const { profile } = (0, dashboard_1.useDashboardStore)();
    const router = (0, router_1.useRouter)();
    const [lastLevel, setLastLevel] = (0, react_1.useState)(0);
    const [level, setLevel] = (0, react_1.useState)(0);
    const [statusClass, setStatusClass] = (0, react_1.useState)(statusClassMap["MUTED"]);
    const [statusIcon, setStatusIcon] = (0, react_1.useState)("");
    const checkStatus = async () => {
        var _a, _b;
        const kycLevel = parseInt(((_a = profile === null || profile === void 0 ? void 0 : profile.kyc) === null || _a === void 0 ? void 0 : _a.level) || "0");
        setLevel(kycLevel);
        setStatusClass(statusClassMap[((_b = profile === null || profile === void 0 ? void 0 : profile.kyc) === null || _b === void 0 ? void 0 : _b.status) || "MUTED"]);
        setStatusIcon(() => {
            var _a;
            switch ((_a = profile === null || profile === void 0 ? void 0 : profile.kyc) === null || _a === void 0 ? void 0 : _a.status) {
                case "APPROVED":
                    return "line-md:confirm";
                case "PENDING":
                    return "line-md:loading-alt-loop";
                case "REJECTED":
                    return "line-md:close";
                default:
                    return "";
            }
        });
    };
    const fetchActiveKycTemplate = async () => {
        const { data, error } = await (0, api_1.default)({
            url: "/api/user/kyc/template",
            silent: true,
        });
        if (!error) {
            const options = JSON.parse(data.options);
            const customFields = JSON.parse(data.customOptions);
            updateLastLevel({ ...options, ...customFields });
        }
    };
    const debouncedFetchActiveKycTemplate = (0, lodash_1.debounce)(fetchActiveKycTemplate, 100);
    (0, react_1.useEffect)(() => {
        if (router.isReady && profile) {
            checkStatus();
            debouncedFetchActiveKycTemplate();
        }
    }, [router.isReady, profile]);
    const updateLastLevel = (fields) => {
        let maxLevel = 0;
        for (const key in fields) {
            if (fields[key].enabled && parseInt(fields[key].level) > maxLevel) {
                maxLevel = parseInt(fields[key].level);
            }
        }
        setLastLevel(maxLevel);
    };
    const getKycApplicationRoute = (state) => {
        return `/user/profile/kyc?state=${state}&l=${level + (state === "new" ? 1 : 0)}`;
    };
    const verificationLevel = lastLevel > level ? `Verified Level ${level + 1}` : "Verified";
    const kycDesc = (profile === null || profile === void 0 ? void 0 : profile.kyc)
        ? t("Verify your identity to participate in our platform.")
        : t("To comply with regulations, each participant is required to go through identity verification (KYC/AML) to prevent fraud, money laundering operations, transactions banned under the sanctions regime, or those which fund terrorism. Please complete our fast and secure verification process to participate in our platform.");
    const computedLevels = Array.from({ length: lastLevel }, (_, i) => {
        const currentLevel = i + 1;
        return {
            id: currentLevel,
            level: currentLevel,
            name: ["Verified", "Verified Plus", "Verified Pro"][i],
            cssClass: level >= currentLevel
                ? level === currentLevel
                    ? statusClass
                    : statusClassMap["APPROVED"]
                : statusClassMap["MUTED"],
            icon: level >= currentLevel
                ? level === currentLevel
                    ? statusIcon
                    : "line-md:confirm"
                : "",
            showStatus: level >= currentLevel,
        };
    });
    return (<>
      <div className="mx-auto text-muted-800 dark:text-muted-200">
        <div className="grid gap-5 xs:grid-cols-1 md:grid-cols-3">
          <div className="xs:col-span-1 md:col-span-2">
            <div className="text-muted-800 dark:text-muted-200 py-5">
              <p className="text-lg">{kycDesc}</p>
            </div>
            <div className="mx-auto">
              {!(profile === null || profile === void 0 ? void 0 : profile.kyc) ||
            (level === 0 && ((_a = profile === null || profile === void 0 ? void 0 : profile.kyc) === null || _a === void 0 ? void 0 : _a.status) !== "PENDING") ? (<Card_1.default className="px-5 py-10 text-center border-muted-500 rounded-sm" color={"contrast"}>
                  <div className="flex flex-col justify-center items-center">
                    <div className="bg-muted-200 text-muted-600 dark:text-muted-300 dark:bg-muted-800 p-4 rounded-full">
                      <react_2.Icon icon="system-uicons:files-multi" className="h-10 w-10"/>
                    </div>
                    <span className="text-muted-700 dark:text-muted-300 text-2xl font-medium my-5">
                      {t("You have not submitted your necessary documents to verify your identity. In order to trade in our platform, please verify your identity.")}
                    </span>
                    <p className="text-md">
                      {t("It would be great if you could submit the form. If you have any questions, please feel free to contact our support team.")}
                    </p>
                    <ButtonLink_1.default href={getKycApplicationRoute("new")} color="primary" className="mt-5">
                      {t("Click here to complete your KYC")}
                    </ButtonLink_1.default>
                  </div>
                </Card_1.default>) : ((_b = profile === null || profile === void 0 ? void 0 : profile.kyc) === null || _b === void 0 ? void 0 : _b.status) === "PENDING" ? (<Card_1.default className="px-5 py-10 text-center border-info rounded-sm flex items-center" color={"contrast"}>
                  <div className="flex flex-col justify-center items-center">
                    <div className="bg-info-100 text-info-700 dark:text-info-400 dark:bg-muted-800 p-4 rounded-full mb-5">
                      <react_2.Icon icon="line-md:loading-alt-loop" className="h-16 w-16"/>
                    </div>
                    <span className="text-info-500 text-2xl font-medium mb-5">
                      {t("Your identity verification is processing.")}
                    </span>
                    <p className="text-md">
                      {t("We are still working on your identity verification. Once our team verifies your identity, you will be notified by email.")}
                    </p>
                  </div>
                </Card_1.default>) : ((_c = profile === null || profile === void 0 ? void 0 : profile.kyc) === null || _c === void 0 ? void 0 : _c.status) === "REJECTED" ? (<Card_1.default className="px-5 py-10 text-center border-warning rounded-sm" color={"contrast"}>
                  <div className="flex flex-col justify-center items-center">
                    <div className="bg-danger-100 text-danger-700 dark:text-danger-400 dark:bg-muted-800 p-4 rounded-full mb-5">
                      <react_2.Icon icon="line-md:alert" className="h-12 w-12"/>
                    </div>
                    <span className="text-danger-500 text-2xl font-medium mb-5">
                      {t("Sorry! Your application was rejected.")}
                    </span>
                    <p className="text-md">
                      {t("In our verification process, we found information that is incorrect or missing. Please resubmit the form. In case of any issues with the submission, please contact our support team.")}
                    </p>
                    <ButtonLink_1.default href={getKycApplicationRoute("resubmit")} color="primary" className="mt-5">
                      {t("Submit Again")}
                    </ButtonLink_1.default>
                  </div>
                </Card_1.default>) : ((_d = profile === null || profile === void 0 ? void 0 : profile.kyc) === null || _d === void 0 ? void 0 : _d.status) === "APPROVED" ? (<Card_1.default className="px-5 py-10 text-center border-success rounded-sm" color={"contrast"}>
                  <div className="flex flex-col justify-center items-center">
                    <div className="bg-success-100 text-success-700 dark:text-success-400 dark:bg-muted-800 p-4 rounded-full mb-5">
                      <react_2.Icon icon="fluent:shield-task-28-regular" className="h-16 w-16"/>
                    </div>
                    <span className="text-success-500 text-2xl font-medium mb-5">
                      {t("Your identity has been verified successfully.")}
                    </span>
                    <p>
                      {t("One of our team members has verified your identity. Now you can participate in our platform. Thank you.")}
                    </p>
                    {lastLevel > level && (<ButtonLink_1.default href={`/user/profile/kyc?state=new&l=${level + 1}`} color="primary" className="mt-5">
                        {t("Get")} {verificationLevel}
                      </ButtonLink_1.default>)}
                  </div>
                </Card_1.default>) : null}
            </div>
          </div>
          <Card_1.default className="p-5" color={"mutedContrast"}>
            <h4 className="mb-2 text-lg">{t("Verification Levels")}</h4>
            <ul className="space-y-4">
              {computedLevels.map((item) => (<li key={item.id}>
                  <Card_1.default className={`w-full p-4 ${item.cssClass}`} role="alert">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">
                        {item.level}. {item.name}
                      </h3>
                      {item.showStatus && (<react_2.Icon icon={item.icon} color="currentColor" className="h-5 w-5 text-muted-400"/>)}
                    </div>
                  </Card_1.default>
                </li>))}
            </ul>
          </Card_1.default>
        </div>
      </div>
      <Faq_1.Faq category="KYC"/>
    </>);
};
exports.KycStatus = IdentityVerification;
