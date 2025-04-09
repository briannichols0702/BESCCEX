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
const Default_1 = __importDefault(require("@/layouts/Default"));
const next_i18next_1 = require("next-i18next");
const api_1 = __importDefault(require("@/utils/api"));
const Card_1 = __importDefault(require("@/components/elements/base/card/Card"));
const Input_1 = __importDefault(require("@/components/elements/form/input/Input"));
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const IconBox_1 = __importDefault(require("@/components/elements/base/iconbox/IconBox"));
const Alert_1 = __importDefault(require("@/components/elements/base/alert/Alert"));
const lodash_1 = require("lodash");
const BackButton_1 = require("@/components/elements/base/button/BackButton");
const router_1 = require("next/router");
const ExchangeProvider = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const [updateData, setUpdateData] = (0, react_1.useState)({
        status: false,
        version: "",
        release_date: "",
        summary: "",
        changelog: null,
        update_id: "",
        message: "",
    });
    const router = (0, router_1.useRouter)();
    const { productId } = router.query;
    const [isUpdating, setIsUpdating] = (0, react_1.useState)(false);
    const [purchaseCode, setPurchaseCode] = (0, react_1.useState)("");
    const [envatoUsername, setEnvatoUsername] = (0, react_1.useState)("");
    const [productName, setProductName] = (0, react_1.useState)(null);
    const [productTitle, setProductTitle] = (0, react_1.useState)(null);
    const [productVersion, setProductVersion] = (0, react_1.useState)("");
    const [licenseVerified, setLicenseVerified] = (0, react_1.useState)(false);
    const [isSubmitting, setIsSubmitting] = (0, react_1.useState)(false);
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const fetchProductData = async () => {
        const { data, error } = await (0, api_1.default)({
            url: `/api/admin/finance/exchange/provider/${productId}`,
            silent: true,
        });
        if (!error) {
            setProductVersion(data.exchange.version);
            setProductName(data.exchange.name);
            setProductTitle(data.exchange.title);
        }
    };
    const debouncedFetchProductData = (0, lodash_1.debounce)(fetchProductData, 100);
    (0, react_1.useEffect)(() => {
        if (router.isReady) {
            debouncedFetchProductData();
        }
    }, [router.isReady]);
    const reVerifyLicense = async () => {
        const { data, error } = await (0, api_1.default)({
            url: `/api/admin/finance/exchange/provider/${productId}/verify`,
            method: "POST",
            silent: true,
        });
        if (!error) {
            setLicenseVerified(data.status);
        }
        else {
            setLicenseVerified(false);
        }
    };
    (0, react_1.useEffect)(() => {
        if (productId && productName) {
            reVerifyLicense();
        }
    }, [productId, productName]);
    const checkForUpdates = async () => {
        setIsLoading(true);
        const { data, error } = await (0, api_1.default)({
            url: `/api/admin/system/update/check`,
            method: "POST",
            body: { productId, currentVersion: productVersion },
            silent: true,
        });
        if (!error) {
            setUpdateData(data);
            setUpdateData((prevState) => ({
                ...prevState,
                message: data.message,
            }));
        }
        setIsLoading(false);
    };
    (0, react_1.useEffect)(() => {
        if (licenseVerified) {
            checkForUpdates();
        }
    }, [licenseVerified, productVersion]);
    const updateSystem = async () => {
        setIsUpdating(true);
        const { error } = await (0, api_1.default)({
            url: `/api/admin/system/update/download`,
            method: "POST",
            body: {
                productId,
                updateId: updateData.update_id,
                version: updateData.version,
                product: productName,
                type: "extension",
            },
        });
        if (!error) {
            setProductVersion(updateData.version);
        }
        setIsUpdating(false);
    };
    const activateLicenseAction = async () => {
        setIsSubmitting(true);
        const { data, error } = await (0, api_1.default)({
            url: `/api/admin/finance/exchange/provider/${productId}/activate`,
            method: "POST",
            body: { purchaseCode, envatoUsername },
        });
        if (!error) {
            setLicenseVerified(data.status);
        }
        setIsSubmitting(false);
    };
    return (<Default_1.default title={t("Extension Details")} color="muted">
      <div className="flex justify-between items-center w-full mb-5">
        <h1 className="text-xl">{productTitle}</h1>
        <BackButton_1.BackButton href={`/admin/finance/exchange/provider/${productId}`}/>
      </div>
      {!licenseVerified ? (<div className="flex justify-center items-center w-full h-[70vh]">
          <div className="flex flex-col justify-center items-center w-full max-w-5xl px-4 text-center">
            <h1>{t("Verify your license")}</h1>
            <Card_1.default className="mt-8 p-5 max-w-md space-y-5">
              <Input_1.default value={purchaseCode} onChange={(e) => setPurchaseCode(e.target.value)} type="text" label={t("Purchase Code")} placeholder={t("Enter your purchase code")}/>
              <Input_1.default value={envatoUsername} onChange={(e) => setEnvatoUsername(e.target.value)} type="text" label={t("Envato Username")} placeholder={t("Enter your Envato username")}/>
              <Button_1.default color="primary" className="w-full" onClick={activateLicenseAction} disabled={isSubmitting} loading={isSubmitting}>
                {t("Activate License")}
              </Button_1.default>
            </Card_1.default>
          </div>
        </div>) : (<div className="flex flex-col justify-center items-center w-full">
          {isLoading ? (<div className="flex justify-center items-center w-full h-[70vh]">
              <div className="text-center space-y-5 flex flex-col gap-5 items-center justify-center">
                <IconBox_1.default size="xl" shape="full" color="info" icon="svg-spinners:blocks-shuffle-3"/>
                <h1 className="text-2xl font-bold">
                  {t("Checking for updates")}...
                </h1>
                <p>{t("Please wait while we check for updates")}.</p>
              </div>
            </div>) : (<div className="text-start max-w-2xl space-y-5">
              {updateData.status && (<Alert_1.default color="info" icon="material-symbols-light:info-outline" canClose={false} className="text-md">
                  {t("Please backup your database and script files before upgrading")}
                  .
                </Alert_1.default>)}
              <Alert_1.default canClose={false} color={"success"} className="text-md">
                {updateData.message}
              </Alert_1.default>
              {updateData.status && (<Card_1.default className="p-5 space-y-5">
                  <span className="text-gray-800 dark:text-gray-200 font-semibold text-lg">
                    {t("Update Notes")}
                  </span>
                  <div className="pl-5 prose" dangerouslySetInnerHTML={{
                        __html: updateData.changelog || "",
                    }}/>
                  <Button_1.default onClick={updateSystem} color="success" className="w-full" type="submit" disabled={updateData.update_id === "" || isUpdating} loading={isUpdating}>
                    {t("Update")}
                  </Button_1.default>
                </Card_1.default>)}
            </div>)}
        </div>)}
    </Default_1.default>);
};
exports.default = ExchangeProvider;
exports.permission = "Access Exchange Provider Management";
