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
const Select_1 = __importDefault(require("@/components/elements/form/select/Select"));
const Input_1 = __importDefault(require("@/components/elements/form/input/Input"));
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const next_i18next_1 = require("next-i18next");
const lodash_1 = require("lodash");
const sonner_1 = require("sonner");
const api_1 = __importDefault(require("@/utils/api"));
const OrderDownloadOptions = ({ order, orderItem, fetchOrder }) => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const [downloadOption, setDownloadOption] = (0, react_1.useState)("");
    const [downloadLink, setDownloadLink] = (0, react_1.useState)("");
    const [licenseKey, setLicenseKey] = (0, react_1.useState)("");
    (0, react_1.useEffect)(() => {
        if (orderItem) {
            if (orderItem.key && orderItem.filePath) {
                setDownloadOption("both");
                setLicenseKey(orderItem.key);
                setDownloadLink(orderItem.filePath);
            }
            else if (orderItem.key) {
                setDownloadOption("license");
                setLicenseKey(orderItem.key);
            }
            else if (orderItem.filePath) {
                setDownloadOption("file");
                setDownloadLink(orderItem.filePath);
            }
        }
    }, [orderItem]);
    const handleDownloadOptionUpdate = async () => {
        if (!order)
            return;
        if (!downloadOption) {
            sonner_1.toast.error("Please select a download option");
            return;
        }
        if (downloadOption === "both" &&
            (licenseKey === "" || downloadLink === "")) {
            sonner_1.toast.error("Please fill in both license key and download link");
            return;
        }
        if (downloadOption === "license" && licenseKey === "") {
            sonner_1.toast.error("Please fill in the license key");
            return;
        }
        if (downloadOption === "file" && downloadLink === "") {
            sonner_1.toast.error("Please fill in the download link");
            return;
        }
        const { data, error } = await (0, api_1.default)({
            url: `/api/admin/ext/ecommerce/order/${order.id}/download`,
            method: "PUT",
            body: {
                orderItemId: orderItem.id,
                key: licenseKey !== "" ? licenseKey : undefined,
                filePath: downloadLink !== "" ? downloadLink : undefined,
            },
            silent: true,
        });
        if (!error) {
            fetchOrder();
        }
    };
    return (<div className="mb-4">
      <h2 className="text-lg font-semibold mb-5 dark:text-white">
        {t("Download Options")}
      </h2>
      <Select_1.default value={downloadOption} onChange={(option) => setDownloadOption(option.target.value)} options={[
            { value: "", label: (0, lodash_1.capitalize)(t("Select Option")) },
            { value: "license", label: t("License Key") },
            { value: "file", label: t("Downloadable File") },
            { value: "both", label: t("Both") },
        ]}/>
      {downloadOption && (<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {(downloadOption === "license" || downloadOption === "both") && (<Input_1.default value={licenseKey} onChange={(e) => setLicenseKey(e.target.value)} label={t("License Key")} type="text" placeholder={t("License Key")}/>)}
          {(downloadOption === "file" || downloadOption === "both") && (<Input_1.default value={downloadLink} onChange={(e) => setDownloadLink(e.target.value)} label={t("Download Link")} type="text" placeholder={t("Download Link")}/>)}
        </div>)}
      <div className="flex justify-end">
        <Button_1.default color="primary" onClick={handleDownloadOptionUpdate} className="mt-4">
          {t("Update Order")}
        </Button_1.default>
      </div>
    </div>);
};
exports.default = OrderDownloadOptions;
