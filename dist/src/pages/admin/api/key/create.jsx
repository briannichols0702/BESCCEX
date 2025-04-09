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
const react_1 = __importStar(require("react"));
const router_1 = require("next/router");
const Default_1 = __importDefault(require("@/layouts/Default"));
const api_1 = __importDefault(require("@/utils/api"));
const Card_1 = __importDefault(require("@/components/elements/base/card/Card"));
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const Input_1 = __importDefault(require("@/components/elements/form/input/Input"));
const Checkbox_1 = __importDefault(require("@/components/elements/form/checkbox/Checkbox"));
const Radio_1 = __importDefault(require("@/components/elements/form/radio/Radio"));
const next_i18next_1 = require("next-i18next");
const sonner_1 = require("sonner");
const IconButton_1 = __importDefault(require("@/components/elements/base/button-icon/IconButton"));
const react_2 = require("@iconify/react");
const Select_1 = __importDefault(require("@/components/elements/form/select/Select"));
const ApiKeyCreate = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const router = (0, router_1.useRouter)();
    const [name, setName] = (0, react_1.useState)("");
    const [permissions, setPermissions] = (0, react_1.useState)([]);
    const [ipWhitelist, setIpWhitelist] = (0, react_1.useState)([]);
    const [ipInput, setIpInput] = (0, react_1.useState)("");
    const [ipRestriction, setIpRestriction] = (0, react_1.useState)("restricted");
    const [creating, setCreating] = (0, react_1.useState)(false);
    const [type, setType] = (0, react_1.useState)("user");
    const permissionOptions = [
        {
            label: t("Trade"),
            value: "trade",
            description: t("Allows placing orders and trading on the exchange."),
        },
        {
            label: t("Futures"),
            value: "futures",
            description: t("Allows trading in futures markets."),
        },
        {
            label: t("Deposit"),
            value: "deposit",
            description: t("Allows viewing deposit addresses and history."),
        },
        {
            label: t("Withdraw"),
            value: "withdraw",
            description: t("Allows withdrawals from the account."),
        },
        {
            label: t("Transfer"),
            value: "transfer",
            description: t("Allows transfers between your accounts."),
        },
        {
            label: t("Payment"),
            value: "payment",
            description: t("Allows creating and confirming payments."),
        },
    ];
    const addIpToWhitelist = () => {
        if (ipInput.trim() && !ipWhitelist.includes(ipInput)) {
            setIpWhitelist([...ipWhitelist, ipInput]);
            setIpInput("");
        }
        else {
            sonner_1.toast.error(t("IP address is already in the whitelist or invalid."));
        }
    };
    const removeIpFromWhitelist = (ip) => {
        setIpWhitelist(ipWhitelist.filter((item) => item !== ip));
    };
    const handleSubmit = async () => {
        setCreating(true);
        const sanitizedPermissions = permissions.filter((perm) => !["[", "]"].includes(perm) // Remove brackets and any invalid strings
        );
        const body = {
            name,
            permissions: sanitizedPermissions, // Use the sanitized permissions
            ipWhitelist: ipRestriction === "restricted" ? ipWhitelist : [],
            ipRestriction: ipRestriction === "restricted",
            type,
        };
        const { error } = await (0, api_1.default)({
            url: "/api/admin/api",
            method: "POST",
            body,
        });
        setCreating(false);
        if (!error) {
            sonner_1.toast.success(t("API key created successfully"));
            router.push("/admin/api/key");
        }
        else {
            sonner_1.toast.error(t("Failed to create API key"));
        }
    };
    return (<Default_1.default title={t("Create API Key")} color="muted">
      <Card_1.default className="p-6 mb-5 text-muted-800 dark:text-muted-100">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-lg mb-4 md:mb-0">{t("New API Key")}</h1>
          <div className="flex gap-2">
            <Button_1.default onClick={() => router.push(`/admin/api/key`)} variant="outlined" shape="rounded-sm" size="md" color="danger">
              {t("Cancel")}
            </Button_1.default>
            <Button_1.default onClick={handleSubmit} variant="outlined" shape="rounded-sm" size="md" color="success" disabled={creating || !name.trim()}>
              {creating ? t("Saving...") : t("Save")}
            </Button_1.default>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <Input_1.default label={t("API Key Name")} placeholder={t("Enter API Key Name")} value={name} onChange={(e) => setName(e.target.value)}/>
          <Select_1.default label={t("Type")} value={type} options={[
            { label: t("User"), value: "user" },
            { label: t("Plugin"), value: "plugin" },
        ]} onChange={(e) => setType(e.target.value)}/>
        </div>
        <div className="mt-6">
          <h4 className="text-lg font-semibold">{t("Permissions")}</h4>

          <div className="grid grid-cols-2 gap-3 mt-4">
            {permissionOptions.map((perm) => (<div key={perm.value} className="flex items-center gap-2">
                <Checkbox_1.default id={perm.value} checked={permissions.includes(perm.value)} onChange={() => setPermissions((prev) => prev.includes(perm.value)
                ? prev.filter((p) => p !== perm.value)
                : [...prev, perm.value])}/>
                <div>
                  <label htmlFor={perm.value} className="cursor-pointer dark:text-white text-md">
                    {perm.label}
                  </label>
                  <small className="block text-muted-500 dark:text-muted-400 text-sm">
                    {perm.description}
                  </small>
                </div>
              </div>))}
          </div>
        </div>
        <div className="mt-4">
          <h4 className="text-md font-semibold dark:text-muted-100 mb-2">
            {t("IP Access Restrictions")}
          </h4>
          <div className="flex items-center gap-2 mb-4">
            <Radio_1.default type="radio" id="unrestricted" name="ipRestriction" value="unrestricted" label={t("Unrestricted (Less Secure)")} checked={ipRestriction === "unrestricted"} onChange={() => setIpRestriction("unrestricted")}/>
            <p className="text-xs text-red-500 dark:text-red-400">
              {t("This API Key allows access from any IP address. This is not recommended.")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Radio_1.default type="radio" id="restricted" name="ipRestriction" value="restricted" label={t("Restrict access to trusted IPs only (Recommended)")} checked={ipRestriction === "restricted"} onChange={() => setIpRestriction("restricted")}/>
          </div>
          {ipRestriction === "restricted" && (<>
              <Input_1.default placeholder={t("Enter IP to Whitelist")} value={ipInput} onChange={(e) => setIpInput(e.target.value)} className="dark:bg-muted-800 dark:text-white mt-2" onKeyPress={(e) => {
                if (e.key === "Enter")
                    addIpToWhitelist();
            }}/>
              <Button_1.default onClick={addIpToWhitelist} className="mt-2" disabled={!ipInput.trim()}>
                {t("Add IP")}
              </Button_1.default>
              <div className="mt-2">
                {Array.isArray(ipWhitelist) &&
                ipWhitelist.map((ip, index) => (<div key={index} className="flex items-center gap-2 mt-1">
                      <span className="dark:text-white">{ip}</span>
                      <IconButton_1.default size="sm" onClick={() => removeIpFromWhitelist(ip)}>
                        <react_2.Icon icon="mdi:close" className="h-4 w-4 dark:text-white"/>
                      </IconButton_1.default>
                    </div>))}
              </div>
            </>)}
        </div>
      </Card_1.default>
    </Default_1.default>);
};
exports.default = ApiKeyCreate;
