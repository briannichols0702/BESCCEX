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
const api_1 = require("@/utils/api");
const api_2 = __importDefault(require("@/utils/api"));
const Card_1 = __importDefault(require("@/components/elements/base/card/Card"));
const Input_1 = __importDefault(require("@/components/elements/form/input/Input"));
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const Alert_1 = __importDefault(require("@/components/elements/base/alert/Alert"));
const react_loading_skeleton_1 = __importDefault(require("react-loading-skeleton"));
require("react-loading-skeleton/dist/skeleton.css");
const react_2 = require("@iconify/react");
const BackButton_1 = require("@/components/elements/base/button/BackButton");
const dashboard_1 = require("@/stores/dashboard");
const BlockchainDetails = ({ initialProductId, initialBlockchainVersion, initialBlockchainName, initialBlockchainChain, initialBlockchainStatus, initialLicenseVerified, initialUpdateData, }) => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const { isDark } = (0, dashboard_1.useDashboardStore)();
    const [productId] = (0, react_1.useState)(initialProductId);
    const [blockchainVersion, setBlockchainVersion] = (0, react_1.useState)(initialBlockchainVersion);
    const [blockchainName] = (0, react_1.useState)(initialBlockchainName);
    const [blockchainChain] = (0, react_1.useState)(initialBlockchainChain);
    const [blockchainStatus, setBlockchainStatus] = (0, react_1.useState)(initialBlockchainStatus);
    const [licenseVerified, setLicenseVerified] = (0, react_1.useState)(initialLicenseVerified);
    const [updateData, setUpdateData] = (0, react_1.useState)(initialUpdateData);
    const [purchaseCode, setPurchaseCode] = (0, react_1.useState)("");
    const [envatoUsername, setEnvatoUsername] = (0, react_1.useState)("");
    const [isSubmitting, setIsSubmitting] = (0, react_1.useState)(false);
    const [isUpdating, setIsUpdating] = (0, react_1.useState)(false);
    const [isUpdateChecking, setIsUpdateChecking] = (0, react_1.useState)(false);
    // Skeleton colors
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
    const externalNotesUrl = "https://support.mash3div.com/pages/5/update-notes";
    const checkForUpdates = async () => {
        if (!productId || !blockchainVersion)
            return;
        setIsUpdateChecking(true);
        const { data } = await (0, api_2.default)({
            url: `/api/admin/system/update/check`,
            method: "POST",
            body: { productId, currentVersion: blockchainVersion },
            silent: true,
        });
        if (data) {
            setUpdateData({
                ...data,
                message: data.message,
            });
        }
        setIsUpdateChecking(false);
    };
    const updateBlockchain = async () => {
        setIsUpdating(true);
        const { error } = await (0, api_2.default)({
            url: `/api/admin/system/update/download`,
            method: "POST",
            body: {
                productId,
                updateId: updateData.update_id,
                version: updateData.version,
                product: blockchainName,
                type: "blockchain",
            },
        });
        if (!error) {
            setBlockchainVersion(updateData.version);
        }
        setIsUpdating(false);
    };
    const activateLicenseAction = async () => {
        setIsSubmitting(true);
        const { data } = await (0, api_2.default)({
            url: `/api/admin/system/license/activate`,
            method: "POST",
            body: { productId, purchaseCode, envatoUsername },
        });
        if (data) {
            setLicenseVerified(data.status);
        }
        setIsSubmitting(false);
    };
    const handleActivateBlockchain = async () => {
        setIsSubmitting(true);
        const { error } = await (0, api_2.default)({
            url: `/api/admin/ext/ecosystem/blockchain/${productId}/status`,
            method: "PUT",
            body: { status: !blockchainStatus },
        });
        if (!error) {
            setBlockchainStatus(!blockchainStatus);
        }
        setIsSubmitting(false);
    };
    const noUpdateAvailable = !updateData.status &&
        updateData.message === "You have the latest version of Bicrypto.";
    const errorOrFallbackScenario = !updateData.status &&
        updateData.message !== "You have the latest version of Bicrypto." &&
        updateData.message !== "";
    return (<Default_1.default title={t("Blockchain Details")} color="muted">
      {/* Top Bar */}
      <div className="flex justify-between items-center w-full mb-8 text-muted-800 dark:text-muted-200">
        <div className="flex flex-col space-y-1">
          <h1 className="text-2xl font-bold">
            {blockchainChain || t("Blockchain Details")}
          </h1>
          <p className="text-sm text-muted-600 dark:text-muted-400">
            {t("Current Version")}:{" "}
            <span className="font-medium text-info-500">
              {blockchainVersion}
            </span>
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

          {blockchainVersion !== "0.0.1" && (<Button_1.default color={blockchainStatus ? "danger" : "success"} onClick={handleActivateBlockchain} disabled={isSubmitting} loading={isSubmitting}>
              <react_2.Icon icon={blockchainStatus ? "carbon:close" : "carbon:checkmark"} className="mr-2 h-5 w-5"/>
              {blockchainStatus ? t("Disable") : t("Enable")}
            </Button_1.default>)}
          <BackButton_1.BackButton href={"/admin/ext/ecosystem"}/>
        </div>
      </div>

      {/* Always show three-column layout */}
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
                </div>
              </Card_1.default>
            </div>) : (<>
              {updateData.status && (<div className="space-y-3">
                  <Alert_1.default color="info" icon="material-symbols-light:info-outline" canClose={false} className="text-md">
                    {t("Please backup your database and blockchain files before upgrading")}
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
            : t("No updates available or unable to retrieve updates. You can re-check at any time.")}
            </p>
            {isUpdateChecking ? (<div className="flex flex-col gap-3">
                <react_loading_skeleton_1.default height={32} width="100%" {...skeletonProps}/>
                <react_loading_skeleton_1.default height={32} width="100%" {...skeletonProps}/>
              </div>) : (<>
                <Button_1.default onClick={updateBlockchain} color="success" className="w-full" type="submit" disabled={!updateData.status ||
                !licenseVerified ||
                updateData.update_id === "" ||
                isUpdating} loading={isUpdating}>
                  {blockchainVersion === "0.0.1" ? t("Install") : t("Update")}
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
exports.permission = "Access Blockchain Management";
async function getServerSideProps(context) {
    var _a, _b;
    try {
        const { productId } = context.query;
        if (!productId) {
            return {
                props: {
                    initialProductId: "",
                    initialBlockchainVersion: "",
                    initialBlockchainName: null,
                    initialBlockchainChain: null,
                    initialBlockchainStatus: false,
                    initialLicenseVerified: false,
                    initialUpdateData: {
                        status: false,
                        message: "No product selected",
                        changelog: null,
                        update_id: "",
                        version: "",
                    },
                },
            };
        }
        // Fetch blockchain data
        const blockchainResponse = await (0, api_1.$serverFetch)(context, {
            url: `/api/admin/ext/ecosystem/blockchain/${productId}`,
        });
        const blockchainData = blockchainResponse.data || {};
        const blockchainVersion = blockchainData.version || "";
        const blockchainName = blockchainData.name || null;
        const blockchainChain = blockchainData.chain || null;
        const blockchainStatus = blockchainData.status || false;
        let licenseVerified = false;
        let updateData = {
            status: false,
            message: "You have the latest version of Bicrypto.",
            changelog: null,
            update_id: "",
            version: blockchainVersion,
        };
        // Verify license
        if (productId && blockchainName) {
            const licenseVerification = await (0, api_1.$serverFetch)(context, {
                url: `/api/admin/system/license/verify`,
                method: "POST",
                body: { productId },
            });
            licenseVerified = (_b = (_a = licenseVerification === null || licenseVerification === void 0 ? void 0 : licenseVerification.data) === null || _a === void 0 ? void 0 : _a.status) !== null && _b !== void 0 ? _b : false;
        }
        // Check for updates if license verified
        if (licenseVerified && productId && blockchainVersion) {
            const updateCheck = await (0, api_1.$serverFetch)(context, {
                url: `/api/admin/system/update/check`,
                method: "POST",
                body: { productId, currentVersion: blockchainVersion },
            });
            if (updateCheck.data) {
                updateData = {
                    ...updateData,
                    ...updateCheck.data,
                    message: updateCheck.data.message,
                };
            }
        }
        return {
            props: {
                initialProductId: productId,
                initialBlockchainVersion: blockchainVersion,
                initialBlockchainName: blockchainName,
                initialBlockchainChain: blockchainChain,
                initialBlockchainStatus: blockchainStatus,
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
                initialBlockchainVersion: "",
                initialBlockchainName: null,
                initialBlockchainChain: null,
                initialBlockchainStatus: false,
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
exports.default = BlockchainDetails;
