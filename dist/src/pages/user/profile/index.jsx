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
const Default_1 = __importDefault(require("@/layouts/Default"));
const api_1 = __importDefault(require("@/utils/api"));
const dashboard_1 = require("@/stores/dashboard");
const upload_1 = require("@/utils/upload");
const PictureSection_1 = __importDefault(require("@/components/pages/user/profile/PictureSection"));
const PersonalSection_1 = __importDefault(require("@/components/pages/user/profile/PersonalSection"));
const AddressSection_1 = __importDefault(require("@/components/pages/user/profile/AddressSection"));
const SocialMediaSection_1 = __importDefault(require("@/components/pages/user/profile/SocialMediaSection"));
const KycStatus_1 = require("@/components/pages/user/profile/KycStatus");
const _2fa_1 = require("@/components/pages/user/profile/2fa");
const BackButton_1 = require("@/components/elements/base/button/BackButton");
const WalletConnectButton_1 = __importDefault(require("@/components/pages/user/profile/WalletConnectButton"));
const useWagmi_1 = __importDefault(require("@/context/useWagmi"));
const next_i18next_1 = require("next-i18next");
const AccountDeletion_1 = __importDefault(require("@/components/pages/user/profile/AccountDeletion"));
const twoFactorStatus = process.env.NEXT_PUBLIC_2FA_STATUS === "true" || false;
const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;
const Tab = ({ label, activeTab, setActiveTab, tabName }) => {
    const router = (0, router_1.useRouter)();
    const handleTabClick = () => {
        setActiveTab(tabName);
        router.push({
            pathname: router.pathname,
            query: { ...router.query, tab: tabName.toLowerCase() },
        });
    };
    return (<button type="button" className={`shrink-0 border-b-2 px-6 py-2 text-sm transition-colors duration-300
        ${activeTab === tabName
            ? "border-primary-500 text-primary-500 dark:text-primary-400"
            : "border-transparent text-muted"}
      `} onClick={handleTabClick}>
      {label}
    </button>);
};
const Tabs = ({ mainTab, setMainTab }) => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const { settings } = (0, dashboard_1.useDashboardStore)();
    return (<div className="flex gap-2 border-b border-muted-200 dark:border-muted-800 overflow-x-auto">
      {(settings === null || settings === void 0 ? void 0 : settings.kycStatus) === "true" ? (<Tab label={t("Verification")} activeTab={mainTab} setActiveTab={setMainTab} tabName="KYC"/>) : (<>
          <Tab label={t("Personal")} activeTab={mainTab} setActiveTab={setMainTab} tabName="PERSONAL"/>
          <Tab label={t("Address")} activeTab={mainTab} setActiveTab={setMainTab} tabName="ADDRESS"/>
        </>)}
      {twoFactorStatus && (<Tab label={t("2FA")} activeTab={mainTab} setActiveTab={setMainTab} tabName="2FA"/>)}
      <Tab label={t("Picture")} activeTab={mainTab} setActiveTab={setMainTab} tabName="PICTURE"/>
      <Tab label={t("Social Media")} activeTab={mainTab} setActiveTab={setMainTab} tabName="SOCIAL_MEDIA"/>
      <Tab label={t("Account Deletion")} activeTab={mainTab} setActiveTab={setMainTab} tabName="ACCOUNT_DELETION"/>
    </div>);
};
const UserSettings = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const { profile, settings } = (0, dashboard_1.useDashboardStore)();
    const router = (0, router_1.useRouter)();
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [formData, setFormData] = (0, react_1.useState)({});
    (0, react_1.useEffect)(() => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w;
        setFormData({
            firstName: (profile === null || profile === void 0 ? void 0 : profile.firstName) || "",
            lastName: (profile === null || profile === void 0 ? void 0 : profile.lastName) || "",
            email: (profile === null || profile === void 0 ? void 0 : profile.email) || "",
            bio: ((_a = profile === null || profile === void 0 ? void 0 : profile.metadata) === null || _a === void 0 ? void 0 : _a.bio) || "",
            avatar: (profile === null || profile === void 0 ? void 0 : profile.avatar) || "",
            address: ((_c = (_b = profile === null || profile === void 0 ? void 0 : profile.metadata) === null || _b === void 0 ? void 0 : _b.location) === null || _c === void 0 ? void 0 : _c.address) || "",
            city: ((_e = (_d = profile === null || profile === void 0 ? void 0 : profile.metadata) === null || _d === void 0 ? void 0 : _d.location) === null || _e === void 0 ? void 0 : _e.city) || "",
            country: ((_g = (_f = profile === null || profile === void 0 ? void 0 : profile.metadata) === null || _f === void 0 ? void 0 : _f.location) === null || _g === void 0 ? void 0 : _g.country) || "",
            zip: ((_j = (_h = profile === null || profile === void 0 ? void 0 : profile.metadata) === null || _h === void 0 ? void 0 : _h.location) === null || _j === void 0 ? void 0 : _j.zip) || "",
            facebook: ((_l = (_k = profile === null || profile === void 0 ? void 0 : profile.metadata) === null || _k === void 0 ? void 0 : _k.social) === null || _l === void 0 ? void 0 : _l.facebook) || "",
            twitter: ((_o = (_m = profile === null || profile === void 0 ? void 0 : profile.metadata) === null || _m === void 0 ? void 0 : _m.social) === null || _o === void 0 ? void 0 : _o.twitter) || "",
            dribbble: ((_q = (_p = profile === null || profile === void 0 ? void 0 : profile.metadata) === null || _p === void 0 ? void 0 : _p.social) === null || _q === void 0 ? void 0 : _q.dribbble) || "",
            instagram: ((_s = (_r = profile === null || profile === void 0 ? void 0 : profile.metadata) === null || _r === void 0 ? void 0 : _r.social) === null || _s === void 0 ? void 0 : _s.instagram) || "",
            github: ((_u = (_t = profile === null || profile === void 0 ? void 0 : profile.metadata) === null || _t === void 0 ? void 0 : _t.social) === null || _u === void 0 ? void 0 : _u.github) || "",
            gitlab: ((_w = (_v = profile === null || profile === void 0 ? void 0 : profile.metadata) === null || _v === void 0 ? void 0 : _v.social) === null || _w === void 0 ? void 0 : _w.gitlab) || "",
        });
    }, [profile]);
    const [originalData, setOriginalData] = (0, react_1.useState)(formData);
    const [changes, setChanges] = (0, react_1.useState)({});
    const [mainTab, setMainTab] = (0, react_1.useState)("PICTURE");
    (0, react_1.useEffect)(() => {
        const { tab } = router.query;
        if (tab) {
            setMainTab(tab.toUpperCase());
        }
        else {
            setMainTab((settings === null || settings === void 0 ? void 0 : settings.kycStatus) === "true" ? "KYC" : "PERSONAL");
        }
    }, [router.query]);
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === "checkbox" ? checked : value,
        }));
        setChanges((prevChanges) => ({
            ...prevChanges,
            [name]: type === "checkbox" ? checked : value,
        }));
    };
    const handleFileChange = async (files) => {
        if (files.length > 0) {
            const file = files[0];
            const uploadResult = await (0, upload_1.imageUploader)({
                file,
                dir: "avatars",
                size: {
                    width: 64,
                    height: 64,
                    maxWidth: 64,
                    maxHeight: 64,
                },
                oldPath: formData.avatar,
            });
            if (uploadResult.success) {
                setFormData((prevData) => ({
                    ...prevData,
                    avatar: uploadResult.url,
                }));
                setChanges((prevChanges) => ({
                    ...prevChanges,
                    avatar: uploadResult.url,
                }));
            }
        }
    };
    const handleCancel = () => {
        setFormData(originalData);
        setChanges({});
    };
    const handleSave = async () => {
        setIsLoading(true);
        const payload = {
            ...changes,
            profile: {
                bio: formData.bio,
                location: {
                    address: formData.address,
                    city: formData.city,
                    country: formData.country,
                    zip: formData.zip,
                },
                social: {
                    facebook: formData.facebook,
                    twitter: formData.twitter,
                    dribbble: formData.dribbble,
                    instagram: formData.instagram,
                    github: formData.github,
                    gitlab: formData.gitlab,
                },
            },
        };
        const { data, error } = await (0, api_1.default)({
            url: "/api/user/profile",
            method: "PUT",
            body: payload,
        });
        if (!error) {
            setOriginalData(formData);
            setChanges({});
            console.log(data);
        }
        setIsLoading(false);
    };
    const hasChanges = Object.keys(changes).length > 0;
    return (<Default_1.default title={t("User Profile")} color="muted">
      <main className="mx-auto max-w-7xl">
        <div className="mb-12 flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <h2 className="font-sans text-2xl font-light leading-[1.125] text-muted-800 dark:text-muted-100">
              {t("Welcome")} {profile === null || profile === void 0 ? void 0 : profile.firstName},
            </h2>
            <span className="text-muted-500 dark:text-muted-400 text-sm">
              {profile === null || profile === void 0 ? void 0 : profile.id}
            </span>
          </div>
          <div className="flex items-center gap-4">
            {projectId && (<useWagmi_1.default>
                <WalletConnectButton_1.default />
              </useWagmi_1.default>)}
            <BackButton_1.BackButton href="/user"/>
          </div>
        </div>

        <div className="w-full h-full flex flex-col">
          <Tabs mainTab={mainTab} setMainTab={setMainTab}/>
          <div className="w-full flex p-4 flex-col h-full">
            {(settings === null || settings === void 0 ? void 0 : settings.kycStatus) === "true" ? (mainTab === "KYC" && <KycStatus_1.KycStatus />) : (<>
                {mainTab === "PERSONAL" && (<PersonalSection_1.default formData={formData} handleInputChange={handleInputChange} handleCancel={handleCancel} handleSave={handleSave} hasChanges={hasChanges} isLoading={isLoading}/>)}
                {mainTab === "ADDRESS" && (<AddressSection_1.default formData={formData} handleInputChange={handleInputChange} handleCancel={handleCancel} handleSave={handleSave} hasChanges={hasChanges} isLoading={isLoading}/>)}
              </>)}
            {twoFactorStatus && mainTab === "2FA" && <_2fa_1.TwoFactor />}
            {mainTab === "PICTURE" && (<PictureSection_1.default formData={formData} handleFileChange={handleFileChange} handleCancel={handleCancel} handleSave={handleSave} hasChanges={hasChanges} setFormData={setFormData} setChanges={setChanges} isLoading={isLoading}/>)}
            {mainTab === "SOCIAL_MEDIA" && (<SocialMediaSection_1.default formData={formData} handleInputChange={handleInputChange} handleCancel={handleCancel} handleSave={handleSave} hasChanges={hasChanges} isLoading={isLoading}/>)}
            {mainTab === "ACCOUNT_DELETION" && <AccountDeletion_1.default />}
          </div>
        </div>
      </main>
    </Default_1.default>);
};
exports.default = UserSettings;
