"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServerSideProps = void 0;
const react_1 = __importDefault(require("react"));
const dynamic_1 = __importDefault(require("next/dynamic"));
const Default_1 = __importDefault(require("@/layouts/Default"));
const dashboard_1 = require("@/stores/dashboard");
const next_i18next_1 = require("next-i18next");
const api_1 = require("@/utils/api");
const Errors_1 = require("@/components/ui/Errors");
// Dynamic imports
const AnimatedLaptopLayout = (0, dynamic_1.default)(() => Promise.resolve().then(() => __importStar(require("@/components/pages/blog/Layout/AnimatedLaptopLayout"))));
const DefaultLayout = (0, dynamic_1.default)(() => Promise.resolve().then(() => __importStar(require("@/components/pages/blog/Layout/DefaultLayout"))));
const TableOfContentsLayout = (0, dynamic_1.default)(() => Promise.resolve().then(() => __importStar(require("@/components/pages/blog/Layout/TableOfContentsLayout"))));
const Post = ({ post, comments = [], relatedPosts = [], error, }) => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const { settings } = (0, dashboard_1.useDashboardStore)();
    if (error) {
        // Render error UI if an error occurs
        return (<Errors_1.ErrorPage title={t("Error")} description={t(error)} link="/blog" linkTitle={t("Back to Blog")}/>);
    }
    if (!post) {
        // Render not found message if no post is available
        return (<Errors_1.NotFound title={t("Blog Post")} description={t("The blog post you are looking for does not exist.")} link="/blog" linkTitle={t("Back to Blog")}/>);
    }
    const blogPostLayout = (settings === null || settings === void 0 ? void 0 : settings.blogPostLayout) || "DEFAULT";
    return (<Default_1.default title={post.title || "Blog"} color="muted">
      {(() => {
            switch (blogPostLayout) {
                case "TABLE_OF_CONTENTS":
                    return (<TableOfContentsLayout post={post} comments={comments} relatedPosts={relatedPosts} t={t}/>);
                case "ANIMATED_LAPTOP":
                    return (<AnimatedLaptopLayout post={post} comments={comments} relatedPosts={relatedPosts} t={t}/>);
                default:
                    return (<DefaultLayout post={post} comments={comments} relatedPosts={relatedPosts} t={t}/>);
            }
        })()}
    </Default_1.default>);
};
async function getServerSideProps(context) {
    const { slug } = context.params;
    try {
        const { data, error } = await (0, api_1.$serverFetch)(context, {
            url: `/api/content/post/${slug}`,
        });
        if (error || !data) {
            return {
                props: {
                    error: error || "Unable to fetch the blog post.",
                },
            };
        }
        return {
            props: {
                post: data,
                comments: data.comments || [],
                relatedPosts: data.relatedArticles || [],
            },
        };
    }
    catch (error) {
        console.error("Error fetching post data:", error);
        return {
            props: {
                error: `An unexpected error occurred: ${error.message}`,
            },
        };
    }
}
exports.getServerSideProps = getServerSideProps;
exports.default = Post;
