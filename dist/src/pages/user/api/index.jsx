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
const Default_1 = __importDefault(require("@/layouts/Default"));
const react_1 = __importStar(require("react"));
const api_1 = __importDefault(require("@/utils/api"));
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const Card_1 = __importDefault(require("@/components/elements/base/card/Card"));
const react_2 = require("@iconify/react");
const next_i18next_1 = require("next-i18next");
const sonner_1 = require("sonner");
const Input_1 = __importDefault(require("@/components/elements/form/input/Input"));
const Checkbox_1 = __importDefault(require("@/components/elements/form/checkbox/Checkbox"));
const Modal_1 = __importDefault(require("@/components/elements/base/modal/Modal"));
const IconButton_1 = __importDefault(require("@/components/elements/base/button-icon/IconButton"));
const Radio_1 = __importDefault(require("@/components/elements/form/radio/Radio"));
const ApiKeyManagement = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const [apiKeys, setApiKeys] = (0, react_1.useState)([]);
    const [isEditing, setIsEditing] = (0, react_1.useState)(null);
    const [isCreating, setIsCreating] = (0, react_1.useState)(false);
    const [newKeyName, setNewKeyName] = (0, react_1.useState)("");
    const [permissions, setPermissions] = (0, react_1.useState)([]);
    const [ipWhitelist, setIpWhitelist] = (0, react_1.useState)([]);
    const [ipInput, setIpInput] = (0, react_1.useState)("");
    const [ipRestriction, setIpRestriction] = (0, react_1.useState)("restricted");
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [creating, setCreating] = (0, react_1.useState)(false);
    const [showFullKey, setShowFullKey] = (0, react_1.useState)(null);
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
    (0, react_1.useEffect)(() => {
        fetchApiKeys();
    }, []);
    const fetchApiKeys = async () => {
        setLoading(true);
        const { data, error } = await (0, api_1.default)({ url: "/api/api-key", silent: true });
        if (!error) {
            const parsedData = data.map((key) => ({
                ...key,
                permissions: key.permissions
                    ? typeof key.permissions === "string"
                        ? JSON.parse(key.permissions)
                        : key.permissions
                    : [],
                ipWhitelist: key.ipWhitelist
                    ? typeof key.ipWhitelist === "string"
                        ? JSON.parse(key.ipWhitelist)
                        : key.ipWhitelist
                    : [],
            }));
            setApiKeys(parsedData);
        }
        else {
            sonner_1.toast.error(t("Failed to fetch API keys"));
        }
        setLoading(false);
    };
    const createApiKey = async () => {
        setCreating(true);
        const { data, error } = await (0, api_1.default)({
            url: "/api/api-key",
            method: "POST",
            body: {
                name: newKeyName,
                permissions: Array.isArray(permissions) ? permissions : [],
                ipWhitelist: ipRestriction === "restricted" ? ipWhitelist : [],
                ipRestriction: ipRestriction === "restricted",
            },
        });
        if (!error) {
            setApiKeys([...apiKeys, data]);
            resetForm();
            sonner_1.toast.success(t("API key created successfully"));
        }
        else {
            sonner_1.toast.error(t("Failed to create API key"));
        }
        setCreating(false);
    };
    const deleteApiKey = async (id) => {
        const { error } = await (0, api_1.default)({
            url: `/api/api-key/${id}`,
            method: "DELETE",
        });
        if (!error) {
            setApiKeys(apiKeys.filter((key) => key.id !== id));
            sonner_1.toast.success(t("API key deleted successfully"));
        }
        else {
            sonner_1.toast.error(t("Failed to delete API key"));
        }
    };
    const handleEdit = (id) => {
        const keyToEdit = apiKeys.find((key) => key.id === id);
        if (keyToEdit) {
            setIsEditing(id);
            setPermissions(Array.isArray(keyToEdit.permissions) ? keyToEdit.permissions : []); // Ensure clean array
            setIpWhitelist(Array.isArray(keyToEdit.ipWhitelist) ? keyToEdit.ipWhitelist : []);
            setIpRestriction(keyToEdit.ipRestriction ? "restricted" : "unrestricted");
        }
    };
    const handlePermissionToggle = (permission) => {
        setPermissions((prevPermissions) => {
            if (!Array.isArray(prevPermissions))
                prevPermissions = [];
            return prevPermissions.includes(permission)
                ? prevPermissions.filter((p) => p !== permission) // Remove permission
                : [...prevPermissions, permission]; // Add permission
        });
    };
    const updateApiKey = async () => {
        if (!isEditing)
            return;
        // Debug log
        console.log("Payload before sending:", {
            permissions,
            ipWhitelist: ipRestriction === "restricted" ? ipWhitelist : [],
            ipRestriction: ipRestriction === "restricted",
        });
        const { error } = await (0, api_1.default)({
            url: `/api/api-key/${isEditing}`,
            method: "PUT",
            body: {
                permissions: Array.isArray(permissions) ? permissions : [],
                ipWhitelist: ipRestriction === "restricted" ? ipWhitelist : [],
                ipRestriction: ipRestriction === "restricted",
            },
        });
        if (!error) {
            sonner_1.toast.success(t("API key updated successfully"));
            setIsEditing(null);
            fetchApiKeys();
        }
        else {
            sonner_1.toast.error(t("Failed to update API key"));
        }
    };
    const addIpToWhitelist = () => {
        if (ipInput && !ipWhitelist.includes(ipInput)) {
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
    const maskApiKey = (key) => {
        return `**** **** **** ${key.slice(-5)}`;
    };
    const resetForm = () => {
        setPermissions([]);
        setIpWhitelist([]);
        setIpInput("");
        setIpRestriction("restricted");
        setIsCreating(false);
    };
    return (<Default_1.default title={t("API Key Management")}>
      <div className="flex flex-col gap-8 p-4 sm:p-6 lg:p-8">
        <Card_1.default className="p-6 dark:bg-muted-900">
          <h2 className="text-lg font-semibold mb-4 dark:text-muted-100">
            {t("API Key Management")}
          </h2>
          <p className="dark:text-muted-400">
            {t("1. Each account can create up to 10 API Keys.")}
          </p>
          <p className="dark:text-muted-400">
            {t("2. Do not disclose your API Key.")}
          </p>
          <p className="dark:text-muted-400">
            {t("3. Restrict access to trusted IPs only for increased security.")}
          </p>
          <p className="dark:text-muted-400">
            {t("4. Complete KYC to create an API key.")}
          </p>
          <div className="mt-6">
            <Button_1.default onClick={() => setIsCreating(true)} color="primary">
              {t("Create API Key")}
            </Button_1.default>
          </div>
        </Card_1.default>

        {loading ? (<div className="flex justify-center items-center">
            <react_2.Icon icon="mdi:loading" className="animate-spin h-8 w-8 dark:text-white"/>
          </div>) : apiKeys.length > 0 ? (<div className="flex flex-col gap-5">
            {apiKeys.map((key) => (<Card_1.default key={key.id} className="p-6 dark:bg-muted-900">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div className="flex-1">
                    <h4 className="text-md font-semibold dark:text-muted-100">
                      {key.name}
                    </h4>
                    <p className="text-sm text-muted-600 dark:text-muted-400">
                      {showFullKey === key.id ? key.key : maskApiKey(key.key)}
                    </p>
                  </div>
                  <div className="flex gap-3 mt-4 sm:mt-0">
                    <Button_1.default onClick={() => handleEdit(key.id)}>
                      {isEditing === key.id ? t("Close") : t("Edit")}
                    </Button_1.default>
                    <Button_1.default color="danger" onClick={() => deleteApiKey(key.id)}>
                      {t("Delete")}
                    </Button_1.default>
                  </div>
                </div>
                {isEditing === key.id && (<div className="mt-4">
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      {permissionOptions.map((perm) => (<div key={perm.value} className="flex items-center gap-2">
                          <Checkbox_1.default id={perm.value} checked={Array.isArray(permissions) &&
                            permissions.includes(perm.value)} // Safeguard against malformed data
                     onChange={() => handlePermissionToggle(perm.value)}/>
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

                    <div className="mt-4 flex justify-end gap-3">
                      <Button_1.default onClick={() => setIsEditing(null)} // Close edit mode
                >
                        {t("Cancel")}
                      </Button_1.default>
                      <Button_1.default onClick={updateApiKey} color="primary">
                        {t("Save")}
                      </Button_1.default>
                    </div>
                  </div>)}
              </Card_1.default>))}
          </div>) : (<div className="flex justify-center items-center text-muted-600 dark:text-muted-400">
            {t("No API keys found. Create a new one to get started.")}
          </div>)}

        <Modal_1.default open={isCreating} size="xl">
          <Card_1.default shape="smooth" className="dark:bg-muted-900">
            <div className="flex items-center justify-between p-4 md:p-6">
              <p className="font-sans text-lg font-medium text-muted-900 dark:text-white">
                {t("Create New API Key")}
              </p>
              <IconButton_1.default size="sm" shape="full" onClick={() => setIsCreating(false)}>
                <react_2.Icon icon="lucide:x" className="h-4 w-4 dark:text-white"/>
              </IconButton_1.default>
            </div>
            <div className="p-4 md:px-6 md:py-8">
              <div className="w-full">
                <Input_1.default placeholder={t("API Key Name")} value={newKeyName} onChange={(e) => setNewKeyName(e.target.value)} disabled={creating} className="dark:bg-muted-800 dark:text-white"/>
                <div className="grid grid-cols-2 gap-3 mt-4">
                  {permissionOptions.map((perm) => (<div key={perm.value} className="flex items-center gap-2">
                      <Checkbox_1.default id={perm.value} checked={permissions.includes(perm.value)} onChange={() => setPermissions((prev) => Array.isArray(prev) && prev.includes(perm.value)
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
                <div className="mt-4">
                  <h4 className="text-md font-semibold dark:text-muted-100 mb-2">
                    {t("IP Access Restrictions")}
                  </h4>
                  <div className="flex flex-col items-start gap-2 mb-4">
                    <Radio_1.default type="radio" id="unrestricted-create" name="ipRestrictionCreate" value="unrestricted" label={t("Unrestricted (Less Secure)")} checked={ipRestriction === "unrestricted"} onChange={() => setIpRestriction("unrestricted")}/>
                    <div>
                      <p className="text-xs text-red-500 dark:text-red-400">
                        {t("This API Key allows access from any IP address. This is not recommended.")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Radio_1.default id="restricted-create" name="ipRestrictionCreate" label={t("Restrict access to trusted IPs only (Recommended)")} value="restricted" checked={ipRestriction === "restricted"} onChange={() => setIpRestriction("restricted")}/>
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
              </div>
            </div>
            <div className="p-4 md:p-6 flex justify-end gap-2">
              <Button_1.default onClick={() => setIsCreating(false)} shape="smooth">
                {t("Cancel")}
              </Button_1.default>
              <Button_1.default variant="solid" color="primary" shape="smooth" onClick={createApiKey} loading={creating}>
                {creating ? t("Creating...") : t("Create")}
              </Button_1.default>
            </div>
          </Card_1.default>
        </Modal_1.default>
      </div>
    </Default_1.default>);
};
exports.default = ApiKeyManagement;
