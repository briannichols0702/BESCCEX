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
const Default_1 = __importDefault(require("@/layouts/Default"));
const next_i18next_1 = require("next-i18next");
const link_1 = __importDefault(require("next/link"));
const Card_1 = __importDefault(require("@/components/elements/base/card/Card"));
const MashImage_1 = require("@/components/elements/MashImage");
const Tag_1 = __importDefault(require("@/components/elements/base/tag/Tag"));
const lodash_1 = require("lodash");
const api_1 = __importDefault(require("@/utils/api"));
const router_1 = require("next/router");
const api = "/api/admin/system/extension";
const Extension = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const [extensions, setExtensions] = (0, react_1.useState)([]);
    const router = (0, router_1.useRouter)();
    const fetchData = async () => {
        const { data, error } = await (0, api_1.default)({
            url: api,
            silent: true,
        });
        if (!error)
            setExtensions(data);
    };
    const debouncedFetchData = (0, lodash_1.debounce)(fetchData, 100);
    (0, react_1.useEffect)(() => {
        if (router.isReady)
            debouncedFetchData();
    }, [router.isReady]);
    return (<Default_1.default title={t("Extensions")} color="muted">
      <div className="grid gap-x-3 gap-y-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {extensions.map((product) => (<div key={product.id} className="relative group">
            <link_1.default href={`/admin/system/extension/${product.productId}`}>
              <Card_1.default className="relative p-3 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl rounded-lg" color="contrast">
                <div className="relative w-full h-full">
                  <MashImage_1.MashImage src={product.image || "/img/placeholder.svg"} alt={product.name} className="rounded-lg object-cover"/>
                  <div className="absolute bottom-1 right-1">
                    <Tag_1.default color={product.status ? "success" : "danger"}>
                      {product.status ? "Active" : "Inactive"}
                    </Tag_1.default>
                  </div>
                </div>
                <div className="mb-2">
                  <h4 className="text-muted-800 dark:text-muted-100 font-medium">
                    {product.title}
                  </h4>
                  <p className="text-muted-500 dark:text-muted-400 text-sm">
                    {product.description.length > 250
                ? product.description.slice(0, 250) + "..."
                : product.description}
                  </p>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-800 dark:text-muted-100">
                    Version
                  </span>
                  <span className="text-muted-800 dark:text-muted-100">
                    {parseFloat(product.version) >= 4 ? product.version : "N/A"}
                  </span>
                </div>
              </Card_1.default>
            </link_1.default>
          </div>))}
      </div>
    </Default_1.default>);
};
exports.default = Extension;
exports.permission = "Access Extension Management";
