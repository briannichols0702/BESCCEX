"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServerSideProps = void 0;
const Default_1 = __importDefault(require("@/layouts/Default"));
const MashImage_1 = require("@/components/elements/MashImage");
const link_1 = __importDefault(require("next/link"));
const Card_1 = __importDefault(require("@/components/elements/base/card/Card"));
const page_header_1 = require("@/components/elements/base/page-header");
const next_i18next_1 = require("next-i18next");
const api_1 = require("@/utils/api");
const Errors_1 = require("@/components/ui/Errors");
const Blog = ({ categories, error }) => {
    const { t } = (0, next_i18next_1.useTranslation)();
    if (error) {
        return (<Errors_1.ErrorPage title={t("Error")} description={t(error)} link="/blog" linkTitle={t("Back to Blog")}/>);
    }
    return (<Default_1.default title={t("Blog")} color="muted">
      <div className="space-y-5 max-w-5xl lg:mx-auto">
        <page_header_1.PageHeader title={t("Blog Categories")}/>
        <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {categories.map((category, index) => (<link_1.default href={`/blog/category/${category.slug}`} passHref key={index}>
              <Card_1.default shape="curved" className="group p-3 transition duration-300 ease-in-out transform hover:-translate-y-1">
                <div className="relative w-full h-[120px]">
                  <MashImage_1.MashImage src={category.image || "/img/placeholder.svg"} alt={category.name} className="rounded-lg object-cover" fill/>
                </div>
                <div>
                  <div className="mt-3">
                    <h3 className="line-clamp-2 text-gray-800 dark:text-gray-100">
                      {category.name}
                    </h3>
                    <div>
                      <p className="text-muted-400 font-sans text-xs">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </div>
              </Card_1.default>
            </link_1.default>))}
        </div>
      </div>
    </Default_1.default>);
};
async function getServerSideProps(context) {
    try {
        const { data, error } = await (0, api_1.$serverFetch)(context, {
            url: `/api/content/category`,
        });
        if (error || !data) {
            return {
                props: {
                    error: error || "Unable to fetch categories.",
                },
            };
        }
        return {
            props: {
                categories: data,
            },
        };
    }
    catch (error) {
        console.error("Error fetching categories:", error);
        return {
            props: {
                error: `An unexpected error occurred: ${error.message}`,
            },
        };
    }
}
exports.getServerSideProps = getServerSideProps;
exports.default = Blog;
