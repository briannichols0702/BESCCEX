"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServerSideProps = void 0;
const Default_1 = __importDefault(require("@/layouts/Default"));
const PostsSlider_1 = require("@/components/pages/blog/PostsSlider");
const PostsGrid_1 = require("@/components/pages/blog/PostsGrid");
const react_1 = require("swiper/react");
const modules_1 = require("swiper/modules");
require("swiper/css");
require("swiper/css/pagination");
require("swiper/css/effect-coverflow");
const link_1 = __importDefault(require("next/link"));
const Tag_1 = __importDefault(require("@/components/elements/base/tag/Tag"));
const MashImage_1 = require("@/components/elements/MashImage");
const next_i18next_1 = require("next-i18next");
const api_1 = require("@/utils/api");
const Errors_1 = require("@/components/ui/Errors");
const Blog = ({ posts, categories, tags, error }) => {
    const { t } = (0, next_i18next_1.useTranslation)();
    if (error) {
        return (<Errors_1.ErrorPage title={t("Error")} description={t(error)} link="/" linkTitle={t("Go Back")}/>);
    }
    return (<Default_1.default title={t("Blog")} color="muted">
      <div className="space-y-8 max-w-5xl lg:mx-auto">
        {/* Slider Section */}
        <div className="pb-5">
          <PostsSlider_1.PostsSlider content={(posts === null || posts === void 0 ? void 0 : posts.items) || []}/>
        </div>

        {/* Categories Section */}
        {categories && categories.length > 0 && (<>
            <div className="relative mb-6">
              <hr className="border-muted-200 dark:border-muted-800"/>
              <span className="absolute inset-0 -top-2 text-center font-semibold text-xs text-muted-500 dark:text-muted-400">
                <span className="bg-muted-50 dark:bg-muted-900 px-2">
                  {t("Categories")}
                </span>
              </span>
            </div>
            <react_1.Swiper modules={[modules_1.EffectCoverflow]} effect={"coverflow"} centeredSlides={true} grabCursor={true} loop={true} slidesPerView={4} spaceBetween={30} coverflowEffect={{
                rotate: 0,
                stretch: 0,
                depth: 120,
                modifier: 1,
                slideShadows: false,
            }} pagination={{
                clickable: true,
            }} breakpoints={{
                0: {
                    slidesPerView: 1,
                    spaceBetween: 10,
                },
                640: {
                    slidesPerView: 3,
                    spaceBetween: 20,
                },
                1024: {
                    slidesPerView: 4,
                    spaceBetween: 30,
                },
            }}>
              {categories.map((category, index) => (<react_1.SwiperSlide key={index} className="slide-item">
                  <link_1.default href={`/blog/category/${category.slug}`} passHref>
                    <div className="group transition duration-300 ease-in-out transform hover:-translate-y-1 relative">
                      <div className="relative w-full h-[150px]">
                        <MashImage_1.MashImage src={category.image || "/img/placeholder.svg"} alt={category.slug} className="object-cover w-full h-full bg-muted-100 dark:bg-muted-900 rounded-lg" fill/>
                      </div>
                      <div>
                        <div className="bg-muted-900 absolute inset-0 z-10 h-full w-full opacity-0 transition-opacity duration-300 group-hover:opacity-50 rounded-lg"></div>
                        <div className="absolute inset-0 z-20 flex h-full w-full flex-col justify-between p-6">
                          <h3 className="font-sans text-white opacity-0 transition-all duration-300 group-hover:opacity-100">
                            {category.name}
                          </h3>
                          <h3 className="font-sans text-sm text-white underline opacity-0 transition-all duration-300 group-hover:opacity-100">
                            {t("View Posts")}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </link_1.default>
                </react_1.SwiperSlide>))}
            </react_1.Swiper>
          </>)}

        {/* Latest Posts Section */}
        <div className="relative ">
          <hr className="border-muted-200 dark:border-muted-800"/>
          <span className="absolute inset-0 -top-2 text-center font-semibold text-xs text-muted-500 dark:text-muted-400">
            <span className="bg-muted-50 dark:bg-muted-900 px-2">
              {t("Latest Posts")}
            </span>
          </span>
        </div>
        <PostsGrid_1.PostsGrid posts={(posts === null || posts === void 0 ? void 0 : posts.items) || []}/>
      </div>

      {/* Tag Cloud Section */}
      <div className="relative mt-10 mb-5">
        <hr className="border-muted-200 dark:border-muted-800"/>
        <span className="absolute inset-0 -top-2 text-center font-semibold text-xs text-muted-500 dark:text-muted-400">
          <span className="bg-muted-50 dark:bg-muted-900 px-2">
            {t("Our Tag Cloud")}
          </span>
        </span>
      </div>
      <div className="flex flex-wrap gap-2 justify-center">
        {tags === null || tags === void 0 ? void 0 : tags.slice(0, 50).map((tag, index) => (<link_1.default href={`/blog/tag/${tag.slug}`} passHref key={index}>
            <Tag_1.default shape="rounded-sm" className="group p-3 transition duration-300 ease-in-out transform hover:-translate-y-1">
              {tag.name}
            </Tag_1.default>
          </link_1.default>))}
      </div>
    </Default_1.default>);
};
async function getServerSideProps(context) {
    try {
        const [postsResponse, categoriesResponse, tagsResponse] = await Promise.all([
            (0, api_1.$serverFetch)(context, {
                url: `/api/content/post?page=1&perPage=10&sortField=createdAt&sortOrder=desc`,
            }),
            (0, api_1.$serverFetch)(context, { url: `/api/content/category` }),
            (0, api_1.$serverFetch)(context, { url: `/api/content/tag` }),
        ]);
        if (postsResponse.error || categoriesResponse.error || tagsResponse.error) {
            throw new Error(postsResponse.error ||
                categoriesResponse.error ||
                tagsResponse.error ||
                "Unknown error occurred");
        }
        return {
            props: {
                posts: postsResponse.data,
                categories: categoriesResponse.data,
                tags: tagsResponse.data,
            },
        };
    }
    catch (error) {
        console.error("Error fetching data:", error);
        return {
            props: {
                error: `An unexpected error occurred: ${error.message}`,
            },
        };
    }
}
exports.getServerSideProps = getServerSideProps;
exports.default = Blog;
