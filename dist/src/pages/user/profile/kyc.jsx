"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const router_1 = require("next/router");
const Default_1 = __importDefault(require("@/layouts/Default"));
const Card_1 = __importDefault(require("@/components/elements/base/card/Card"));
const api_1 = __importDefault(require("@/utils/api"));
const dashboard_1 = require("@/stores/dashboard");
const next_i18next_1 = require("next-i18next");
const BackButton_1 = require("@/components/elements/base/button/BackButton");
const Input_1 = __importDefault(require("@/components/elements/form/input/Input"));
const Textarea_1 = __importDefault(require("@/components/elements/form/textarea/Textarea"));
const lodash_1 = require("lodash");
const InputFile_1 = __importDefault(require("@/components/elements/form/input-file/InputFile"));
const Avatar_1 = __importDefault(require("@/components/elements/base/avatar/Avatar"));
const CheckboxHeadless_1 = __importDefault(require("@/components/elements/form/checkbox/CheckboxHeadless"));
const InputFileField_1 = __importDefault(require("@/components/elements/form/input-file-field/InputFileField"));
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const upload_1 = require("@/utils/upload");
const KycApplication = () => {
    var _a, _b;
    const { t } = (0, next_i18next_1.useTranslation)();
    const { profile, fetchProfile, setIsFetched } = (0, dashboard_1.useDashboardStore)();
    const router = (0, router_1.useRouter)();
    const [activeTemplate, setActiveTemplate] = (0, react_1.useState)(null);
    const [level, setLevel] = (0, react_1.useState)(0);
    const [formValues, setFormValues] = (0, react_1.useState)({});
    const [formErrors, setFormErrors] = (0, react_1.useState)({});
    const [generalKeys, setGeneralKeys] = (0, react_1.useState)([]);
    const [documentKeys, setDocumentKeys] = (0, react_1.useState)([]);
    const [selectedDocument, setSelectedDocument] = (0, react_1.useState)(null);
    const [documentSelectionError, setDocumentSelectionError] = (0, react_1.useState)(null);
    const [customFieldsFileUpload, setCustomFieldsFileUpload] = (0, react_1.useState)([]);
    const [frontFile, setFrontFile] = (0, react_1.useState)(null);
    const [frontPreviewUrl, setFrontPreviewUrl] = (0, react_1.useState)(null);
    const [backFile, setBackFile] = (0, react_1.useState)(null);
    const [backPreviewUrl, setBackPreviewUrl] = (0, react_1.useState)(null);
    const [selfieFile, setSelfieFile] = (0, react_1.useState)(null);
    const [selfiePreviewUrl, setSelfiePreviewUrl] = (0, react_1.useState)(null);
    const inputs = {
        firstName: {
            title: t("First Name"),
            autocomplete: "given-name",
            type: "text",
        },
        lastName: {
            title: t("Last Name"),
            autocomplete: "family-name",
            type: "text",
        },
        email: {
            title: t("Email"),
            autocomplete: "email",
            type: "email",
        },
        phone: {
            title: t("Phone"),
            autocomplete: "tel",
            type: "tel",
        },
        address: {
            title: t("Address"),
            autocomplete: "street-address",
            type: "text",
        },
        city: {
            title: t("City"),
            autocomplete: "address-level2",
            type: "text",
        },
        state: {
            title: t("State"),
            autocomplete: "address-level1",
            type: "text",
        },
        country: {
            title: t("Country"),
            autocomplete: "country",
            type: "text",
        },
        zip: {
            title: t("Zip"),
            autocomplete: "postal-code",
            type: "text",
        },
        dob: {
            title: t("Date of Birth"),
            autocomplete: "bday",
            type: "date",
        },
        ssn: {
            title: t("SSN"),
            autocomplete: "",
            type: "number",
        },
        documentPassport: {
            title: t("Passport"),
            type: "upload",
            description: t("Upload a clear image of your passport."),
        },
        documentDriversLicense: {
            title: t("Driver License"),
            type: "upload",
            description: t("Upload a clear image of your driver license."),
        },
        documentIdCard: {
            title: t("National ID"),
            type: "upload",
            description: t("Upload a clear image of your national ID card."),
        },
    };
    const documentRequirements = {
        documentPassport: [
            {
                side: "front",
                fileRef: setFrontFile,
                toastMessage: t("passport front side"),
                image: "/img/kyc/documentPassport.png",
            },
            {
                side: "selfie",
                fileRef: setSelfieFile,
                toastMessage: t("passport selfie"),
            },
        ],
        documentDriversLicense: [
            {
                side: "front",
                fileRef: setFrontFile,
                toastMessage: t("driver license front side"),
                image: "/img/kyc/documentDriversLicense.png",
            },
            {
                side: "selfie",
                fileRef: setSelfieFile,
                toastMessage: t("driver license selfie"),
            },
        ],
        documentIdCard: [
            {
                side: "front",
                fileRef: setFrontFile,
                toastMessage: t("national id front side"),
                image: "/img/kyc/documentIdCard.png",
            },
            {
                side: "back",
                fileRef: setBackFile,
                toastMessage: t("national id back side"),
                image: "/img/kyc/documentIdCardBack.png",
            },
            {
                side: "selfie",
                fileRef: setSelfieFile,
                toastMessage: t("national id selfie"),
            },
        ],
    };
    const handleFileUpload = async (file) => {
        try {
            const response = await (0, upload_1.imageUploader)({
                file,
                dir: `kyc/${selectedDocument}`,
                size: {
                    maxWidth: 720,
                    maxHeight: 720,
                },
                oldPath: "",
            });
            if (response.success) {
                return {
                    success: 1,
                    file: {
                        url: response.url,
                    },
                };
            }
            else {
                throw new Error("File upload failed");
            }
        }
        catch (error) {
            console.error("Error uploading file:", error);
            return { success: 0 };
        }
    };
    (0, react_1.useEffect)(() => {
        var _a;
        const kycLevel = parseInt(((_a = profile === null || profile === void 0 ? void 0 : profile.kyc) === null || _a === void 0 ? void 0 : _a.level) || "0");
        setLevel(kycLevel);
    }, [profile]);
    const fetchActiveKycTemplate = async () => {
        const { data, error } = await (0, api_1.default)({
            url: "/api/user/kyc/template",
            silent: true,
        });
        if (!error) {
            const options = JSON.parse(data.options, (key, value) => {
                if (value === "true")
                    return true;
                if (value === "false")
                    return false;
                return value;
            });
            const customOptions = JSON.parse(data.customOptions, (key, value) => {
                if (value === "true")
                    return true;
                if (value === "false")
                    return false;
                return value;
            });
            setActiveTemplate({ ...data, options, customOptions });
            const templateLevel = parseInt(router.query.l);
            setLevel(templateLevel);
            const generalKeys = Object.keys(options).filter((key) => !key.startsWith("document") &&
                options[key].enabled &&
                parseInt(options[key].level) === templateLevel);
            setGeneralKeys(generalKeys);
            const documentKeys = Object.keys(options).filter((key) => key.startsWith("document") &&
                options[key].enabled &&
                parseInt(options[key].level) === templateLevel);
            setDocumentKeys(documentKeys);
            // Update custom fields
            const customFieldsFileUpload = Object.entries(customOptions).map(([key, value]) => ({
                name: key,
                ...value,
            }));
            setCustomFieldsFileUpload(customFieldsFileUpload);
        }
        else {
            router.push("/user");
        }
    };
    const debouncedFetchActiveKycTemplate = (0, lodash_1.debounce)(fetchActiveKycTemplate, 100);
    (0, react_1.useEffect)(() => {
        if (router.isReady) {
            debouncedFetchActiveKycTemplate();
        }
    }, [router.isReady]);
    const handleCustomFieldChange = (key, value) => {
        console.log(`Updating custom field: ${key}, Value:`, value);
        setFormValues((prev) => {
            let newValue = value;
            if (value instanceof File) {
                newValue = value;
            }
            else if (value instanceof FileList && value.length > 0) {
                newValue = value[0];
            }
            const newValues = {
                ...prev,
                [key]: newValue,
            };
            console.log("Updated Form Values:", newValues);
            return newValues;
        });
        // Clear the error for this field
        setFormErrors((prev) => {
            const newErrors = {
                ...prev,
                customOptions: {
                    ...prev.customOptions,
                    [key]: null,
                },
            };
            console.log("Updated Form Errors:", newErrors);
            return newErrors;
        });
    };
    const validateField = (key, value) => {
        const fieldOptions = activeTemplate === null || activeTemplate === void 0 ? void 0 : activeTemplate.options[key];
        if (!fieldOptions)
            return;
        if (fieldOptions.required &&
            (typeof value === "undefined" || !value || value === "")) {
            setFormErrors((prev) => ({ ...prev, [key]: "This field is required" }));
            return;
        }
        setFormErrors((prev) => {
            const { [key]: removed, ...rest } = prev;
            return rest;
        });
    };
    const validateDocuments = () => {
        if (!activeTemplate)
            return true;
        const isAnyDocumentRequired = documentKeys.some((key) => { var _a; return (_a = activeTemplate.options[key]) === null || _a === void 0 ? void 0 : _a.required; });
        if (!isAnyDocumentRequired)
            return true;
        if (!selectedDocument) {
            setDocumentSelectionError("Please select a document type");
            return false;
        }
        else {
            setDocumentSelectionError(null);
        }
        if (!selectedDocument)
            return true;
        const documentOptions = activeTemplate.options[selectedDocument];
        if (!documentOptions || !documentOptions.required)
            return true;
        const newErrors = {};
        if (!frontFile) {
            newErrors.front = "Front side image is required";
        }
        if (selectedDocument === "documentIdCard" && !backFile) {
            newErrors.back = "Back side image is required";
        }
        if (!selfieFile) {
            newErrors.selfie = "Selfie image is required";
        }
        setFormErrors((prev) => ({ ...prev, ...newErrors }));
        return Object.keys(newErrors).length === 0;
    };
    const validateCustomFields = () => {
        if (!activeTemplate)
            return false;
        const newCustomFieldErrors = {};
        console.log("Custom Fields to Validate:", customFieldsFileUpload);
        console.log("Current Form Values:", formValues);
        console.log("Current Level:", level);
        customFieldsFileUpload.forEach((field) => {
            console.log(`Validating field: ${field.name}, Type: ${field.type}, Required: ${field.required}, Level: ${field.level}`);
            const value = formValues[field.name];
            if (field.required && parseInt(field.level) === level) {
                if (field.type === "input" || field.type === "textarea") {
                    if (!value || value.trim() === "") {
                        newCustomFieldErrors[field.name] = "This field is required";
                    }
                }
                else if (field.type === "file" || field.type === "image") {
                    if (!value || !(value instanceof File)) {
                        newCustomFieldErrors[field.name] = `Please upload a ${field.type}`;
                    }
                }
            }
        });
        console.log("Custom Field Errors:", newCustomFieldErrors);
        setFormErrors((prev) => ({
            ...prev,
            customOptions: newCustomFieldErrors,
        }));
        return Object.values(newCustomFieldErrors).every((error) => error === null);
    };
    const submit = async () => {
        console.log("Submit function called");
        // Validate fields, documents, and custom fields
        const generalFieldsValid = generalKeys.every((key) => {
            validateField(key, formValues[key]);
            return !formErrors[key];
        });
        console.log("General Fields Valid:", generalFieldsValid);
        const documentsValid = validateDocuments();
        console.log("Documents Valid:", documentsValid);
        const customFieldsValid = validateCustomFields();
        console.log("Custom Fields Valid:", customFieldsValid);
        const hasErrors = !generalFieldsValid ||
            !documentsValid ||
            !customFieldsValid ||
            documentSelectionError !== null;
        console.log("Has Errors:", hasErrors);
        console.log("Current Form Errors:", formErrors);
        if (hasErrors) {
            console.error("Form validation failed");
            return;
        }
        const documents = {
            documentPassport: {
                front: null,
                selfie: null,
            },
            documentDriversLicense: {
                front: null,
                selfie: null,
            },
            documentIdCard: {
                front: null,
                back: null,
                selfie: null,
            },
        };
        // Add document URLs if uploaded
        if (frontFile && selectedDocument !== null) {
            const uploadResponse = await handleFileUpload(frontFile[0]);
            if (uploadResponse.success && uploadResponse.file) {
                documents[selectedDocument].front = uploadResponse.file.url;
                setFrontPreviewUrl(uploadResponse.file.url);
            }
        }
        if (backFile && selectedDocument === "documentIdCard") {
            const uploadResponse = await handleFileUpload(backFile[0]);
            if (uploadResponse.success && uploadResponse.file) {
                documents[selectedDocument].back = uploadResponse.file.url;
                setBackPreviewUrl(uploadResponse.file.url);
            }
        }
        if (selfieFile && selectedDocument !== null) {
            const uploadResponse = await handleFileUpload(selfieFile[0]);
            if (uploadResponse.success && uploadResponse.file) {
                documents[selectedDocument].selfie = uploadResponse.file.url;
                setSelfiePreviewUrl(uploadResponse.file.url);
            }
        }
        // Handle custom file and image uploads
        const customFieldsUploads = await Promise.all(customFieldsFileUpload.map(async (field) => {
            const value = formValues[field.name];
            if (field.type === "file" || field.type === "image") {
                if (value instanceof File) {
                    const uploadResponse = await handleFileUpload(value);
                    if (uploadResponse.success && uploadResponse.file) {
                        return { [field.name]: uploadResponse.file.url };
                    }
                }
            }
            return { [field.name]: value };
        }));
        const customFields = Object.assign({}, ...customFieldsUploads);
        const fields = {
            ...formValues,
            documents,
            ...customFields,
        };
        const { error } = await (0, api_1.default)({
            url: "/api/user/kyc/application",
            method: "POST",
            body: { fields, templateId: activeTemplate === null || activeTemplate === void 0 ? void 0 : activeTemplate.id, level },
        });
        if (!error) {
            await setIsFetched(false);
            await fetchProfile();
            router.push("/user/profile?tab=kyc");
        }
    };
    return (<Default_1.default title={t("KYC Application")} color="muted">
      <div className="mx-auto text-muted-800 dark:text-muted-100 max-w-2xl">
        <div className="flex justify-between items-center w-full mb-5">
          <h1 className="text-xl">{t("KYC Application")}</h1>
          <BackButton_1.BackButton href="/user/profile?tab=kyc"/>
        </div>
        <form onSubmit={(e) => {
            e.preventDefault();
            submit();
        }}>
          {/* General Information */}
          {generalKeys.length > 0 && (<Card_1.default className="p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {generalKeys.map((key) => (<div key={key}>
                    <Input_1.default label={inputs[key].title} type={inputs[key].type} name={key} value={formValues[key] || ""} onChange={(e) => handleCustomFieldChange(key, e.target.value)} autoComplete={inputs[key].autocomplete}/>
                    {formErrors[key] && (<p className="text-red-500">{formErrors[key]}</p>)}
                  </div>))}
              </div>
            </Card_1.default>)}
          {/* Document Upload */}
          {documentKeys.length > 0 && (<Card_1.default className="p-5 mt-5 flex flex-col gap-5">
              <h2>{t("Document Upload")}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {documentKeys.map((key) => (<CheckboxHeadless_1.default key={key} checked={selectedDocument === key} onChange={() => {
                    setSelectedDocument(key);
                    setDocumentSelectionError(null);
                }}>
                    <Card_1.default shape="rounded-sm" className="border-2 p-4 opacity-50 peer-checked:border-primary-500! peer-checked:opacity-100 [&_.child]:peer-checked:text-primary-500!">
                      <div className="flex w-full items-center gap-2">
                        <Avatar_1.default size="md" src={selectedDocument === key
                    ? `/img/kyc/icon-${key}-color.png`
                    : `/img/kyc/icon-${key}.png`} shape="rounded-sm"/>

                        <div>
                          <h5 className="font-sans text-sm font-medium leading-none text-muted-800 dark:text-muted-100">
                            {inputs[key].title}
                          </h5>

                          <p className="font-sans text-xs text-muted-400">
                            {inputs[key].description}
                          </p>
                        </div>

                        <div className="child ms-auto text-muted-300">
                          <div className="h-3 w-3 rounded-full bg-current"></div>
                        </div>
                      </div>
                    </Card_1.default>
                  </CheckboxHeadless_1.default>))}
                {documentSelectionError && (<div className="col-span-3 text-danger-500 text-sm mt-2">
                    {documentSelectionError}
                  </div>)}
              </div>
              {selectedDocument && (<div className="mt-4 flex flex-col gap-5">
                  {/* Front Side */}
                  <div className="mt-2">
                    <label className="text-md">{t("Front Side")}</label>
                    <InputFile_1.default id={`${selectedDocument}-front`} acceptedFileTypes={[
                    "image/png",
                    "image/jpeg",
                    "image/jpg",
                    "image/gif",
                    "image/svg+xml",
                    "image/webp",
                ]} preview={frontPreviewUrl || ""} previewPlaceholder={(_a = documentRequirements[selectedDocument].find((req) => req.side === "front")) === null || _a === void 0 ? void 0 : _a.image} maxFileSize={16} label={`${t("Max File Size")}: 16 MB`} labelAlt={`${t("Size")}: 720x720 px`} bordered color="default" onChange={(files) => {
                    setFrontFile(files);
                    setFormErrors({ ...formErrors, front: null });
                }} onRemoveFile={() => {
                    setFrontFile(null);
                    setFrontPreviewUrl(null);
                }}/>

                    {formErrors.front && (<p className="text-red-500 text-sm mt-2">
                        {formErrors.front}
                      </p>)}
                  </div>
                  {/* Back Side */}
                  {selectedDocument === "documentIdCard" && (<div className="mt-2">
                      <label className="text-md">{t("Back Side")}</label>
                      <InputFile_1.default id={`${selectedDocument}-back`} acceptedFileTypes={[
                        "image/png",
                        "image/jpeg",
                        "image/jpg",
                        "image/gif",
                        "image/svg+xml",
                        "image/webp",
                    ]} preview={backPreviewUrl || ""} previewPlaceholder={(_b = documentRequirements[selectedDocument].find((req) => req.side === "back")) === null || _b === void 0 ? void 0 : _b.image} maxFileSize={16} label={`${t("Max File Size")}: 16 MB`} labelAlt={`${t("Size")}: 720x720 px`} bordered color="default" onChange={(files) => {
                        setBackFile(files);
                        setFormErrors({ ...formErrors, back: null });
                    }} onRemoveFile={() => {
                        setBackFile(null);
                        setBackPreviewUrl(null);
                    }}/>
                      {formErrors.back && (<p className="text-red-500 text-sm mt-2">
                          {formErrors.back}
                        </p>)}
                    </div>)}
                  {/* Selfie */}
                  <div className="mt-2">
                    <label className="text-md">{t("Selfie")}</label>
                    <InputFile_1.default id={`${selectedDocument}-selfie`} acceptedFileTypes={[
                    "image/png",
                    "image/jpeg",
                    "image/jpg",
                    "image/gif",
                    "image/svg+xml",
                    "image/webp",
                ]} preview={selfiePreviewUrl || ""} previewPlaceholder={"/img/kyc/documentSelfie.png"} maxFileSize={16} label={`${t("Max File Size")}: 16 MB`} labelAlt={`${t("Size")}: 720x720 px`} bordered color="default" onChange={(files) => {
                    setSelfieFile(files);
                    setFormErrors({ ...formErrors, selfie: null });
                }} onRemoveFile={() => {
                    setSelfieFile(null);
                    setSelfiePreviewUrl(null);
                }}/>
                    {formErrors.selfie && (<p className="text-red-500 text-sm mt-2">
                        {formErrors.selfie}
                      </p>)}
                  </div>
                </div>)}
            </Card_1.default>)}
          {/* Custom Fields */}
          <div className="mt-5">
            {customFieldsFileUpload.map((field, index) => {
            var _a, _b, _c, _d, _e;
            return (<div key={index}>
                {field.type === "input" && (<Input_1.default type="text" label={field.name} name={field.name} value={formValues[field.name] || ""} onChange={(e) => handleCustomFieldChange(field.name, e.target.value)} error={(_a = formErrors.customOptions) === null || _a === void 0 ? void 0 : _a[field.name]}/>)}
                {field.type === "textarea" && (<Textarea_1.default label={field.name} name={field.name} value={formValues[field.name] || ""} onChange={(e) => handleCustomFieldChange(field.name, e.target.value)} error={(_b = formErrors.customOptions) === null || _b === void 0 ? void 0 : _b[field.name]}/>)}
                {field.type === "file" && (<InputFileField_1.default id={field.name} label={`${t("Max File Size")}: ${field.maxSize || 16} MB`} value={((_c = formValues[field.name]) === null || _c === void 0 ? void 0 : _c.name) || ""} maxFileSize={field.maxSize || 16} acceptedFileTypes={field.acceptedFileTypes} onChange={(e) => handleCustomFieldChange(field.name, e.target.files)} error={(_d = formErrors.customOptions) === null || _d === void 0 ? void 0 : _d[field.name]}/>)}
                {field.type === "image" && (<InputFile_1.default id={field.name} acceptedFileTypes={[
                        "image/png",
                        "image/jpeg",
                        "image/jpg",
                        "image/gif",
                        "image/svg+xml",
                        "image/webp",
                    ]} preview={formValues[field.name] instanceof File
                        ? URL.createObjectURL(formValues[field.name])
                        : null} maxFileSize={field.maxSize || 16} label={`${t("Max File Size")}: ${field.maxSize || 16} MB`} labelAlt={`${t("Size")}: 720x720 px`} bordered color="default" onChange={(files) => {
                        if (files && files.length > 0) {
                            handleCustomFieldChange(field.name, files[0]);
                        }
                    }} onRemoveFile={() => {
                        handleCustomFieldChange(field.name, null);
                    }} error={(_e = formErrors.customOptions) === null || _e === void 0 ? void 0 : _e[field.name]}/>)}
              </div>);
        })}
          </div>
          <div className="flex justify-center items-center w-full mt-5">
            <Card_1.default className="p-3 text-end text-md flex justify-center items-center gap-3 max-w-sm">
              <div className="w-full">
                <Button_1.default className="w-full" color="muted" onClick={() => router.push("/user/profile?tab=kyc")} type="button">
                  {t("Cancel")}
                </Button_1.default>
              </div>
              <div className="w-full">
                <Button_1.default className="w-full" type="submit" color="primary">
                  {t("Submit")}
                </Button_1.default>
              </div>
            </Card_1.default>
          </div>
        </form>
      </div>
    </Default_1.default>);
};
exports.default = KycApplication;
