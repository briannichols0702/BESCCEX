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
exports.permission = void 0;
const react_1 = __importStar(require("react"));
const router_1 = require("next/router");
const Default_1 = __importDefault(require("@/layouts/Default"));
const dashboard_1 = require("@/stores/dashboard");
const BackButton_1 = require("@/components/elements/base/button/BackButton");
const api_1 = __importDefault(require("@/utils/api"));
const upload_1 = require("@/utils/upload");
const next_i18next_1 = require("next-i18next");
const Tabs_1 = __importDefault(require("@/components/pages/admin/settings/Tabs"));
const General_1 = __importDefault(require("@/components/pages/admin/settings/section/General"));
const Restrictions_1 = __importDefault(require("@/components/pages/admin/settings/section/Restrictions"));
const Wallet_1 = __importDefault(require("@/components/pages/admin/settings/section/Wallet"));
const Logo_1 = __importDefault(require("@/components/pages/admin/settings/section/Logo"));
const Investment_1 = __importDefault(require("@/components/pages/admin/settings/section/Investment"));
const P2P_1 = __importDefault(require("@/components/pages/admin/settings/section/P2P"));
const Affiliate_1 = __importDefault(require("@/components/pages/admin/settings/section/Affiliate"));
const Social_1 = __importDefault(require("@/components/pages/admin/settings/section/Social"));
const Animations_1 = __importDefault(require("@/components/pages/admin/settings/section/Animations"));
const initialFormData = {
    blogPostLayout: "DEFAULT",
    mlmSystem: "DIRECT",
    binaryLevels: 2,
    unilevelLevels: 2,
    lottieAnimationStatus: true,
    mobileVerificationLottieEnabled: true,
    appVerificationLottieEnabled: true,
    emailVerificationLottieEnabled: true,
    loginLottieEnabled: true,
    investmentLottieEnabled: true,
    icoLottieEnabled: true,
    ecommerceLottieEnabled: true,
    affiliateLottieEnabled: true,
    binaryLottieEnabled: true,
    forexLottieEnabled: true,
    investmentPlansLottieEnabled: true,
    stakingLottieEnabled: true,
};
const SystemSettings = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const { settings, isFetched } = (0, dashboard_1.useDashboardStore)();
    const router = (0, router_1.useRouter)();
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [formData, setFormData] = (0, react_1.useState)(initialFormData);
    const [originalData, setOriginalData] = (0, react_1.useState)(initialFormData);
    const [changes, setChanges] = (0, react_1.useState)({});
    const [mainTab, setMainTab] = (0, react_1.useState)(null);
    const [shouldSave, setShouldSave] = (0, react_1.useState)(false);
    const [kycStatus, setKycStatus] = (0, react_1.useState)(null);
    const initializeFormData = (0, react_1.useCallback)((settings) => {
        const newFormData = { ...initialFormData, ...settings };
        if (settings.mlmSettings) {
            try {
                const mlmSettings = JSON.parse(settings.mlmSettings);
                if (mlmSettings.binary) {
                    newFormData.binaryLevels = mlmSettings.binary.levels;
                    mlmSettings.binary.levelsPercentage.forEach((level) => {
                        newFormData[`binaryLevel${level.level}`] = level.value;
                    });
                }
                else if (mlmSettings.unilevel) {
                    newFormData.unilevelLevels = mlmSettings.unilevel.levels;
                    mlmSettings.unilevel.levelsPercentage.forEach((level) => {
                        newFormData[`unilevelLevel${level.level}`] = level.value;
                    });
                }
            }
            catch (error) {
                console.error("Error parsing mlmSettings:", error);
            }
        }
        setFormData(newFormData);
        setOriginalData(newFormData);
    }, []);
    (0, react_1.useEffect)(() => {
        const { tab } = router.query;
        if (tab) {
            const activeTab = Array.isArray(tab) ? tab[0] : tab;
            setMainTab(activeTab.toUpperCase());
        }
        else {
            // If no tab in query, set default and update URL
            handleTabChange("GENERAL");
        }
    }, [router.query]);
    (0, react_1.useEffect)(() => {
        if (isFetched && settings && router.isReady) {
            initializeFormData(settings);
            checkRestrictions(settings);
        }
    }, [isFetched, settings, router.isReady, initializeFormData]);
    const handleTabChange = (0, react_1.useCallback)((newTab) => {
        setMainTab(newTab);
        router.push({
            pathname: router.pathname,
            query: { ...router.query, tab: newTab.toLowerCase() },
        }, undefined, { shallow: true });
    }, [router]);
    (0, react_1.useEffect)(() => {
        if (shouldSave) {
            handleSave();
            setShouldSave(false);
        }
    }, [shouldSave]);
    const checkRestrictions = async (settings) => {
        const restrictions = [
            settings.tradeRestrictions,
            settings.binaryRestrictions,
            settings.forexRestrictions,
            settings.botRestrictions,
            settings.icoRestrictions,
            settings.mlmRestrictions,
            settings.walletRestrictions,
            settings.depositRestrictions,
            settings.withdrawalRestrictions,
            settings.ecommerceRestrictions,
            settings.stakingRestrictions,
        ];
        if (restrictions.some((restriction) => restriction)) {
            const { data, error } = await (0, api_1.default)({
                url: "/api/user/kyc/template",
                silent: true,
            });
            if (data) {
                setKycStatus(true);
            }
            else {
                setKycStatus(false);
            }
        }
    };
    const handleInputChange = ({ name, value, save = false, }) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
        setChanges((prev) => ({ ...prev, [name]: value }));
        if (save)
            setShouldSave(true);
    };
    const handleFileChange = async (files, field) => {
        if (files.length > 0) {
            const file = files[0];
            try {
                const uploadResult = await (0, upload_1.imageUploader)({
                    file,
                    dir: field.dir,
                    size: field.size,
                    oldPath: formData[field.name] || undefined,
                });
                if (uploadResult.success) {
                    handleInputChange({
                        name: field.name,
                        value: uploadResult.url,
                        save: true,
                    });
                }
            }
            catch (error) {
                console.error("File upload failed", error);
            }
        }
    };
    const handleCancel = () => {
        setFormData(originalData);
        setChanges({});
    };
    const handleSave = async () => {
        setIsLoading(true);
        const mlmSettings = formData.mlmSystem === "BINARY"
            ? {
                binary: {
                    levels: formData.binaryLevels,
                    levelsPercentage: Array.from({ length: formData.binaryLevels }, (_, i) => ({
                        level: i + 1,
                        value: formData[`binaryLevel${i + 1}`] || 0,
                    })),
                },
            }
            : {
                unilevel: {
                    levels: formData.unilevelLevels,
                    levelsPercentage: Array.from({ length: formData.unilevelLevels }, (_, i) => ({
                        level: i + 1,
                        value: formData[`unilevelLevel${i + 1}`] || 0,
                    })),
                },
            };
        const newSettings = {
            ...formData,
            mlmSettings: JSON.stringify(mlmSettings),
        };
        try {
            const { error } = await (0, api_1.default)({
                url: "/api/admin/system/settings",
                method: "PUT",
                body: newSettings,
            });
            if (!error) {
                setOriginalData(formData);
                setChanges({});
            }
        }
        catch (error) {
            console.error("Failed to save settings", error);
        }
        setIsLoading(false);
    };
    const hasChanges = Object.keys(changes).length > 0;
    if (!settings)
        return null;
    const renderSection = () => {
        if (mainTab === null)
            return null;
        const sectionProps = {
            formData,
            handleInputChange,
            handleFileChange,
            handleCancel,
            handleSave,
            hasChanges,
            isLoading,
        };
        switch (mainTab) {
            case "GENERAL":
                return <General_1.default {...sectionProps}/>;
            case "RESTRICTIONS":
                return <Restrictions_1.default {...sectionProps} kycStatus={kycStatus}/>;
            case "WALLET":
                return <Wallet_1.default {...sectionProps}/>;
            case "ANIMATIONS":
                return <Animations_1.default {...sectionProps}/>;
            case "LOGOS":
                return <Logo_1.default {...sectionProps}/>;
            case "INVEST":
                return <Investment_1.default {...sectionProps}/>;
            case "P2P":
                return <P2P_1.default {...sectionProps}/>;
            case "AFFILIATE":
                return <Affiliate_1.default {...sectionProps}/>;
            case "SOCIAL":
                return <Social_1.default {...sectionProps}/>;
            default:
                return null;
        }
    };
    if (!settings || mainTab === null)
        return null;
    return (<Default_1.default title={t("System Settings")} color="muted">
      <main className="mx-auto">
        <div className="mb-12 flex items-center justify-between">
          <h2 className="font-sans text-2xl font-light leading-[1.125] text-muted-800 dark:text-muted-100">
            {t("Settings")}
          </h2>
          <BackButton_1.BackButton href="/admin/dashboard"/>
        </div>
        <div className="w-full h-full flex flex-col">
          <Tabs_1.default mainTab={mainTab} setMainTab={setMainTab}/>
          <div className="w-full flex p-4 flex-col h-full">
            {renderSection()}
          </div>
        </div>
      </main>
    </Default_1.default>);
};
exports.default = SystemSettings;
exports.permission = "Access System Settings Management";
