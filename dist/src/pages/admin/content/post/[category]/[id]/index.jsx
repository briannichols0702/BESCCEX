"use client";
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
exports.permission = void 0;
const react_1 = __importStar(require("react"));
const dynamic_1 = __importDefault(require("next/dynamic"));
const Default_1 = __importDefault(require("@/layouts/Default"));
const api_1 = __importDefault(require("@/utils/api"));
const router_1 = require("next/router");
const Card_1 = __importDefault(require("@/components/elements/base/card/Card"));
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const Input_1 = __importDefault(require("@/components/elements/form/input/Input"));
const Textarea_1 = __importDefault(require("@/components/elements/form/textarea/Textarea"));
const Listbox_1 = __importDefault(require("@/components/elements/form/listbox/Listbox"));
const InputFile_1 = __importDefault(require("@/components/elements/form/input-file/InputFile"));
const lodash_1 = require("lodash");
const next_i18next_1 = require("next-i18next");
const upload_1 = require("@/utils/upload");
require("react-quill/dist/quill.snow.css");
const ReactQuill = (0, dynamic_1.default)(() => Promise.resolve().then(() => __importStar(require("react-quill"))), { ssr: false });
const PostEditor = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const [postData, setPostData] = (0, react_1.useState)({
        title: "",
        description: "",
        content: "",
        categoryId: "",
        tags: [],
        status: { value: "DRAFT", label: "Draft" },
        image: "",
        slug: "",
    });
    const [content, setContent] = (0, react_1.useState)("");
    const router = (0, router_1.useRouter)();
    const [categories, setCategories] = (0, react_1.useState)([]);
    const [tagsArray, setTagsArray] = (0, react_1.useState)([]);
    const { category, id } = router.query;
    const [imageUrl, setImageUrl] = (0, react_1.useState)(null);
    const editorRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        if (router.isReady) {
            fetchCategories();
            if (id) {
                fetchData();
            }
        }
        return () => {
            if (editorRef.current) {
                editorRef.current = null;
            }
        };
    }, [router.isReady, id]);
    const fetchData = async () => {
        const { data, error } = await (0, api_1.default)({
            url: `/api/admin/content/post/${id}`,
            silent: true,
        });
        if (!error && data) {
            setPostData({
                title: data.title,
                description: data.description || "",
                content: data.content || "",
                categoryId: data.categoryId || "",
                tags: data.tags || [],
                status: {
                    value: data.status,
                    label: (0, lodash_1.capitalize)(data.status),
                },
                image: data.image || "",
                slug: data.slug,
            });
            setTagsArray(data.tags.map((tag) => tag.name));
            setContent(data.content || "");
            setImageUrl(data.image || "");
        }
    };
    const fetchCategories = async () => {
        const { data, error } = await (0, api_1.default)({
            url: "/api/content/category",
            silent: true,
        });
        if (!error && data) {
            setCategories(data.map((category) => ({
                value: category.id,
                label: category.name,
            })));
        }
    };
    const handleSubmit = async () => {
        if (!postData)
            return;
        const status = postData.status.value;
        const body = {
            title: postData.title,
            description: postData.description || "",
            content,
            categoryId: postData.categoryId,
            tags: tagsArray,
            status: { value: status, label: (0, lodash_1.capitalize)(status) },
            image: imageUrl || "",
            slug: postData.slug,
        };
        const method = id ? "PUT" : "POST";
        const url = id
            ? `/api/admin/content/post/${id}`
            : `/api/admin/content/post`;
        const { error } = await (0, api_1.default)({
            url,
            method,
            body,
        });
        if (!error) {
            router.push("/admin/content/post");
        }
        else {
            console.error("Error submitting content:", error);
        }
    };
    const handleTagsInputChange = (e) => {
        const newTags = e.target.value.split(", ");
        setTagsArray(newTags);
    };
    const handleFileUpload = async (files) => {
        if (files.length > 0) {
            const file = files[0];
            const result = await (0, upload_1.imageUploader)({
                file,
                dir: `blog/${category || "uncategorized"}`,
                size: {
                    maxWidth: 1280,
                    maxHeight: 720,
                },
                oldPath: imageUrl || undefined,
            });
            if (result.success) {
                setImageUrl(result.url);
                setPostData((prev) => ({
                    ...prev,
                    image: result.url,
                }));
            }
            else {
                console.error("Error uploading file");
            }
        }
    };
    return (<Default_1.default title={t("Blog Editor")} color="muted">
      <Card_1.default className="p-5 mb-5 text-muted-800 dark:text-muted-100">
        <div className="flex justify-between items-center">
          <h1 className="text-lg">
            {id
            ? `${t("Editing")} ${postData ? postData.title : "Post"}`
            : t("New Post")}
          </h1>
          <div className="flex gap-2">
            <Button_1.default onClick={() => router.push("/admin/content/post")} variant="outlined" shape="rounded-sm" size="md" color="danger">
              {t("Cancel")}
            </Button_1.default>
            <Button_1.default onClick={handleSubmit} variant="outlined" shape="rounded-sm" size="md" color="success">
              {t("Save")}
            </Button_1.default>
          </div>
        </div>
        <div>
          <Input_1.default label={t("Title")} placeholder={t("Post title")} value={postData.title} // Always has a value since postData is initialized
     onChange={(e) => setPostData((prev) => ({
            ...prev,
            title: e.target.value,
        }))}/>
          <Textarea_1.default label={t("Description")} placeholder={t("Post description")} value={postData.description} // Always has a value since postData is initialized
     onChange={(e) => setPostData((prev) => ({
            ...prev,
            description: e.target.value,
        }))}/>
          <div className="flex gap-2">
            <Input_1.default label={t("Tags")} placeholder={t("Post tags")} value={tagsArray.join(", ")} onChange={handleTagsInputChange}/>
            <Listbox_1.default label={t("Category")} options={categories} selected={categories.find((category) => category.value === postData.categoryId) || {
            value: "",
            label: t("Select a category"),
        }} setSelected={(selectedCategory) => setPostData((prev) => ({
            ...prev,
            categoryId: selectedCategory.value,
        }))}/>
            <Listbox_1.default label={t("Status")} options={[
            { value: "DRAFT", label: "Draft" },
            { value: "PUBLISHED", label: "Published" },
        ]} selected={postData.status} setSelected={(e) => {
            setPostData((prev) => ({
                ...prev,
                status: e,
            }));
        }}/>
          </div>
          <div className="mt-5">
            <InputFile_1.default id="featured-image" acceptedFileTypes={[
            "image/png",
            "image/jpeg",
            "image/jpg",
            "image/gif",
            "image/svg+xml",
            "image/webp",
        ]} preview={imageUrl} previewPlaceholder="/img/placeholder.svg" maxFileSize={16} label={`${t("Max File Size")}: 16 MB`} labelAlt={`${t("Size")}: 1280x720 px`} bordered color="default" onChange={handleFileUpload} onRemoveFile={() => {
            setImageUrl(null);
            setPostData((prev) => ({
                ...prev,
                image: "",
            }));
        }}/>
          </div>
        </div>
      </Card_1.default>
      <Card_1.default className="mb-5">
        <div className="p-5">
          <h2 className="text-lg text-muted-800 dark:text-muted-100">
            {t("Content")}
          </h2>
        </div>
        <hr className="border-t border-muted-300 dark:border-muted-700"/>
        <div className="mt-10 p-5">
          <ReactQuill value={content} onChange={setContent} theme="snow" modules={{
            toolbar: [
                [{ header: "1" }, { header: "2" }, { font: [] }],
                [{ size: [] }],
                ["bold", "italic", "underline", "strike", "blockquote"],
                [{ list: "ordered" }, { list: "bullet" }],
                ["link", "image", "video"],
                ["clean"],
            ],
        }} formats={[
            "header",
            "font",
            "size",
            "bold",
            "italic",
            "underline",
            "strike",
            "blockquote",
            "list",
            "bullet",
            "link",
            "image",
            "video",
        ]} placeholder="Compose your content here..." className="quillEditor" // Add your custom class for styling
    />
        </div>
      </Card_1.default>
    </Default_1.default>);
};
exports.default = PostEditor;
exports.permission = "Access Post Management";
