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
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const Heading_1 = __importDefault(require("@/components/elements/base/heading/Heading"));
const api_1 = __importDefault(require("@/utils/api"));
const ButtonLink_1 = __importDefault(require("@/components/elements/base/button-link/ButtonLink"));
const react_2 = require("@iconify/react");
const Input_1 = __importDefault(require("@/components/elements/form/input/Input"));
const Textarea_1 = __importDefault(require("@/components/elements/form/textarea/Textarea"));
const ToggleSwitch_1 = __importDefault(require("@/components/elements/form/toggle-switch/ToggleSwitch"));
const next_i18next_1 = require("next-i18next");
const NotificationTemplateEdit = () => {
    var _a, _b, _c;
    const { t } = (0, next_i18next_1.useTranslation)();
    const router = (0, router_1.useRouter)();
    const { id } = router.query;
    const [template, setTemplate] = (0, react_1.useState)(null);
    const [formValues, setFormValues] = (0, react_1.useState)({
        subject: "",
        emailBody: "",
        smsBody: "",
        pushBody: "",
        email: false,
        sms: false,
        push: false,
        shortCodes: "",
    });
    const [isSubmitting, setIsSubmitting] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        const fetchTemplate = async () => {
            const { data } = await (0, api_1.default)({
                url: `/api/admin/system/notification/template/${id}`,
                silent: true,
            });
            setTemplate({
                subject: data.subject,
                shortCodes: data.shortCodes,
            });
            setFormValues({
                subject: data.subject,
                emailBody: data.emailBody || "",
                smsBody: data.smsBody || "",
                pushBody: data.pushBody || "",
                email: data.email || false,
                sms: data.sms || false,
                push: data.push || false,
            });
        };
        if (id) {
            fetchTemplate();
        }
    }, [id]);
    const handleChange = (e) => {
        const { name, value, type } = e.target;
        const checked = e.target.checked;
        setFormValues((prevValues) => ({
            ...prevValues,
            [name]: type === "checkbox" ? checked : value,
        }));
    };
    const handleSwitchChange = (name, newValue) => {
        setFormValues((prevValues) => ({
            ...prevValues,
            [name]: newValue,
        }));
    };
    const handleSubmit = async () => {
        setIsSubmitting(true);
        const { error } = await (0, api_1.default)({
            url: `/api/admin/system/notification/template/${id}`,
            method: "PUT",
            body: formValues,
        });
        if (!error) {
            router.push("/admin/system/notification/template");
        }
        setIsSubmitting(false);
    };
    const shortcodesMap = (item) => {
        const map = {
            FIRSTNAME: t("User first name"),
            LASTNAME: t("User last name"),
            EMAIL: t("User email"),
            PHONE: t("User phone"),
            COMPANY: t("User company"),
            ADDRESS: t("User address"),
            CITY: t("User city"),
            STATE: t("User state"),
            ZIP: t("User zip"),
            COUNTRY: t("User country"),
            PASSWORD: t("User password"),
            USERNAME: t("User username"),
            URL: t("Site url"),
            CREATED_AT: t("Template related Created at"),
            UPDATED_AT: t("Updated at date"),
            SITE_NAME: t("Site name"),
            SITE_URL: t("Site url"),
            SITE_EMAIL: t("Site email"),
            SITE_PHONE: t("Site phone"),
            SITE_ADDRESS: t("Site address"),
            TOKEN: t("Template related token"),
            LAST_LOGIN: t("User last login"),
        };
        return map[item] || item;
    };
    return (<Default_1.default title={t("Notification Template")} color="muted">
      <div className="flex justify-between items-center mb-5">
        <Heading_1.default as="h1" size="lg">
          {t("Editing")} {template === null || template === void 0 ? void 0 : template.subject} {t("Template")}
        </Heading_1.default>
        <div className="flex justify-end">
          <Button_1.default type="button" color="success" className="mr-2" onClick={handleSubmit} disabled={isSubmitting} loading={isSubmitting}>
            <react_2.Icon icon="line-md:confirm" className="w-5 h-5 mr-2"/>
            {t("Save")}
          </Button_1.default>
          <ButtonLink_1.default href="/admin/system/notification/template" color="muted">
            <react_2.Icon icon="line-md:arrow-small-left" className="w-5 h-5 mr-2"/>
            {t("Back")}
          </ButtonLink_1.default>
        </div>
      </div>
      <div className="grid gap-5 xs:grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
        <div className="xs:col-span-1 md:col-span-2 lg:col-span-3 space-y-5">
          <Input_1.default name="subject" label={t("Subject")} placeholder={t("Enter subject")} value={formValues.subject} onChange={handleChange} disabled={isSubmitting}/>
          <Textarea_1.default name="emailBody" label={t("Email Body")} placeholder={t("Enter email body")} rows={10} value={formValues.emailBody || ""} onChange={handleChange} disabled={isSubmitting}/>
          <Textarea_1.default name="smsBody" label={t("SMS Body")} placeholder={t("Enter sms body")} value={formValues.smsBody || ""} onChange={handleChange} disabled={isSubmitting}/>
          <Textarea_1.default name="pushBody" label={t("Push Body")} placeholder={t("Enter push body")} value={formValues.pushBody || ""} onChange={handleChange} disabled={isSubmitting}/>
        </div>
        <div className="col-span-1">
          <Card_1.default className="p-5">
            <Heading_1.default as="h2" size="md" className="mb-5 text-muted">
              {t("Variables")}
            </Heading_1.default>
            <div className="space-y-3 text-xs">
              {(template === null || template === void 0 ? void 0 : template.shortCodes) &&
            JSON.parse(template.shortCodes).map((item, index) => (<div key={index} className="flex flex-col">
                      <span className="text-gray-600 dark:text-gray-400">
                        %
                        <span className="font-semibold text-gray-800 dark:text-gray-200">
                          {item}
                        </span>
                        %
                      </span>
                      <span className="text-gray-500">
                        {shortcodesMap(item)}
                      </span>
                    </div>))}
            </div>
          </Card_1.default>
          <Card_1.default className="p-5 mt-5">
            <div className="space-y-3 text-xs">
              <div>
                <ToggleSwitch_1.default id="email-switch" name="email" label={t("Email")} sublabel={t("Send emails notifications")} color="primary" checked={(_a = formValues.email) !== null && _a !== void 0 ? _a : false} onChange={() => handleSwitchChange("email", !formValues.email)} disabled={isSubmitting}/>
              </div>
              <div>
                <ToggleSwitch_1.default id="sms-switch" name="sms" label={t("SMS (coming soon)")} sublabel={t("Send sms notifications")} color="primary" checked={(_b = formValues.sms) !== null && _b !== void 0 ? _b : false} onChange={() => handleSwitchChange("sms", !formValues.sms)} disabled={true}/>
              </div>
              <div>
                <ToggleSwitch_1.default id="push-switch" name="push" label={t("Push (coming soon)")} sublabel={t("Send push notifications")} color="primary" checked={(_c = formValues.push) !== null && _c !== void 0 ? _c : false} onChange={() => handleSwitchChange("push", !formValues.push)} disabled={true}/>
              </div>
            </div>
          </Card_1.default>
        </div>
      </div>
    </Default_1.default>);
};
exports.default = NotificationTemplateEdit;
exports.permission = "Access Notification Template Management";
