"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const router_1 = require("next/router");
const Default_1 = __importDefault(require("@/layouts/Default"));
const Card_1 = __importDefault(require("@/components/elements/base/card/Card"));
const next_i18next_1 = require("next-i18next");
const react_2 = require("@iconify/react");
const Avatar_1 = __importDefault(require("@/components/elements/base/avatar/Avatar"));
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const dashboard_1 = require("@/stores/dashboard");
const api_1 = __importDefault(require("@/utils/api"));
const Heading_1 = __importDefault(require("@/components/elements/base/heading/Heading"));
const Paragraph_1 = __importDefault(require("@/components/elements/base/paragraph/Paragraph"));
const ButtonLink_1 = __importDefault(require("@/components/elements/base/button-link/ButtonLink"));
const Action = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const { profile, fetchProfile } = (0, dashboard_1.useDashboardStore)();
    const router = (0, router_1.useRouter)();
    const [status, setStatus] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        var _a;
        if (router.isReady) {
            if (!profile) {
                router.push("/blog");
            }
            else {
                setStatus(((_a = profile.author) === null || _a === void 0 ? void 0 : _a.status) || null);
            }
        }
    }, [profile, router.isReady]);
    const submit = async () => {
        const { error } = await (0, api_1.default)({
            url: "/api/content/author",
            method: "POST",
        });
        if (!error) {
            await fetchProfile();
            setStatus("PENDING");
        }
    };
    const renderContent = () => {
        var _a;
        switch (status) {
            case "APPROVED":
                return (<div className="text-center flex flex-col gap-5 justify-center items-center h-full">
            <react_2.Icon icon="mdi:check-circle" className="text-success-500 h-16 w-16"/>
            <Heading_1.default as="h2" size="lg" weight="medium">
              {t("You are already an author")}
            </Heading_1.default>
            <Paragraph_1.default className="text-muted-500 dark:text-muted-400">
              {t("Congratulations! You have been approved as an author.")}
            </Paragraph_1.default>
            <ButtonLink_1.default href={`/user/blog/author/${(_a = profile === null || profile === void 0 ? void 0 : profile.author) === null || _a === void 0 ? void 0 : _a.id}`} className="mt-6">
              {t("Go to Author Page")}
            </ButtonLink_1.default>
          </div>);
            case "REJECTED":
                return (<div className="text-center flex flex-col gap-5 justify-center items-center h-full">
            <react_2.Icon icon="mdi:close-circle" className="text-danger-500 h-16 w-16"/>
            <Heading_1.default as="h2" size="lg" weight="medium">
              {t("Your application has been rejected")}
            </Heading_1.default>
            <Paragraph_1.default className="text-muted-500 dark:text-muted-400">
              {t("Unfortunately, your application has been rejected.")}
            </Paragraph_1.default>
            <ButtonLink_1.default href="/blog" className="mt-6">
              {t("Back to Blog")}
            </ButtonLink_1.default>
          </div>);
            case "PENDING":
                return (<div className="text-center flex flex-col gap-5 justify-center items-center h-full">
            <react_2.Icon icon="mdi:clock" className="text-warning-500 h-16 w-16"/>
            <Heading_1.default as="h2" size="lg" weight="medium">
              {t("Your application is pending")}
            </Heading_1.default>
            <Paragraph_1.default className="text-muted-500 dark:text-muted-400">
              {t("Your application is currently under review.")}
            </Paragraph_1.default>
            <ButtonLink_1.default href="/blog" className="mt-6">
              {t("Back to Blog")}
            </ButtonLink_1.default>
          </div>);
            case null:
            default:
                return (<div className="text-center flex flex-col gap-5 justify-center items-center h-full">
            <Avatar_1.default className="mx-auto" size="xl" src="/img/avatars/10.svg"/>
            <div className="mx-auto max-w-xs text-center">
              <Heading_1.default as="h2" size="md" weight="medium" className="mt-4">
                {t("Application for")} {process.env.NEXT_PUBLIC_SITE_NAME}{" "}
                {t("Authorship Program")}
              </Heading_1.default>
            </div>
            <div className="mx-auto max-w-sm">
              <Card_1.default className="p-6">
                <Heading_1.default as="h3" size="xs" weight="medium" className="text-muted-400 mb-2 text-[0.65rem]! uppercase">
                  {t("Note from Editorial Team")}
                </Heading_1.default>
                <Paragraph_1.default size="xs" className="text-muted-500 dark:text-muted-400">
                  {t("Dear Applicant, We have noticed your interest in contributing to our platform. Due to the increasing volume of content, we are currently expanding our team of authors. We'd be delighted to consider you for this role.")}
                </Paragraph_1.default>
              </Card_1.default>

              <div className="mt-6 flex items-center justify-between gap-2">
                <ButtonLink_1.default className="w-full" href="/blog">
                  {t("Decline")}
                </ButtonLink_1.default>
                <Button_1.default color="primary" className="w-full" onClick={submit}>
                  {t("Accept")}
                </Button_1.default>
              </div>
            </div>
          </div>);
        }
    };
    return (<Default_1.default title={t("Action")} color="muted">
      <div className="flex items-center justify-center py-8 text-muted-800 dark:text-muted-200">
        <div className="mx-auto w-full max-w-4xl">
          <Card_1.default color={"contrast"}>
            <div className="divide-muted-200 dark:divide-muted-700 grid divide-y sm:grid-cols-2 sm:divide-x sm:divide-y-0">
              <div className="flex flex-col p-8">{renderContent()}</div>
              <div>
                <div className="flex flex-col p-8">
                  <Heading_1.default as="h2" size="md" weight="medium" className="mt-4">
                    {t("Onboarding Guidelines")}
                  </Heading_1.default>
                  <Paragraph_1.default size="xs" className="text-muted-500 dark:text-muted-400 max-w-xs">
                    {t("Please review the following guidelines carefully before accepting this invitation.")}
                  </Paragraph_1.default>
                  <div className="mt-6">
                    <ul className="space-y-6">
                      <li className="flex gap-3">
                        <div className="border-muted-200 dark:border-muted-600 dark:bg-muted-700 shadow-muted-300/30 dark:shadow-muted-800/20 flex h-9 w-9 items-center justify-center rounded-full border bg-white shadow-xl">
                          <react_2.Icon icon="fa-solid:gem" className="text-warning-500 h-4 w-4"/>
                        </div>
                        <div>
                          <Heading_1.default as="h3" size="sm" weight="medium">
                            {t("Content Quality")}
                          </Heading_1.default>
                          <Paragraph_1.default size="xs" className="text-muted-500 dark:text-muted-400 max-w-[210px]">
                            {t("Ensure your articles meet our editorial standards for accuracy, depth, and quality.")}
                          </Paragraph_1.default>
                        </div>
                      </li>
                      <li className="flex gap-3">
                        <div className="border-muted-200 dark:border-muted-600 dark:bg-muted-700 shadow-muted-300/30 dark:shadow-muted-800/20 flex h-9 w-9 items-center justify-center rounded-full border bg-white shadow-xl">
                          <react_2.Icon icon="lucide:check" className="text-success-500 h-4 w-4"/>
                        </div>
                        <div>
                          <Heading_1.default as="h3" size="sm" weight="medium">
                            {t("Plagiarism")}
                          </Heading_1.default>
                          <Paragraph_1.default size="xs" className="text-muted-500 dark:text-muted-400 max-w-[210px]">
                            {t("Plagiarism is strictly prohibited. All content must be original and properly cited.")}
                          </Paragraph_1.default>
                        </div>
                      </li>
                      <li className="flex gap-3">
                        <div className="border-muted-200 dark:border-muted-600 dark:bg-muted-700 shadow-muted-300/30 dark:shadow-muted-800/20 flex h-9 w-9 items-center justify-center rounded-full border bg-white shadow-xl">
                          <react_2.Icon icon="fluent:prohibited-20-regular" className="text-danger-500 h-4 w-4"/>
                        </div>
                        <div>
                          <Heading_1.default as="h3" size="sm" weight="medium">
                            {t("Prohibited Content")}
                          </Heading_1.default>
                          <Paragraph_1.default size="xs" className="text-muted-500 dark:text-muted-400 max-w-[210px]">
                            {t("Content that includes hate speech, harassment, violence, or explicit material is strictly prohibited.")}
                          </Paragraph_1.default>
                        </div>
                      </li>
                      <li className="flex gap-3">
                        <div className="border-muted-200 dark:border-muted-600 dark:bg-muted-700 shadow-muted-300/30 dark:shadow-muted-800/20 flex h-9 w-9 items-center justify-center rounded-full border bg-white shadow-xl">
                          <react_2.Icon icon="healthicons:communication-outline" className="text-info-500 h-4 w-4"/>
                        </div>
                        <div>
                          <Heading_1.default as="h3" size="sm" weight="medium">
                            {t("Communication")}
                          </Heading_1.default>
                          <Paragraph_1.default size="xs" className="text-muted-500 dark:text-muted-400 max-w-[210px]">
                            {t("Maintain open and clear communication with the editorial team.")}
                          </Paragraph_1.default>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </Card_1.default>
        </div>
      </div>
    </Default_1.default>);
};
exports.default = Action;
