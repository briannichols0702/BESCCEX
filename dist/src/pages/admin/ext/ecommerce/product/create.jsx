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
exports.getServerSideProps = void 0;
const react_1 = __importStar(require("react"));
const router_1 = require("next/router");
const Default_1 = __importDefault(require("@/layouts/Default"));
const api_1 = __importStar(require("@/utils/api"));
const Card_1 = __importDefault(require("@/components/elements/base/card/Card"));
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const Input_1 = __importDefault(require("@/components/elements/form/input/Input"));
const Listbox_1 = __importDefault(require("@/components/elements/form/listbox/Listbox"));
const InputFile_1 = __importDefault(require("@/components/elements/form/input-file/InputFile"));
const next_i18next_1 = require("next-i18next");
const RichTextEditor_1 = __importDefault(require("@/components/elements/addons/RichTextEditor"));
const upload_1 = require("@/utils/upload");
const Textarea_1 = __importDefault(require("@/components/elements/form/textarea/Textarea"));
const EcommerceProductCreate = ({ initialFormData, }) => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const router = (0, router_1.useRouter)();
    const [formData, setFormData] = (0, react_1.useState)(initialFormData);
    const [name, setName] = (0, react_1.useState)("");
    const [description, setDescription] = (0, react_1.useState)(""); // Use for the RichTextEditor
    const [shortDescription, setShortDescription] = (0, react_1.useState)("");
    const [type, setType] = (0, react_1.useState)(null);
    const [price, setPrice] = (0, react_1.useState)("");
    const [category, setCategory] = (0, react_1.useState)(null);
    const [inventoryQuantity, setInventoryQuantity] = (0, react_1.useState)("");
    const [filePath, setFilePath] = (0, react_1.useState)(null);
    const [walletType, setWalletType] = (0, react_1.useState)(null);
    const [currency, setCurrency] = (0, react_1.useState)(null);
    const [status, setStatus] = (0, react_1.useState)(null);
    const handleSubmit = async () => {
        const body = {
            name,
            description,
            shortDescription,
            type: type === null || type === void 0 ? void 0 : type.value,
            price: parseFloat(price),
            categoryId: category === null || category === void 0 ? void 0 : category.value,
            inventoryQuantity: parseInt(inventoryQuantity),
            image: filePath,
            walletType: walletType === null || walletType === void 0 ? void 0 : walletType.value,
            currency: currency === null || currency === void 0 ? void 0 : currency.value,
            status: status === null || status === void 0 ? void 0 : status.value,
        };
        const { error } = await (0, api_1.default)({
            url: "/api/admin/ext/ecommerce/product",
            method: "POST",
            body,
        });
        if (!error) {
            router.push(`/admin/ext/ecommerce/product`);
        }
    };
    const handleFileUpload = async (files) => {
        if (files.length > 0) {
            const file = files[0];
            const result = await (0, upload_1.imageUploader)({
                file,
                dir: `ecommerce/products`,
                size: {
                    maxWidth: 720,
                    maxHeight: 720,
                },
            });
            if (result.success) {
                setFilePath(result.url);
            }
            else {
                console.error("Error uploading file");
            }
        }
    };
    const getCurrencyOptions = () => {
        if (!walletType || !formData)
            return [];
        return formData.currencyConditions[walletType.value] || [];
    };
    if (!formData)
        return null;
    return (<Default_1.default title={t("Create E-commerce Product")} color="muted">
      <Card_1.default className="p-5 mb-5 text-muted-800 dark:text-muted-100">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-lg">{t("New Product")}</h1>
          <div className="flex gap-2">
            <Button_1.default onClick={() => router.push(`/admin/ext/ecommerce/product`)} variant="outlined" shape="rounded-sm" size="md" color="danger">
              {t("Cancel")}
            </Button_1.default>
            <Button_1.default onClick={handleSubmit} variant="outlined" shape="rounded-sm" size="md" color="success">
              {t("Create")}
            </Button_1.default>
          </div>
        </div>
        <InputFile_1.default id="product-image" acceptedFileTypes={["image/png", "image/jpeg", "image/webp"]} preview={filePath} previewPlaceholder="/img/placeholder.svg" maxFileSize={16} label={`${t("Max File Size")}: 16 MB`} onChange={handleFileUpload} onRemoveFile={() => setFilePath(null)}/>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          <Listbox_1.default label={t("Type")} options={[
            { value: "DOWNLOADABLE", label: t("Downloadable") },
            { value: "PHYSICAL", label: t("Physical") },
        ]} selected={type} setSelected={setType}/>
          <Listbox_1.default label={t("Category")} options={formData.categories} selected={category} setSelected={setCategory}/>
          <Input_1.default label={t("Name")} placeholder={t("Enter the product name")} value={name} onChange={(e) => setName(e.target.value)}/>
          <Input_1.default label={t("Price")} placeholder={t("Enter the product price")} value={price} onChange={(e) => setPrice(e.target.value)}/>
          <Listbox_1.default label={t("Wallet Type")} options={formData.walletTypes} selected={walletType} setSelected={(option) => {
            setWalletType(option);
            setCurrency(null); // Reset currency when wallet type changes
        }}/>
          <Listbox_1.default label={t("Currency")} options={getCurrencyOptions()} selected={currency} setSelected={setCurrency}/>
          <Input_1.default label={t("Inventory Quantity")} placeholder={t("Enter inventory quantity")} value={inventoryQuantity} onChange={(e) => setInventoryQuantity(e.target.value)}/>
          <Listbox_1.default label={t("Status")} options={[
            { value: true, label: t("Yes") },
            { value: false, label: t("No") },
        ]} selected={status} setSelected={setStatus}/>
        </div>
        <Textarea_1.default label={t("Short Description")} placeholder={t("Enter the product short description")} value={shortDescription} onChange={(e) => setShortDescription(e.target.value)}/>
        <div className="my-6">
          <h2 className="text-md font-semibold mb-2">{t("Description")}</h2>
          <RichTextEditor_1.default value={description} onChange={setDescription} placeholder={t("Compose product description here...")}/>
        </div>
      </Card_1.default>
    </Default_1.default>);
};
async function getServerSideProps(context) {
    try {
        const { data } = await (0, api_1.$serverFetch)(context, {
            url: `/api/admin/ext/ecommerce/product/data`,
        });
        return {
            props: {
                initialFormData: data || null,
            },
        };
    }
    catch (error) {
        console.error("Error fetching form data:", error);
        return {
            props: {
                initialFormData: null,
            },
        };
    }
}
exports.getServerSideProps = getServerSideProps;
exports.default = EcommerceProductCreate;
