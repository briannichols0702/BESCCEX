"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServerSideProps = void 0;
const Default_1 = __importDefault(require("@/layouts/Default"));
const HeroParallax_1 = require("@/components/ui/HeroParallax");
const MashImage_1 = require("@/components/elements/MashImage");
const Input_1 = __importDefault(require("@/components/elements/form/input/Input"));
const react_1 = require("@iconify/react");
const ButtonLink_1 = __importDefault(require("@/components/elements/base/button-link/ButtonLink"));
const HeaderCardImage_1 = require("@/components/widgets/HeaderCardImage");
const Faq_1 = require("@/components/pages/knowledgeBase/Faq");
const Card_1 = __importDefault(require("@/components/elements/base/card/Card"));
const link_1 = __importDefault(require("next/link"));
const next_i18next_1 = require("next-i18next");
const api_1 = require("@/utils/api");
const Errors_1 = require("@/components/ui/Errors");
const react_2 = require("react");
const TokenInitialOfferingDashboard = ({ projects = [], error, }) => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const [searchTerm, setSearchTerm] = (0, react_2.useState)("");
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };
    const filteredProjects = projects.filter((project) => project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()));
    if (error) {
        return (<Errors_1.ErrorPage title={t("Error")} description={t(error)} link="/" linkTitle={t("Go Back")}/>);
    }
    return (<Default_1.default title={t("ICO Projects")} color="muted">
      {projects.length > 7 ? (<HeroParallax_1.HeroParallax items={projects.map((project) => ({
                title: project.name,
                link: `/ico/project/${project.id}`,
                thumbnail: project.image,
            }))} title={<>
              <span className="text-primary-500">
                {t("Initial Coin Offering")}
              </span>
              <br />
              {t("Popular Projects")}
            </>} description={<>
              {t("Discover the most popular projects in the crypto space, and invest in the future.")}
              <br />
              <ButtonLink_1.default href="/user/ico/contribution" type="button" className="mt-5" animated={false}>
                {t("View Your Contributions")}
                <react_1.Icon icon="mdi:chevron-right" className="ml-2 h-5 w-5"/>
              </ButtonLink_1.default>
            </>}/>) : (<div className="mb-5">
          <HeaderCardImage_1.HeaderCardImage title={t("Discover the most popular projects in the crypto space")} description="Invest in the future of blockchain technology and be part of the next big thing." lottie={{
                category: "cryptocurrency-2",
                path: "payout",
                height: 200,
            }} size="lg"/>
        </div>)}

      <div className="flex flex-col md:flex-row gap-5 justify-between items-center">
        <h2 className="text-2xl">
          <span className="text-primary-500">{t("Popular")} </span>
          <span className="text-muted-800 dark:text-muted-200">
            {t("Projects")}
          </span>
        </h2>

        <div className="w-full sm:max-w-xs text-end">
          <Input_1.default type="text" placeholder={t("Search Projects")} value={searchTerm} onChange={handleSearchChange} icon={"mdi:magnify"}/>
        </div>
      </div>

      <div className="relative my-5">
        <hr className="border-muted-200 dark:border-muted-700"/>
        <span className="absolute inset-0 -top-2 text-center font-semibold text-xs text-muted-500 dark:text-muted-400">
          <span className="bg-muted-50 dark:bg-muted-900 px-2">
            {searchTerm ? `Matching "${searchTerm}"` : `All ICO Projects`}
          </span>
        </span>
      </div>
      {filteredProjects.length > 0 ? (<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredProjects.map((project) => (<link_1.default key={project.id} href={`/ico/project/${project.id}`}>
              <Card_1.default className="col-span-1 group relative w-full h-full p-3 hover:shadow-lg cursor-pointer hover:border-primary-500 dark:hover:border-primary-400">
                <div className="relative w-full h-[200px] overflow-hidden rounded-lg">
                  <MashImage_1.MashImage src={project.image} alt={project.name} className="rounded-md object-cover w-full h-full bg-muted-100 dark:bg-muted-900" fill/>
                </div>
                <div className="p-2">
                  <h3 className="text-lg font-semibold text-primary-500 dark:text-primary-400">
                    {project.name}
                  </h3>
                  <div className="flex flex-col gap-1 text-xs">
                    <p className="text-muted-500 dark:text-muted-400">
                      {project.description.length > 150
                    ? project.description.slice(0, 150) + "..."
                    : project.description}
                    </p>
                  </div>
                </div>
              </Card_1.default>
            </link_1.default>))}
        </div>) : (<div className="flex flex-col items-center justify-center gap-5 py-12">
          <h2 className="text-lg text-muted-800 dark:text-muted-200">
            {t("No Projects Found")}
          </h2>
          <p className="text-muted-500 dark:text-muted-400 text-sm">
            {t("We couldn't find any of the projects you are looking for.")}
          </p>
        </div>)}

      <Faq_1.Faq category="ICO"/>
    </Default_1.default>);
};
async function getServerSideProps(context) {
    try {
        const { data, error } = await (0, api_1.$serverFetch)(context, {
            url: `/api/ext/ico/project`,
        });
        if (error || !data) {
            return {
                props: {
                    error: error || "Unable to fetch ICO projects.",
                },
            };
        }
        return {
            props: {
                projects: data,
            },
        };
    }
    catch (error) {
        console.error("Error fetching ICO projects:", error);
        return {
            props: {
                error: `An unexpected error occurred: ${error.message}`,
            },
        };
    }
}
exports.getServerSideProps = getServerSideProps;
exports.default = TokenInitialOfferingDashboard;
