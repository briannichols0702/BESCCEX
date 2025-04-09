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
const react_1 = require("react");
const Minimal_1 = __importDefault(require("@/layouts/Minimal"));
const router_1 = require("next/router");
const dashboard_1 = require("@/stores/dashboard");
const api_1 = __importDefault(require("@/utils/api"));
const BackButton_1 = require("@/components/elements/base/button/BackButton");
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const dynamic_1 = __importDefault(require("next/dynamic"));
const sonner_1 = require("sonner");
const next_i18next_1 = require("next-i18next");
const EmailEditor = (0, dynamic_1.default)(() => Promise.resolve().then(() => __importStar(require("react-email-editor"))), { ssr: false });
const CreateTemplate = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const { isDark } = (0, dashboard_1.useDashboardStore)();
    const router = (0, router_1.useRouter)();
    const { id } = router.query;
    const emailEditorRef = (0, react_1.useRef)(null);
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [template, setTemplate] = (0, react_1.useState)({});
    const [editorReady, setEditorReady] = (0, react_1.useState)(false);
    const onLoad = (unlayer) => {
        console.log("onLoad", unlayer);
        emailEditorRef.current = unlayer; // Ensure the reference is set here
        unlayer.addEventListener("design:loaded", (data) => {
            console.log("onDesignLoad", data);
        });
    };
    const onReady = (unlayer) => {
        console.log("onReady", unlayer);
        setEditorReady(true);
    };
    const fetchTemplate = async () => {
        const { data, error } = await (0, api_1.default)({
            url: `/api/admin/ext/mailwizard/template/${id}`,
            silent: true,
        });
        if (!error) {
            setTemplate(data);
        }
    };
    (0, react_1.useEffect)(() => {
        if (router.isReady) {
            fetchTemplate();
        }
    }, [router.isReady]);
    (0, react_1.useEffect)(() => {
        if (editorReady && template.design) {
            const unlayer = emailEditorRef.current;
            if (unlayer && unlayer.loadDesign) {
                let design;
                try {
                    design = JSON.parse(template.design);
                }
                catch (error) {
                    design = {};
                }
                unlayer.loadDesign(design);
            }
        }
    }, [editorReady, template]);
    const save = async () => {
        setIsLoading(true);
        const unlayer = emailEditorRef.current;
        if (!unlayer) {
            sonner_1.toast.error("Editor not loaded");
            setIsLoading(false);
            return;
        }
        unlayer.exportHtml(async (data) => {
            const { design, html } = data;
            const { error } = await (0, api_1.default)({
                url: `/api/admin/ext/mailwizard/template/${id}`,
                method: "PUT",
                body: {
                    content: html,
                    design: JSON.stringify(design),
                },
            });
            if (!error) {
                router.push("/admin/ext/mailwizard/template");
            }
            setIsLoading(false);
        });
    };
    return (<Minimal_1.default title={t("Create Mailwizard Template")} color="muted">
      <div className="flex justify-between items-center mb-4 p-4">
        <div>
          <h2 className="text-xl font-semibold text-muted-700 dark:text-white">
            {t("Edit")} {template.name} {t("Template")}
          </h2>
        </div>
        <div className="flex gap-2">
          <BackButton_1.BackButton href="/admin/ext/mailwizard/template"/>
          <Button_1.default type="button" color="primary" onClick={save} disabled={isLoading || !emailEditorRef.current} loading={isLoading || !emailEditorRef.current}>
            {t("Save")}
          </Button_1.default>
        </div>
      </div>
      <react_1.StrictMode>
        <div className="w-full">
          <EmailEditor ref={emailEditorRef} onLoad={onLoad} onReady={onReady} options={{
            displayMode: "email",
            appearance: {
                theme: isDark ? "dark" : "modern_light",
                panels: {
                    tools: {
                        dock: "left",
                    },
                },
            },
        }}/>
        </div>
      </react_1.StrictMode>
    </Minimal_1.default>);
};
exports.default = CreateTemplate;
exports.permission = "Access Mailwizard Template Management";
