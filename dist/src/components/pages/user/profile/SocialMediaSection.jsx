"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Input_1 = __importDefault(require("@/components/elements/form/input/Input"));
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const next_i18next_1 = require("next-i18next");
const SocialMediaSection = ({ formData, handleInputChange, handleCancel, handleSave, hasChanges, isLoading, }) => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<div className="grid w-full grid-cols-12 gap-6">
      <div className="col-span-12 lg:col-span-4 ltablet:col-span-4">
        <div className="mt-4 space-y-2">
          <h3 className="text-lg font-medium tracking-wide text-muted-800 dark:text-muted-100">
            {t("Social Media")}
          </h3>
          <p className="max-w-xs text-sm text-muted-400">
            {t("Add your social media profiles so that people can connect with you on other platforms.")}
          </p>
        </div>
      </div>
      <div className="col-span-12 lg:col-span-7 ltablet:col-span-7">
        <div className="lg:max-w-xl">
          <div className="grid w-full grid-cols-12 gap-x-6 gap-y-4">
            <div className="col-span-12 md:col-span-6">
              <Input_1.default label={t("Twitter URL")} icon="fa6-brands:twitter" placeholder={t("Ex: twitter.com/johndoe")} name="twitter" value={formData.twitter} onChange={handleInputChange}/>
            </div>
            <div className="col-span-12 md:col-span-6">
              <Input_1.default label={t("Dribbble URL")} icon="fa6-brands:dribbble" placeholder={t("Ex: dribbble.com/johndoe")} name="dribbble" value={formData.dribbble} onChange={handleInputChange}/>
            </div>
            <div className="col-span-12 md:col-span-6">
              <Input_1.default label={t("Instagram URL")} icon="fa6-brands:instagram" placeholder={t("Ex: instagram.com/johndoe")} name="instagram" value={formData.instagram} onChange={handleInputChange}/>
            </div>
            <div className="col-span-12 md:col-span-6">
              <Input_1.default label={t("Github URL")} icon="fa6-brands:github" placeholder={t("Ex: github.com/johndoe")} name="github" value={formData.github} onChange={handleInputChange}/>
            </div>
            <div className="col-span-12 md:col-span-6">
              <Input_1.default label={t("Gitlab URL")} icon="fa6-brands:gitlab" placeholder={t("Ex: gitlab.com/johndoe")} name="gitlab" value={formData.gitlab} onChange={handleInputChange}/>
            </div>
            <div className="col-span-12 md:col-span-6">
              <Input_1.default label={t("Telegram URL")} icon="fa6-brands:telegram" placeholder={t("Ex: t.me/johndoe")} name="telegram" value={formData.telegram} onChange={handleInputChange}/>
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
exports.default = SocialMediaSection;
