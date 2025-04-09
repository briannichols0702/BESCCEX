"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStaticProps = void 0;
// src/pages/cookies.tsx
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const react_1 = __importDefault(require("react"));
const Nav_1 = __importDefault(require("@/layouts/Nav"));
const Footer_1 = __importDefault(require("@/components/pages/frontend/Footer"));
const getStaticProps = async () => {
    const filePath = path_1.default.join(process.cwd(), "template", "cookies.html");
    const fileContents = fs_1.default.readFileSync(filePath, "utf8");
    return {
        props: {
            content: fileContents,
        },
    };
};
exports.getStaticProps = getStaticProps;
const CookiesPage = ({ content }) => {
    return (<Nav_1.default color="muted" horizontal>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-10 prose prose-lg dark:prose-dark">
        <div dangerouslySetInnerHTML={{ __html: content }}/>
      </div>
      <Footer_1.default />
    </Nav_1.default>);
};
exports.default = CookiesPage;
