"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServerSideProps = void 0;
const Default_1 = __importDefault(require("@/layouts/Default"));
const link_1 = __importDefault(require("next/link"));
const page_header_1 = require("@/components/elements/base/page-header");
const Tag_1 = __importDefault(require("@/components/elements/base/tag/Tag"));
const next_i18next_1 = require("next-i18next");
const Errors_1 = require("@/components/ui/Errors");
const api_1 = require("@/utils/api");
const BlogTags = ({ tags = [], error }) => {
    const { t } = (0, next_i18next_1.useTranslation)();
    if (error) {
        return (<Errors_1.ErrorPage title={t("Error")} description={t(error)} link="/blog" linkTitle={t("Back to Blog")}/>);
    }
    return (<Default_1.default title={t("Blog")} color="muted">
      <div className="space-y-5 max-w-5xl lg:mx-auto">
        <page_header_1.PageHeader title={t("Blog Tags")}/>

        <div className="flex flex-wrap gap-2 justify-center">
          {tags.map((tag, index) => (<link_1.default href={`/blog/tag/${tag.slug}`} passHref key={index}>
              <Tag_1.default shape="rounded-sm" className="group p-3 transition duration-300 ease-in-out transform hover:-translate-y-1">
                {tag.name}
              </Tag_1.default>
            </link_1.default>))}
        </div>
      </div>
    </Default_1.default>);
};
async function getServerSideProps(context) {
    try {
        const { data, error } = await (0, api_1.$serverFetch)(context, {
            url: `/api/content/tag`,
        });
        if (error || !data) {
            return {
                props: {
                    error: error || "Unable to fetch tags.",
                },
            };
        }
        return {
            props: {
                tags: data,
            },
        };
    }
    catch (error) {
        console.error("Error fetching tags:", error);
        return {
            props: {
                error: `An unexpected error occurred: ${error.message}`,
            },
        };
    }
}
exports.getServerSideProps = getServerSideProps;
exports.default = BlogTags;
