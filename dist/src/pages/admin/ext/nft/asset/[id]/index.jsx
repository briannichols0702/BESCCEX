"use client";
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
const api_1 = __importDefault(require("@/utils/api"));
const Card_1 = __importDefault(require("@/components/elements/base/card/Card"));
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const Input_1 = __importDefault(require("@/components/elements/form/input/Input"));
const Textarea_1 = __importDefault(require("@/components/elements/form/textarea/Textarea"));
const InputFile_1 = __importDefault(require("@/components/elements/form/input-file/InputFile"));
const Listbox_1 = __importDefault(require("@/components/elements/form/listbox/Listbox"));
const next_i18next_1 = require("next-i18next");
const upload_1 = require("@/utils/upload");
const BackButton_1 = require("@/components/elements/base/button/BackButton");
const sonner_1 = require("sonner");
const NftAssetEdit = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const [name, setName] = (0, react_1.useState)("");
    const [description, setDescription] = (0, react_1.useState)("");
    const [imageUrl, setImageUrl] = (0, react_1.useState)(null);
    const [metadata, setMetadata] = (0, react_1.useState)("");
    const [creatorId, setCreatorId] = (0, react_1.useState)("");
    const [ownerId, setOwnerId] = (0, react_1.useState)("");
    const [price, setPrice] = (0, react_1.useState)("");
    const [network, setNetwork] = (0, react_1.useState)("");
    const [royalty, setRoyalty] = (0, react_1.useState)("");
    const [status, setStatus] = (0, react_1.useState)(null);
    const router = (0, router_1.useRouter)();
    const { id } = router.query;
    const statusOptions = [
        { value: "true", label: t("Active") },
        { value: "false", label: t("Inactive") },
    ];
    (0, react_1.useEffect)(() => {
        if (router.isReady) {
            fetchAssetData();
        }
    }, [router.isReady]);
    const fetchAssetData = async () => {
        var _a, _b;
        if (!id)
            return;
        const { data, error } = await (0, api_1.default)({
            url: `/api/admin/ext/nft/asset/${id}`,
            silent: true,
        });
        if (!error && data) {
            setName(data.name);
            setDescription(data.description);
            setImageUrl(data.image);
            setMetadata(data.metadata);
            setCreatorId(data.creatorId);
            setOwnerId(data.ownerId);
            setPrice(((_a = data.price) === null || _a === void 0 ? void 0 : _a.toString()) || "");
            setNetwork(data.network);
            setRoyalty(((_b = data.royalty) === null || _b === void 0 ? void 0 : _b.toString()) || "");
            setStatus(statusOptions.find((option) => option.value === data.status.toString()) || null);
        }
    };
    const handleSubmit = async () => {
        const body = {
            name,
            description,
            image: imageUrl || "",
            metadata,
            creatorId,
            ownerId,
            price: price ? parseFloat(price) : null,
            network,
            royalty: royalty ? parseFloat(royalty) : null,
            status: (status === null || status === void 0 ? void 0 : status.value) === "true",
        };
        const { error } = await (0, api_1.default)({
            url: `/api/admin/ext/nft/asset/${id}`,
            method: "PUT",
            body,
        });
        if (!error) {
            sonner_1.toast.success(t("NFT Asset updated successfully"));
            router.push(`/admin/ext/nft/asset`);
        }
        else {
            sonner_1.toast.error(t("Failed to update NFT Asset"));
        }
    };
    const handleFileUpload = async (files) => {
        if (files.length > 0) {
            const file = files[0];
            const result = await (0, upload_1.imageUploader)({
                file,
                dir: `nft/assets`, // Directory for storing NFT asset images
                size: {
                    maxWidth: 1024,
                    maxHeight: 1024,
                },
                oldPath: imageUrl || undefined, // Replace old image if exists
            });
            if (result.success) {
                setImageUrl(result.url);
            }
            else {
                console.error("Error uploading file");
            }
        }
    };
    return (<Default_1.default title={t("Edit NFT Asset")} color="muted">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold dark:text-white">
          {t("Edit NFT Asset")}
        </h1>
        <BackButton_1.BackButton href="/admin/ext/nft/asset"/>
      </div>
      <Card_1.default className="p-5 mb-5 text-muted-800 dark:text-muted-100">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0"></div>
          <div className="flex gap-2">
            <Button_1.default onClick={() => router.push(`/admin/ext/nft/asset`)} variant="outlined" shape="rounded-sm" size="md" color="danger">
              {t("Cancel")}
            </Button_1.default>
            <Button_1.default onClick={handleSubmit} variant="outlined" shape="rounded-sm" size="md" color="success">
              {t("Save")}
            </Button_1.default>
          </div>
        </div>
        <div className="my-5">
          <InputFile_1.default id="nft-asset-image" acceptedFileTypes={[
            "image/png",
            "image/jpeg",
            "image/jpg",
            "image/gif",
            "image/svg+xml",
            "image/webp",
        ]} preview={imageUrl} previewPlaceholder="/img/placeholder.svg" maxFileSize={16} label={`${t("Max File Size")}: 16 MB`} labelAlt={`${t("Recommended Size")}: 1024x1024 px`} bordered color="default" onChange={handleFileUpload} onRemoveFile={() => setImageUrl(null)}/>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <Input_1.default label={t("Name")} placeholder={t("Enter the NFT asset name")} value={name} onChange={(e) => setName(e.target.value)}/>
          <Textarea_1.default label={t("Description")} placeholder={t("Enter the NFT asset description")} value={description} onChange={(e) => setDescription(e.target.value)}/>
          <Input_1.default label={t("Metadata")} placeholder={t("Enter metadata URL or JSON")} value={metadata} onChange={(e) => setMetadata(e.target.value)}/>
          <Input_1.default label={t("Creator ID")} placeholder={t("Enter the creator's user ID")} value={creatorId} onChange={(e) => setCreatorId(e.target.value)}/>
          <Input_1.default label={t("Owner ID")} placeholder={t("Enter the owner's user ID")} value={ownerId} onChange={(e) => setOwnerId(e.target.value)}/>
          <Input_1.default label={t("Price")} placeholder={t("Enter the price")} value={price} onChange={(e) => setPrice(e.target.value)}/>
          <Input_1.default label={t("Network")} placeholder={t("Enter the blockchain network")} value={network} onChange={(e) => setNetwork(e.target.value)}/>
          <Input_1.default label={t("Royalty")} placeholder={t("Enter the royalty percentage")} value={royalty} onChange={(e) => setRoyalty(e.target.value)}/>
          <Listbox_1.default label={t("Status")} options={statusOptions} selected={status} setSelected={setStatus}/>
        </div>
      </Card_1.default>
    </Default_1.default>);
};
exports.default = NftAssetEdit;
exports.permission = "Access NFT Asset Management";
