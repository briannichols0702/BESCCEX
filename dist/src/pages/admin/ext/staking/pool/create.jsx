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
const Card_1 = __importDefault(require("@/components/elements/base/card/Card"));
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const Input_1 = __importDefault(require("@/components/elements/form/input/Input"));
const Listbox_1 = __importDefault(require("@/components/elements/form/listbox/Listbox"));
const Textarea_1 = __importDefault(require("@/components/elements/form/textarea/Textarea"));
const InputFile_1 = __importDefault(require("@/components/elements/form/input-file/InputFile")); // Import the InputFile component
const next_i18next_1 = require("next-i18next");
const upload_1 = require("@/utils/upload"); // Import the imageUploader utility
const StakingPoolCreate = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const [formData, setFormData] = (0, react_1.useState)(null);
    const [name, setName] = (0, react_1.useState)("");
    const [description, setDescription] = (0, react_1.useState)("");
    const [type, setType] = (0, react_1.useState)(null);
    const [currency, setCurrency] = (0, react_1.useState)(null);
    const [chain, setChain] = (0, react_1.useState)(null);
    const [minStake, setMinStake] = (0, react_1.useState)("");
    const [maxStake, setMaxStake] = (0, react_1.useState)("");
    const [status, setStatus] = (0, react_1.useState)(null);
    const [imageUrl, setImageUrl] = (0, react_1.useState)(null); // State to hold the uploaded image URL
    const router = (0, router_1.useRouter)();
    (0, react_1.useEffect)(() => {
        fetchFormData();
    }, []);
    const fetchFormData = async () => {
        const { data, error } = await (0, api_1.default)({
            url: "/api/admin/ext/staking/pool/data",
            silent: true,
        });
        if (!error && data) {
            setFormData(data);
        }
    };
    const handleSubmit = async () => {
        const body = {
            name,
            description,
            type: type === null || type === void 0 ? void 0 : type.value,
            currency: currency === null || currency === void 0 ? void 0 : currency.value,
            chain: chain === null || chain === void 0 ? void 0 : chain.value,
            minStake: parseFloat(minStake),
            maxStake: parseFloat(maxStake),
            status: status === null || status === void 0 ? void 0 : status.value,
            icon: imageUrl || "", // Include the image URL in the body
        };
        const { error } = await (0, api_1.default)({
            url: `/api/admin/ext/staking/pool`,
            method: "POST",
            body,
        });
        if (!error) {
            router.push(`/admin/ext/staking/pool`);
        }
    };
    const handleFileUpload = async (files) => {
        if (files.length > 0) {
            const file = files[0];
            const result = await (0, upload_1.imageUploader)({
                file,
                dir: `staking/pools`, // You can change the directory path based on your requirements
                size: {
                    maxWidth: 720,
                    maxHeight: 720,
                },
            });
            if (result.success) {
                setImageUrl(result.url);
            }
            else {
                console.error("Error uploading file");
            }
        }
    };
    const getCurrencyOptions = () => {
        if (!type || !formData)
            return [];
        return formData.currencies[type.value] || [];
    };
    const getChainOptions = () => {
        var _a;
        if (!currency || !formData || !formData.chains)
            return [];
        return (((_a = formData.chains[currency.value]) === null || _a === void 0 ? void 0 : _a.map((chain) => ({
            value: chain,
            label: chain,
        }))) || []);
    };
    if (!formData)
        return null;
    return (<Default_1.default title={t("Create Staking Pool")} color="muted">
      <Card_1.default className="p-5 mb-5 text-muted-800 dark:text-muted-100">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-lg mb-4 md:mb-0">{t("New Staking Pool")}</h1>
          <div className="flex gap-2">
            <Button_1.default onClick={() => router.push(`/admin/ext/staking/pool`)} variant="outlined" shape="rounded-sm" size="md" color="danger">
              {t("Cancel")}
            </Button_1.default>
            <Button_1.default onClick={handleSubmit} variant="outlined" shape="rounded-sm" size="md" color="success">
              {t("Save")}
            </Button_1.default>
          </div>
        </div>

        <div className="my-5">
          <InputFile_1.default id="pool-image" acceptedFileTypes={[
            "image/png",
            "image/jpeg",
            "image/jpg",
            "image/gif",
            "image/svg+xml",
            "image/webp",
        ]} preview={imageUrl} previewPlaceholder="/img/placeholder.svg" maxFileSize={16} label={`${t("Max File Size")}: 16 MB`} labelAlt={`${t("Size")}: 720x720 px`} bordered color="default" onChange={handleFileUpload} onRemoveFile={() => setImageUrl(null)}/>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <Input_1.default label={t("Name")} placeholder={t("Enter the pool name")} value={name} onChange={(e) => setName(e.target.value)}/>
          <Listbox_1.default label={t("Wallet Type")} options={[
            { value: "FIAT", label: t("Fiat") },
            { value: "SPOT", label: t("Spot") },
            { value: "ECO", label: t("Funding") },
        ]} selected={type} setSelected={setType}/>
          <Listbox_1.default label={t("Currency")} options={getCurrencyOptions()} selected={currency} setSelected={(selectedOption) => setCurrency(selectedOption)}/>
          {(type === null || type === void 0 ? void 0 : type.value) === "ECO" && (<Listbox_1.default label={t("Chain")} options={getChainOptions()} selected={chain} setSelected={setChain}/>)}
          <Input_1.default label={t("Minimum Stake")} placeholder={t("Enter the minimum staking amount")} value={minStake} onChange={(e) => setMinStake(e.target.value)}/>
          <Input_1.default label={t("Maximum Stake")} placeholder={t("Enter the maximum staking amount")} value={maxStake} onChange={(e) => setMaxStake(e.target.value)}/>
          <Textarea_1.default label={t("Description")} placeholder={t("Enter the pool description")} value={description} onChange={(e) => setDescription(e.target.value)}/>
          <Listbox_1.default label={t("Status")} options={[
            { value: "ACTIVE", label: t("Active") },
            { value: "INACTIVE", label: t("Inactive") },
            { value: "COMPLETED", label: t("Completed") },
        ]} selected={status} setSelected={setStatus}/>
        </div>
      </Card_1.default>
    </Default_1.default>);
};
exports.default = StakingPoolCreate;
