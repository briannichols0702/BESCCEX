"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.permission = void 0;
const react_1 = require("react");
const router_1 = require("next/router");
const Default_1 = __importDefault(require("@/layouts/Default"));
const Card_1 = __importDefault(require("@/components/elements/base/card/Card"));
const next_i18next_1 = require("next-i18next");
const BackButton_1 = require("@/components/elements/base/button/BackButton");
const react_2 = require("@iconify/react");
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const Modal_1 = __importDefault(require("@/components/elements/base/modal/Modal"));
const IconButton_1 = __importDefault(require("@/components/elements/base/button-icon/IconButton"));
const api_1 = __importDefault(require("@/utils/api"));
const lodash_1 = require("lodash");
const Tag_1 = __importDefault(require("@/components/elements/base/tag/Tag"));
const imagePortal_1 = __importDefault(require("@/components/elements/imagePortal"));
const MashImage_1 = require("@/components/elements/MashImage");
const Textarea_1 = __importDefault(require("@/components/elements/form/textarea/Textarea"));
const DetailItem = ({ label, value }) => (<div className="text-sm">
    <span className="text-gray-500 dark:text-gray-400">{label}:</span>{" "}
    <span className={value
        ? "text-gray-800 dark:text-gray-200"
        : "text-warning-500 dark:text-warning-400"}>
      {value || "Missing"}
    </span>
  </div>);
const ImageItem = ({ label, src, openLightbox }) => (<div>
    <div className="relative group">
      <div className="absolute top-2 left-2">
        <Tag_1.default color="info">{label}</Tag_1.default>
      </div>
      <a onClick={() => openLightbox(src)} className="block cursor-pointer">
        <MashImage_1.MashImage src={src || "/img/placeholder.svg"} alt={label} className="rounded-lg" height={180}/>
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
          <react_2.Icon icon="akar-icons:eye" className="text-white text-3xl"/>
        </div>
      </a>
    </div>
  </div>);
