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
const Default_1 = __importDefault(require("@/layouts/Default"));
const PostsGrid_1 = require("@/components/pages/blog/PostsGrid");
const Input_1 = __importDefault(require("@/components/elements/form/input/Input"));
const page_header_1 = require("@/components/elements/base/page-header");
const Pagination_1 = __importDefault(require("@/components/elements/base/pagination/Pagination"));
const Select_1 = __importDefault(require("@/components/elements/form/select/Select"));
const framer_motion_1 = require("framer-motion");
const lodash_1 = require("lodash");
const next_i18next_1 = require("next-i18next");
const api_1 = __importStar(require("@/utils/api"));
const react_1 = require("react");
const Errors_1 = require("@/components/ui/Errors");
const Blog = ({ initialData, slug, error }) => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const [filter, setFilter] = (0, react_1.useState)({});
    const [sort] = (0, react_1.useState)({ field: "createdAt", rule: "desc" });
    const [items, setItems] = (0, react_1.useState)((initialData === null || initialData === void 0 ? void 0 : initialData.items) || []);
    const [pagination, setPagination] = (0, react_1.useState)((initialData === null || initialData === void 0 ? void 0 : initialData.pagination) || {
        totalItems: 0,
        currentPage: 1,
        perPage: 10,
        totalPages: 0,
    });
    if (error) {
        return (<Errors_1.ErrorPage title={t("Error")} description={t(error)} link="/blog" linkTitle={t("Back to Blog")}/>);
    }
    const handleFilterChange = async (value) => {
        const activeFilter = {
            "category.slug": {
                value: slug,
                operator: "like",
            },
        };
        if (value.trim()) {
            activeFilter.title = {
                value: value.trim().toLowerCase(),
                operator: "startsWith",
            };
        }
        const params = new URLSearchParams({
            page: String(pagination.currentPage),
            perPage: String(pagination.perPage),
            sortField: sort.field,
            sortOrder: sort.rule,
            filter: JSON.stringify(activeFilter),
        });
        const response = await (0, api_1.default)({
            url: `/api/content/post?${params.toString()}`,
        });
        if (response.data) {
            setItems(response.data.items);
            setPagination(response.data.pagination);
        }
    };
    return (<Default_1.default title={t("Blog")} color="muted">
      <div className="space-y-5 max-w-5xl lg:mx-auto">
        <page_header_1.PageHeader title={`${(0, lodash_1.capitalize)(slug)} Posts`}>
          <Input_1.default type="text" placeholder={t("Search posts")} icon="ic:twotone-search" className="w-full px-3 py-1.5 text-sm text-muted-700 dark:text-muted-300 bg-muted-200 dark:bg-muted-800 rounded-md focus:ring-1 focus:ring-primary-500 focus:outline-hidden" onChange={(e) => {
            setFilter({ value: e.target.value });
            handleFilterChange(e.target.value);
        }}/>
        </page_header_1.PageHeader>

        <div className="relative">
          <hr className="border-muted-200 dark:border-muted-800"/>
          <span className="absolute inset-0 -top-2 text-center font-semibold text-xs text-muted-500 dark:text-muted-400">
            <span className="bg-muted-50 dark:bg-muted-900 px-2">
              {filter.value
            ? `Matching "${filter.value}"`
            : `Latest Posts in ${(0, lodash_1.capitalize)(slug)}`}
            </span>
          </span>
        </div>

        {items.length > 0 ? (<PostsGrid_1.PostsGrid posts={items}/>) : (<div className="flex items-center justify-center h-96">
            <h2 className="text-muted-500 dark:text-muted-400">
              {t("No posts found")}
            </h2>
          </div>)}

        <framer_motion_1.AnimatePresence>
          {pagination.totalPages > 1 && (<framer_motion_1.motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} transition={{ duration: 0.3 }} className="w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%] fixed bottom-10 left-[5%] sm:left-[10%] md:left-[15%] lg:left-[20%] flex gap-4 items-start">
              <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4 p-2 rounded-lg bg-muted-50 dark:bg-muted-950 border border-muted-200 dark:border-muted-800">
                <div className="w-full md:w-auto md:max-w-[164px]">
                  <Select_1.default color="contrast" name="pageSize" value={pagination.perPage} options={[
                { value: "5", label: "5 per page" },
                { value: "10", label: "10 per page" },
                { value: "15", label: "15 per page" },
                { value: "20", label: "20 per page" },
            ]} onChange={(e) => setPagination({
                ...pagination,
                perPage: parseInt(e.target.value),
                currentPage: 1,
            })}/>
                </div>
                <Pagination_1.default buttonSize={"md"} currentPage={pagination.currentPage} totalCount={pagination.totalItems} pageSize={pagination.perPage} onPageChange={(page) => setPagination({
                ...pagination,
                currentPage: page,
            })}/>
              </div>
            </framer_motion_1.motion.div>)}
        </framer_motion_1.AnimatePresence>
      </div>
    </Default_1.default>);
};
async function getServerSideProps(context) {
    const { slug } = context.params;
    try {
        const params = new URLSearchParams({
            page: "1",
            perPage: "10",
            sortField: "createdAt",
            sortOrder: "desc",
            filter: JSON.stringify({
                "category.slug": { value: slug, operator: "like" },
            }),
        });
        const { data, error } = await (0, api_1.$serverFetch)(context, {
            url: `/api/content/post?${params.toString()}`,
        });
        if (error || !data) {
            return {
                props: {
                    error: error || "Unable to fetch posts.",
                },
            };
        }
        return {
            props: {
                initialData: data,
                slug,
            },
        };
    }
    catch (error) {
        console.error("Error fetching posts:", error);
        return {
            props: {
                error: `An unexpected error occurred: ${error.message}`,
            },
        };
    }
}
exports.getServerSideProps = getServerSideProps;
exports.default = Blog;
