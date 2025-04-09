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
const react_1 = __importStar(require("react"));
const lzutf8_1 = __importDefault(require("lzutf8"));
const Nav_1 = __importDefault(require("@/layouts/Nav"));
const api_1 = __importDefault(require("@/utils/api"));
const router_1 = require("next/router");
const builder_1 = require("@/components/builder");
const Editor_1 = require("@/components/builder/editor/Editor");
const BuilderComponent = () => {
    const [pageReady, setPageReady] = (0, react_1.useState)(false);
    const [initialJson, setInitialJson] = (0, react_1.useState)(null);
    const router = (0, router_1.useRouter)();
    const [isMounted, setIsMounted] = (0, react_1.useState)(false);
    const loadState = async () => {
        const { data, error } = await (0, api_1.default)({
            url: "/api/content/page",
            silent: true,
        });
        if (!error) {
            const page = data.find((p) => p.slug === "frontend");
            if (page && page.content) {
                const { content } = page;
                try {
                    const json = lzutf8_1.default.decompress(lzutf8_1.default.decodeBase64(content));
                    setInitialJson(json);
                }
                catch (error) {
                    console.error("Error parsing JSON", error);
                    setInitialJson(Editor_1.DEFAULT_TEMPLATE);
                }
                setPageReady(true);
            }
        }
    };
    (0, react_1.useEffect)(() => {
        if (router.isReady) {
            loadState();
        }
    }, [router.isReady]);
    (0, react_1.useEffect)(() => {
        setIsMounted(true);
    }, []);
    if (!isMounted) {
        return null; // or a loading spinner
    }
    return (<Nav_1.default horizontal transparent>
      {pageReady && <builder_1.ContentProvider data={initialJson}/>}
    </Nav_1.default>);
};
BuilderComponent.displayName = "BuilderComponent";
exports.default = BuilderComponent;