const KycApplicationDetails = () => {
    var _a, _b, _c, _d, _e, _f, _g;
    const { t } = (0, next_i18next_1.useTranslation)();
    const router = (0, router_1.useRouter)();
    const { id } = router.query;
    const [kyc, setKyc] = (0, react_1.useState)(null);
    const [isRejectOpen, setIsRejectOpen] = (0, react_1.useState)(false);
    const [isApproveOpen, setIsApproveOpen] = (0, react_1.useState)(false);
    const [isLoading, setIsLoading] = (0, react_1.useState)(true);
    const [rejectionMessage, setRejectionMessage] = (0, react_1.useState)("We are sorry, your kyc has been rejected. Please contact support for more information. \n\nRejection reason goes here.  \n\nThank you.");
    const [currentImage, setCurrentImage] = (0, react_1.useState)(null);
    const [isLightboxOpen, setIsLightboxOpen] = (0, react_1.useState)(false);
    const getKyc = async () => {
        setIsLoading(true);
        const { data, error } = await (0, api_1.default)({
            url: `/api/admin/crm/kyc/applicant/${id}`,
            silent: true,
        });
        if (!error) {
            const parsedData = JSON.parse(data.data);
            setKyc({ ...data, data: parsedData });
        }
        setIsLoading(false);
    };
    const debounceGetKyc = (0, lodash_1.debounce)(getKyc, 100);
    (0, react_1.useEffect)(() => {
        if (router.isReady) {
            debounceGetKyc();
        }
    }, [router.isReady]);
    const updateKyc = async (status) => {
        setIsLoading(true);
        const { error } = await (0, api_1.default)({
            method: "PUT",
            url: `/api/admin/crm/kyc/applicant/${id}`,
            body: {
                status,
                ...(status === "REJECTED" && { notes: rejectionMessage }),
            },
        });
        if (!error) {
            setKyc((prevKyc) => ({
                ...prevKyc,
                status: status,
                ...(status === "REJECTED" && { notes: rejectionMessage }),
            }));
            if (status === "REJECTED") {
                setIsRejectOpen(false);
            }
            if (status === "APPROVED") {
                setIsApproveOpen(false);
            }
        }
        setIsLoading(false);
    };
    const statusClass = (status) => {
        switch (status) {
            case "APPROVED":
                return "success";
            case "PENDING":
                return "warning";
            case "REJECTED":
                return "danger";
            default:
                return "info";
        }
    };
    const levelClass = (type) => {
        switch (type) {
            case 1:
                return "info";
            case 2:
                return "primary";
            case 3:
                return "success";
            default:
                return "info";
        }
    };
    const documentType = (0, react_1.useMemo)(() => {
        var _a;
        if ((_a = kyc === null || kyc === void 0 ? void 0 : kyc.data) === null || _a === void 0 ? void 0 : _a.documents) {
            if (kyc.data.documents.documentPassport) {
                return "Passport";
            }
            if (kyc.data.documents.documentDriversLicense) {
                return "Driver's License";
            }
            if (kyc.data.documents.documentIdCard) {
                return "ID Card";
            }
        }
        return "Unknown";
    }, [kyc]);
    const openLightbox = (image) => {
        setCurrentImage(image);
        setIsLightboxOpen(true);
    };
    const closeLightbox = () => {
        setIsLightboxOpen(false);
    };
    const fieldNames = {
        firstName: {
            title: t("First Name"),
            description: t("The user's given name"),
        },
        lastName: {
            title: t("Last Name"),
            description: t("The user's family name"),
        },
        email: { title: t("Email"), description: t("The user's email address") },
        phone: { title: t("Phone"), description: t("The user's phone number") },
        address: {
            title: t("Address"),
            description: t("The user's street address"),
        },
        city: { title: t("City"), description: t("The user's city") },
        state: { title: t("State"), description: t("The user's state or region") },
        country: { title: t("Country"), description: t("The user's country") },
        zip: { title: t("Zip"), description: t("The user's postal code") },
        dob: { title: t("Date of Birth"), description: t("The user's birth date") },
        ssn: {
            title: t("SSN"),
            description: t("The user's social security number"),
        },
    };
    const renderDetails = () => {
        var _a;
        const options = JSON.parse(((_a = kyc === null || kyc === void 0 ? void 0 : kyc.template) === null || _a === void 0 ? void 0 : _a.options) || "{}");
        const keys = Object.keys(options).filter((key) => kyc &&
            options[key].enabled &&
            (parseInt(options[key].level) <= kyc.level ||
                parseInt(options[key].level) === kyc.level + 1));
        return (<div className="grid gap-2 xs:grid-cols-1 sm:grid-cols-2">
        {keys.map((key) => {
                var _a;
                return fieldNames[key] && (<DetailItem key={key} label={(_a = fieldNames[key]) === null || _a === void 0 ? void 0 : _a.title} value={(kyc === null || kyc === void 0 ? void 0 : kyc.data[key]) ||
                        (kyc &&
                            (parseInt(options[key].level) === kyc.level + 1
                                ? "Missing"
                                : null))}/>);
            })}
      </div>);
    };
    const renderDocumentSection = (document) => (<div className="grid grid-cols-3 gap-5">
      {document.front && (<ImageItem label={t("Front")} src={document.front} openLightbox={openLightbox}/>)}
      {document.selfie && (<ImageItem label={t("Selfie")} src={document.selfie} openLightbox={openLightbox}/>)}
      {document.back && (<ImageItem label={t("Back")} src={document.back} openLightbox={openLightbox}/>)}
    </div>);
    const renderCustomFields = () => {
        const customOptions = JSON.parse((kyc === null || kyc === void 0 ? void 0 : kyc.template.customOptions) || "{}");
        const customKeys = Object.keys(customOptions).filter((key) => (kyc && parseInt(customOptions[key].level) <= kyc.level) ||
            (kyc && parseInt(customOptions[key].level) === kyc.level + 1));
        return (<Card_1.default className="p-5 border rounded-md dark:border-gray-600">
        <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
          {t("Custom Fields")}:
        </h3>
        <div className="grid gap-5 grid-cols-3 text-md">
          {customKeys.map((key) => {
                const field = customOptions[key];
                const value = (kyc === null || kyc === void 0 ? void 0 : kyc.data[key]) ||
                    (kyc &&
                        (parseInt(field.level) === kyc.level + 1 ? "Missing" : null));
                if (field.type === "input" || field.type === "textarea") {
                    return (<div key={key}>
                  {" "}
                  <span className="text-gray-500 dark:text-gray-400">
                    {t(key)}:
                  </span>{" "}
                  <span className={value
                            ? "text-gray-800 dark:text-gray-200"
                            : "text-warning-500 dark:text-warning-400"}>
                    {value || "Missing"}
                  </span>
                </div>);
                }
                if (field.type === "image" || field.type === "file") {
                    return (<ImageItem key={key} label={t(key)} src={value} openLightbox={openLightbox}/>);
                }
                return null;
            })}
        </div>
      </Card_1.default>);
    };
    // Check if there are any documents at or below the current level
    const hasDocuments = (0, react_1.useMemo)(() => {
        var _a;
        if (!((_a = kyc === null || kyc === void 0 ? void 0 : kyc.data) === null || _a === void 0 ? void 0 : _a.documents))
            return false;
        const { documents } = kyc.data;
        // Define the levels we want to check for
        const levelsToCheck = [kyc.level, kyc.level - 1];
        // Check if any of the documents exist at or below the current level
        return levelsToCheck.some((level) => ["documentPassport", "documentDriversLicense", "documentIdCard"].some((docType) => {
            const document = documents[docType];
            return (document && (document.front || document.back || document.selfie));
        }));
    }, [kyc]);
    // Check if there are any custom fields at or below the current level
    const hasCustomFields = (0, react_1.useMemo)(() => {
        if (!kyc)
            return false;
        const customOptions = JSON.parse((kyc === null || kyc === void 0 ? void 0 : kyc.template.customOptions) || "{}");
        const levels = [kyc.level, kyc.level - 1];
        return levels.some((level) => Object.keys(customOptions).some((key) => parseInt(customOptions[key].level) <= level));
    }, [kyc]);
    // Inside the return of the component
    return (<Default_1.default title={t("KYC Application Details")} color="muted">
      <div className="mx-auto text-gray-800 dark:text-gray-200 max-w-7xl">
        <div className="flex justify-between items-center w-full mb-5">
          <h1 className="text-xl">{t("KYC Application Details")}</h1>
          <BackButton_1.BackButton href="/admin/crm/kyc/applicant"/>
        </div>

        <div className="flex flex-col gap-5">
          {/* Details Section */}
          {kyc && (<>
              <Card_1.default className="p-5 border rounded-md dark:border-gray-600">
                {/* Header Section */}
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
                    {t("General Details")}:
                  </h2>
                  <div className="flex items-center xs:flex-col sm:flex-row gap-2">
                    <Tag_1.default color={statusClass(kyc === null || kyc === void 0 ? void 0 : kyc.status)}>{kyc === null || kyc === void 0 ? void 0 : kyc.status}</Tag_1.default>
                    <Tag_1.default color={levelClass(kyc === null || kyc === void 0 ? void 0 : kyc.level)}>
                      {t("Level")} {kyc === null || kyc === void 0 ? void 0 : kyc.level}
                    </Tag_1.default>
                  </div>
                </div>
                {renderDetails()}
              </Card_1.default>
            </>)}

          {/* Document Upload */}
          {kyc && hasDocuments && (<Card_1.default className="p-5 border rounded-md dark:border-gray-600">
              <h3 className="text-lg mb-2 text-gray-800 dark:text-gray-200">
                {t("Uploaded Document")}:{" "}
                <span className="font-semibold">{documentType}</span>
              </h3>
              {((_b = (_a = kyc === null || kyc === void 0 ? void 0 : kyc.data) === null || _a === void 0 ? void 0 : _a.documents) === null || _b === void 0 ? void 0 : _b.documentPassport) &&
                renderDocumentSection(kyc === null || kyc === void 0 ? void 0 : kyc.data.documents.documentPassport)}
              {((_d = (_c = kyc === null || kyc === void 0 ? void 0 : kyc.data) === null || _c === void 0 ? void 0 : _c.documents) === null || _d === void 0 ? void 0 : _d.documentDriversLicense) &&
                renderDocumentSection(kyc === null || kyc === void 0 ? void 0 : kyc.data.documents.documentDriversLicense)}
              {((_f = (_e = kyc === null || kyc === void 0 ? void 0 : kyc.data) === null || _e === void 0 ? void 0 : _e.documents) === null || _f === void 0 ? void 0 : _f.documentIdCard) &&
                renderDocumentSection(kyc === null || kyc === void 0 ? void 0 : kyc.data.documents.documentIdCard)}
            </Card_1.default>)}

          {/* Custom Fields */}
          {kyc && hasCustomFields && renderCustomFields()}

          {/* Rejection Notes Section */}
          {(kyc === null || kyc === void 0 ? void 0 : kyc.notes) && (kyc === null || kyc === void 0 ? void 0 : kyc.status) === "REJECTED" && (<Card_1.default className="p-5 border rounded-md dark:border-gray-600">
              <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
                {t("Notes")}:
              </h2>
              <p className="text-md" dangerouslySetInnerHTML={{
                __html: (_g = kyc.notes) === null || _g === void 0 ? void 0 : _g.replace(/\n/g, "<br />"),
            }}></p>
            </Card_1.default>)}

          {/* Approve Kyc Button */}
          {(kyc === null || kyc === void 0 ? void 0 : kyc.status) === "PENDING" && (<Card_1.default className="w-full flex gap-2 xs:flex-col sm:flex-row mb-2 p-5">
              <Button_1.default color="success" className="w-full" onClick={() => setIsApproveOpen(true)}>
                {t("Approve Kyc")}
              </Button_1.default>
              <Button_1.default color="danger" className="w-full" onClick={() => setIsRejectOpen(true)}>
                {t("Reject Kyc")}
              </Button_1.default>
            </Card_1.default>)}
        </div>

        {/* Approve Kyc Modal */}
        <Modal_1.default open={isApproveOpen} size="lg">
          <Card_1.default shape="smooth">
            <div className="flex items-center justify-between p-4 md:p-6">
              <h3 className="text-lg font-medium text-muted-900 dark:text-white">
                {t("Approve Kyc")}
              </h3>
              <IconButton_1.default size="sm" shape="full" onClick={() => setIsApproveOpen(false)}>
                <react_2.Icon icon="lucide:x" className="h-4 w-4"/>
              </IconButton_1.default>
            </div>
            <div className="p-4 md:p-6 text-md">
              <p>
                {t("Are you sure you want to approve this kyc? This action cannot be undone.")}
              </p>
            </div>
            <div className="p-4 md:p-6">
              <div className="flex gap-x-2 justify-end">
                <Button_1.default color="success" onClick={() => updateKyc("APPROVED")} disabled={isLoading} loading={isLoading}>
                  {t("Approve")}
                </Button_1.default>
              </div>
            </div>
          </Card_1.default>
        </Modal_1.default>

        {/* Reject Kyc Modal */}
        <Modal_1.default open={isRejectOpen} size="lg">
          <Card_1.default shape="smooth">
            <div className="flex items-center justify-between p-4 md:p-6">
              <h3 className="text-lg font-medium text-muted-900 dark:text-white">
                {t("Reject Kyc")}
              </h3>
              <IconButton_1.default size="sm" shape="full" onClick={() => setIsRejectOpen(false)}>
                <react_2.Icon icon="lucide:x" className="h-4 w-4"/>
              </IconButton_1.default>
            </div>
            <div className="p-4 md:p-6 text-md">
              <Textarea_1.default value={rejectionMessage} onChange={(e) => setRejectionMessage(e.target.value)} rows={10} placeholder={t("Enter rejection reason")} className="w-full p-2 border rounded-md"/>
            </div>
            <div className="p-4 md:p-6">
              <div className="flex gap-x-2 justify-end">
                <Button_1.default color="danger" onClick={() => updateKyc("REJECTED")} disabled={isLoading} loading={isLoading}>
                  {t("Reject")}
                </Button_1.default>
              </div>
            </div>
          </Card_1.default>
        </Modal_1.default>

        {isLightboxOpen && (<imagePortal_1.default src={currentImage} onClose={closeLightbox}/>)}
      </div>
    </Default_1.default>);
};
exports.default = KycApplicationDetails;
exports.permission = "Access KYC Application Management";
