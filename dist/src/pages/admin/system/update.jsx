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
exports.getServerSideProps = exports.permission = void 0;
const react_1 = __importStar(require("react"));
const Default_1 = __importDefault(require("@/layouts/Default"));
const next_i18next_1 = require("next-i18next");
const api_1 = __importStar(require("@/utils/api")); // Ensure $fetch is imported correctly
const Card_1 = __importDefault(require("@/components/elements/base/card/Card"));
const Input_1 = __importDefault(require("@/components/elements/form/input/Input"));
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const Alert_1 = __importDefault(require("@/components/elements/base/alert/Alert"));
const react_loading_skeleton_1 = __importDefault(require("react-loading-skeleton"));
require("react-loading-skeleton/dist/skeleton.css");
const dashboard_1 = require("@/stores/dashboard");
const SystemUpdate = ({ initialProductId, initialProductVersion, initialLicenseVerified, initialUpdateData, }) => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const { isDark } = (0, dashboard_1.useDashboardStore)();
    const [updateData, setUpdateData] = (0, react_1.useState)(initialUpdateData);
    const [isUpdating, setIsUpdating] = (0, react_1.useState)(false);
    const [purchaseCode, setPurchaseCode] = (0, react_1.useState)("");
    const [envatoUsername, setEnvatoUsername] = (0, react_1.useState)("");
    const [productId, setProductId] = (0, react_1.useState)(initialProductId);
    const [productName] = (0, react_1.useState)("bicrypto");
    const [productVersion, setProductVersion] = (0, react_1.useState)(initialProductVersion);
    const [licenseVerified, setLicenseVerified] = (0, react_1.useState)(initialLicenseVerified);
    const [isSubmitting, setIsSubmitting] = (0, react_1.useState)(false);
    const externalNotesUrl = "https://support.mash3div.com/pages/5/update-notes";
    const [isUpdateChecking, setIsUpdateChecking] = (0, react_1.useState)(false);
    const [skeletonProps, setSkeletonProps] = (0, react_1.useState)({
        baseColor: "#f7fafc",
        highlightColor: "#edf2f7",
    });
    (0, react_1.useEffect)(() => {
        setSkeletonProps({
            baseColor: isDark ? "#27272a" : "#f7fafc",
            highlightColor: isDark ? "#3a3a3e" : "#edf2f7",
        });
    }, [isDark]);
    const safeFetch = async (config) => {
        // A wrapper to handle `$fetch` safely
        try {
            const response = await (0, api_1.default)(config);
            // Assuming $fetch returns { data, error }
            if (response.error) {
                console.error("Fetch Error:", response.error);
                return { data: null, error: response.error };
            }
            return response;
        }
        catch (err) {
            console.error("Fetch Exception:", err);
            return { data: null, error: err };
        }
    };
    const checkForUpdates = async () => {
        if (!productId || !productVersion)
            return;
        setIsUpdateChecking(true);
        const { data, error } = await safeFetch({
            url: `/api/admin/system/update/check`,
            method: "POST",
            body: { productId, currentVersion: productVersion },
            silent: true,
        });
        if (data && !error) {
            setUpdateData({
                ...data,
                message: data.message || "Update information retrieved.",
            });
        }
        else {
            setUpdateData((prev) => ({
                ...prev,
                status: false,
                message: (data === null || data === void 0 ? void 0 : data.message) ||
                    "Unable to retrieve update information due to a network error.",
            }));
        }
        setIsUpdateChecking(false);
    };
    const updateSystem = async () => {
        setIsUpdating(true);
        const { error } = await safeFetch({
            url: `/api/admin/system/update/download`,
            method: "POST",
            body: {
                productId,
                updateId: updateData.update_id,
                version: updateData.version,
                product: productName,
            },
        });
        if (!error) {
            setProductVersion(updateData.version);
            setUpdateData((prev) => ({
                ...prev,
                message: "Update completed successfully.",
            }));
        }
        else {
            setUpdateData((prev) => ({
                ...prev,
                message: "Failed to update system. Please try again later.",
            }));
        }
        setIsUpdating(false);
    };
    const activateLicenseAction = async () => {
        setIsSubmitting(true);
        const { data, error } = await safeFetch({
            url: `/api/admin/system/license/activate`,
            method: "POST",
            body: { productId, purchaseCode, envatoUsername },
        });
        if (data && !error) {
            setLicenseVerified(data.status);
            if (!data.status) {
                setUpdateData((prev) => ({
                    ...prev,
                    message: "License activation failed. Please check your details.",
                }));
            }
        }
        else {
            setUpdateData((prev) => ({
                ...prev,
                message: "Error activating license. Please try again.",
            }));
        }
        setIsSubmitting(false);
    };
    const noUpdateAvailable = !updateData.status &&
        updateData.message === "You have the latest version of Bicrypto.";
    const errorOrFallbackScenario = !updateData.status &&
        updateData.message !== "You have the latest version of Bicrypto." &&
        updateData.message !== "";
    return (<Default_1.default title={t("System Update")} color="muted">
      {/* Top Bar */}
      <div className="flex justify-between items-center w-full mb-8 text-muted-800 dark:text-muted-200">
        <div className="flex flex-col space-y-1">
          <h1 className="text-2xl font-bold">{t("System Update")}</h1>
          <p className="text-sm text-muted-600 dark:text-muted-400">
            {t("Current Version")}:{" "}
            <span className="font-medium text-info-500">{productVersion}</span>
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className={`w-4 h-4 rounded-full animate-pulse ${licenseVerified ? "bg-green-500" : "bg-red-500"}`} title={licenseVerified
            ? t("License Verified")
            : t("License Not Verified")}/>
          <span className="text-sm">
            {licenseVerified
            ? t("License Verified")
            : t("License Not Verified")}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left Section (2/3) */}
        <div className="col-span-2 space-y-6">
          {isUpdateChecking ? (<div className="space-y-6">
              <div className="space-y-3">
                <react_loading_skeleton_1.default height={48} {...skeletonProps}/>
              </div>
              <Card_1.default className="p-5 space-y-5 shadow-xs border border-muted-200 dark:border-muted-700">
                <div className="space-y-4">
                  <react_loading_skeleton_1.default height={20} width={120} {...skeletonProps}/>
                  <react_loading_skeleton_1.default count={3} {...skeletonProps}/>
                  <react_loading_skeleton_1.default width={100} height={12} {...skeletonProps}/>
                </div>
              </Card_1.default>
            </div>) : (<>
              {updateData.status && (<div className="space-y-3">
                  <Alert_1.default color="info" icon="material-symbols-light:info-outline" canClose={false} className="text-md">
                    {t("Please backup your database and script files before upgrading")}
                    .
                  </Alert_1.default>
                  {updateData.message && (<Alert_1.default canClose={false} color="success" className="text-md">
                      {updateData.message}
                    </Alert_1.default>)}
                </div>)}

              {noUpdateAvailable && (<>
                  <Alert_1.default canClose={false} color="success" className="text-md">
                    {updateData.message}
                  </Alert_1.default>
                  <Card_1.default className="p-5 space-y-5 shadow-xs border border-muted-200 dark:border-muted-700 flex flex-col">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                      {t("Update Notes")}
                    </h3>
                    <p className="text-sm text-muted-600 dark:text-muted-400">
                      {t("There are no updates available for your system at this time.")}
                    </p>
                    <a href={externalNotesUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-info-600 hover:text-info-500 underline">
                      {t("View Changelog")}
                    </a>
                  </Card_1.default>
                </>)}

              {errorOrFallbackScenario && (<Alert_1.default canClose={false} color="warning" className="text-md">
                  {updateData.message ||
                    t("Unable to retrieve update information.")}
                </Alert_1.default>)}

              {updateData.status && updateData.changelog && (<Card_1.default className="p-5 space-y-5 shadow-xs border border-muted-200 dark:border-muted-700">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                    {t("Update Notes")}
                  </h3>
                  <div className="pl-5 prose dark:prose-dark text-muted-800 dark:text-muted-200 text-sm overflow-auto max-h-96" dangerouslySetInnerHTML={{
                    __html: updateData.changelog || "",
                }}/>
                  <a href={externalNotesUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-info-600 hover:text-info-500 underline">
                    {t("View Changelog")}
                  </a>
                </Card_1.default>)}
            </>)}
        </div>

        {/* Right Section (1/3) */}
        <div className="col-span-1 space-y-6">
          <Card_1.default className="p-5 space-y-5 shadow-xs border border-muted-200 dark:border-muted-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              {t("Update Actions")}
            </h3>
            <p className="text-sm text-muted-600 dark:text-muted-400">
              {updateData.status
            ? t("Update to the latest version once your license is verified.")
            : t("No updates available, but you can re-check at any time.")}
            </p>
            {isUpdateChecking ? (<div className="space-y-4">
                <react_loading_skeleton_1.default height={32} width="100%" {...skeletonProps}/>
                <react_loading_skeleton_1.default height={32} width="100%" {...skeletonProps}/>
              </div>) : (<>
                <Button_1.default onClick={updateSystem} color="success" className="w-full" type="submit" disabled={!updateData.status ||
                !licenseVerified ||
                updateData.update_id === "" ||
                isUpdating} loading={isUpdating}>
                  {t("Update")}
                </Button_1.default>
                <Button_1.default onClick={checkForUpdates} color="primary" className="w-full" type="button" disabled={isUpdateChecking} loading={isUpdateChecking}>
                  {t("Check for Updates")}
                </Button_1.default>
              </>)}
          </Card_1.default>

          {!licenseVerified && (<Card_1.default className="p-5 space-y-5 shadow-xs border border-muted-200 dark:border-muted-700">
              <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200">
                {t("License Verification")}
              </h4>
              <p className="text-sm text-muted-600 dark:text-muted-400">
                {t("Please enter your purchase details to verify your license.")}
              </p>
              <Input_1.default value={purchaseCode} onChange={(e) => setPurchaseCode(e.target.value)} type="text" label={t("Purchase Code")} placeholder={t("Enter your purchase code")}/>
              <Input_1.default value={envatoUsername} onChange={(e) => setEnvatoUsername(e.target.value)} type="text" label={t("Envato Username")} placeholder={t("Enter your Envato username")}/>
              <Button_1.default color="primary" className="w-full" onClick={activateLicenseAction} disabled={isSubmitting} loading={isSubmitting}>
                {t("Activate License")}
              </Button_1.default>
            </Card_1.default>)}
        </div>
      </div>
    </Default_1.default>);
};
exports.permission = "Access System Update Management";
async function getServerSideProps(context) {
    var _a, _b, _c, _d;
    // Safe server-side fetch wrapper
    const safeServerFetch = async (config) => {
        try {
            const response = await (0, api_1.$serverFetch)(context, config);
            if (response.error) {
                console.error("Server Fetch Error:", response.error);
                return { data: null, error: response.error };
            }
            return response;
        }
        catch (err) {
            console.error("Server Fetch Exception:", err);
            return { data: null, error: err };
        }
    };
    try {
        const productResponse = await safeServerFetch({
            url: `/api/admin/system/product`,
        });
        const productId = ((_a = productResponse.data) === null || _a === void 0 ? void 0 : _a.id) || "";
        const productVersion = ((_b = productResponse.data) === null || _b === void 0 ? void 0 : _b.version) || "";
        let licenseVerified = false;
        let updateData = {
            status: false,
            message: "You have the latest version of Bicrypto.",
            changelog: null,
            update_id: "",
            version: productVersion,
        };
        if (productId) {
            const licenseVerification = await safeServerFetch({
                url: `/api/admin/system/license/verify`,
                method: "POST",
                body: { productId },
            });
            licenseVerified = (_d = (_c = licenseVerification === null || licenseVerification === void 0 ? void 0 : licenseVerification.data) === null || _c === void 0 ? void 0 : _c.status) !== null && _d !== void 0 ? _d : false;
        }
        if (productId && productVersion) {
            const updateCheck = await safeServerFetch({
                url: `/api/admin/system/update/check`,
                method: "POST",
                body: { productId, currentVersion: productVersion },
            });
            if (updateCheck.data) {
                updateData = {
                    ...updateData,
                    ...updateCheck.data,
                };
            }
            else if (updateCheck.error) {
                updateData.message =
                    "Unable to check for updates at this time. Please try again later.";
            }
        }
        return {
            props: {
                initialProductId: productId,
                initialProductVersion: productVersion,
                initialLicenseVerified: licenseVerified,
                initialUpdateData: updateData,
            },
        };
    }
    catch (error) {
        console.error("Error fetching data:", error);
        return {
            props: {
                initialProductId: "",
                initialProductVersion: "",
                initialLicenseVerified: false,
                initialUpdateData: {
                    status: false,
                    message: "Unable to check for updates at this time.",
                    changelog: null,
                    update_id: "",
                    version: "",
                },
            },
        };
    }
}
exports.getServerSideProps = getServerSideProps;
exports.default = SystemUpdate;
