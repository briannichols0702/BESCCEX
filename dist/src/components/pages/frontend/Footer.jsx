"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const link_1 = __importDefault(require("next/link"));
const next_i18next_1 = require("next-i18next");
const dashboard_1 = require("@/stores/dashboard");
const footer_json_1 = __importDefault(require("../../../../data/footer.json"));
const react_1 = require("@iconify/react");
const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Your Site Name";
const FooterSection = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const { settings } = (0, dashboard_1.useDashboardStore)();
    const socialLinks = {
        facebook: settings === null || settings === void 0 ? void 0 : settings.facebookLink,
        twitter: settings === null || settings === void 0 ? void 0 : settings.twitterLink,
        instagram: settings === null || settings === void 0 ? void 0 : settings.instagramLink,
        linkedin: settings === null || settings === void 0 ? void 0 : settings.linkedinLink,
        telegram: settings === null || settings === void 0 ? void 0 : settings.telegramLink,
    };
    return (<footer className="mt-auto w-full py-10 px-4 sm:px-6 lg:px-8 mx-auto">
      <div className="max-w-7xl relative pt-6 lg:pt-0 px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <div className="lg:col-span-1">
            <link_1.default className="flex-none text-xl font-semibold dark:text-white" href="#" aria-label="Brand">
              {siteName}
            </link_1.default>
            <p className="mt-3 text-xs sm:text-sm text-gray-600 dark:text-neutral-400">
              {t(footer_json_1.default.footerNote)}{" "}
              <link_1.default className="inline-flex items-center gap-x-1.5 text-blue-600 decoration-2 hover:underline font-medium dark:text-blue-500" href={footer_json_1.default.footerNoteLink}>
                {t(footer_json_1.default.footerNoteText)}
              </link_1.default>{" "}
              {t("analyze market movements, and prepare for trades with the latest news and insights from fellow traders.")}
            </p>
          </div>
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
            {footer_json_1.default.sections.map((section, index) => (<div key={index}>
                <h4 className="text-xs font-semibold text-gray-900 uppercase dark:text-neutral-100">
                  {t(section.title)}
                </h4>
                <div className="mt-3 grid space-y-3 text-sm">
                  {section.links.map((link, idx) => (<p key={idx}>
                      <link_1.default className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 dark:text-neutral-400 dark:hover:text-neutral-200" href={link.url}>
                        {t(link.name)}
                      </link_1.default>
                    </p>))}
                </div>
              </div>))}
          </div>
        </div>
        <div className="pt-5 mt-5 border-t border-gray-200 dark:border-neutral-700">
          <div className="sm:flex sm:justify-between sm:items-center">
            <p className="mt-1 text-xs sm:text-sm text-gray-600 dark:text-neutral-400">
              {`${footer_json_1.default.copyright}`}
            </p>
            <div className="flex space-x-4 mt-4 sm:mt-0">
              {socialLinks.facebook && (<link_1.default href={socialLinks.facebook} aria-label="Facebook" className="text-gray-600 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-500">
                  <react_1.Icon icon="akar-icons:facebook-fill" className="w-5 h-5"/>
                </link_1.default>)}
              {socialLinks.twitter && (<link_1.default href={socialLinks.twitter} aria-label="Twitter" className="text-gray-600 hover:text-blue-400 dark:text-neutral-400 dark:hover:text-blue-300">
                  <react_1.Icon icon="akar-icons:twitter-fill" className="w-5 h-5"/>
                </link_1.default>)}
              {socialLinks.instagram && (<link_1.default href={socialLinks.instagram} aria-label="Instagram" className="text-gray-600 hover:text-pink-600 dark:text-neutral-400 dark:hover:text-pink-500">
                  <react_1.Icon icon="akar-icons:instagram-fill" className="w-5 h-5"/>
                </link_1.default>)}
              {socialLinks.linkedin && (<link_1.default href={socialLinks.linkedin} aria-label="LinkedIn" className="text-gray-600 hover:text-blue-700 dark:text-neutral-400 dark:hover:text-blue-600">
                  <react_1.Icon icon="akar-icons:linkedin-fill" className="w-5 h-5"/>
                </link_1.default>)}
              {socialLinks.telegram && (<link_1.default href={socialLinks.telegram} aria-label="Telegram" className="text-gray-600 hover:text-blue-400 dark:text-neutral-400 dark:hover:text-blue-300">
                  <react_1.Icon icon="akar-icons:telegram-fill" className="w-5 h-5"/>
                </link_1.default>)}
            </div>
          </div>
        </div>
      </div>
    </footer>);
};
exports.default = FooterSection;
