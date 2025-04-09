"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Input_1 = __importDefault(require("@/components/elements/form/input/Input"));
const Textarea_1 = __importDefault(require("@/components/elements/form/textarea/Textarea"));
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const next_i18next_1 = require("next-i18next");
const PersonalSection = ({ formData, handleInputChange, handleCancel, handleSave, hasChanges, isLoading, }) => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<div className="grid w-full grid-cols-12 gap-6">
      <div className="col-span-12 lg:col-span-4 ltablet:col-span-4">
        <div className="mt-4 space-y-2">
          <h3 className="text-lg font-medium tracking-wide text-muted-800 dark:text-muted-100">
            {t("Personal")}
          </h3>
          <p className="max-w-xs text-sm text-muted-400">
            {t("Help us to know more about you by adding your personal information, like your name and at least an email address.")}
          </p>
        </div>
      </div>
      <div className="col-span-12 lg:col-span-7 ltablet:col-span-7">
        <div className="lg:max-w-xl">
          <div className="grid w-full grid-cols-12 gap-x-6 gap-y-4">
            <div className="col-span-12 md:col-span-6">
              <Input_1.default label={t("First Name")} placeholder={t("Ex: John")} name="firstName" value={formData.firstName} onChange={handleInputChange}/>
            </div>
            <div className="col-span-12 md:col-span-6">
              <Input_1.default label={t("Last Name")} placeholder={t("Ex: Doe")} name="lastName" value={formData.lastName} onChange={handleInputChange}/>
            </div>
            <div className="col-span-12">
              <Input_1.default label={t("Email Address")} placeholder={t("Ex: johndoe@gmail.com")} name="email" value={formData.email} onChange={handleInputChange}/>
            </div>
            <div className="col-span-12">
              <Textarea_1.default label={t("Short Bio")} placeholder={t("Write a few words about yourself...")} rows={6} name="bio" value={formData.bio} onChange={handleInputChange}/>
            </div>
            <div className="col-span-12">
              <Input_1.default label={t("Phone")} placeholder={t("Ex: 1234567890")} name="phone" value={formData.phone} onChange={handleInputChange}/>
            </div>
            {hasChanges && (<div className="col-span-12 flex justify-end space-x-4">
                <Button_1.default color="default" onClick={handleCancel}>
                  {t("Cancel")}
                </Button_1.default>
                <Button_1.default color="primary" onClick={handleSave} loading={isLoading}>
                  {t("Save Changes")}
                </Button_1.default>
              </div>)}
          </div>
        </div>
      </div>
    </div>);
};
exports.default = PersonalSection;
