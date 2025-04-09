"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const next_i18next_1 = require("next-i18next");
const react_1 = __importDefault(require("react"));
const router_1 = require("next/router");
const MashImage_1 = require("@/components/elements/MashImage");
const ButtonLink_1 = __importDefault(require("@/components/elements/base/button-link/ButtonLink"));
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const Minimal_1 = __importDefault(require("@/layouts/Minimal"));
function NotFound() {
    const { t } = (0, next_i18next_1.useTranslation)();
    const router = (0, router_1.useRouter)();
    return (<Minimal_1.default title={`${t("Page not found")}`}>
      <main className="flex min-h-screen flex-col items-stretch justify-between bg-muted-100 dark:bg-muted-900">
        {/* <MinimalHeader /> */}

        <div className="hero-body flex shrink-0 grow items-center px-6 py-12 md:px-12 md:py-0">
          <div className="container">
            <div className="error-wrapper relative flex flex-col items-center justify-center overflow-hidden py-12">
              <div className="error-wrapper-inner relative isolate w-full">
                <div className="underlay absolute left-1/2 top-[36%] -z-1 -translate-x-1/2 -translate-y-1/2 font-sans text-[8rem] font-extrabold text-muted-800 dark:text-muted-300 opacity-10 md:top-[38%] md:text-[20rem] ltablet:text-[23rem] lg:text-[26rem]">
                  <span>404</span>
                </div>
                <div className="relative z-1">
                  <MashImage_1.MashImage className="mx-auto block w-full max-w-xl dark:hidden" width={510} height={341} src="/img/illustrations/404.svg" alt="Error image"/>
                  <MashImage_1.MashImage className="mx-auto hidden w-full max-w-xl dark:block" width={510} height={341} src="/img/illustrations/404-dark.svg" alt="Error image"/>
                </div>
                <div className="mt-4 text-center">
                  <h2 className="mb-2 font-sans text-3xl font-normal leading-tight text-muted-800 dark:text-muted-100">
                    <span>{`${t("Page Not Found")}`}</span>
                  </h2>
                  <p className="mx-auto mb-4 max-w-lg text-base text-muted-500 dark:text-muted-400">{`${t("Oops, something went wrong and we couldn't find that page, Please try again later or contact support")}`}</p>
                  <div className="flex items-center justify-center gap-2">
                    <ButtonLink_1.default href="/" variant="solid" color="primary" shape="smooth" className="min-w-[130px]">
                      {t("Homepage")}
                    </ButtonLink_1.default>

                    <Button_1.default onClick={() => router.back()} className="min-w-[130px]!">
                      {t("Back")}
                    </Button_1.default>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Minimal_1.default>);
}
exports.default = NotFound;
