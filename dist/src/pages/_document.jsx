"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const document_1 = require("next/document");
const dashboard_1 = require("@/stores/dashboard");
const defaultTheme = process.env.NEXT_PUBLIC_DEFAULT_THEME || "system";
const darkmodeInitScript = `(function () {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const setting = localStorage.getItem('${dashboard_1.THEME_KEY}') || '${defaultTheme}'
  if (setting === 'dark' || (prefersDark && setting !== 'light')) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
})()`;
function Document() {
    return (<document_1.Html suppressHydrationWarning={true}>
      <document_1.Head>
        <script dangerouslySetInnerHTML={{ __html: darkmodeInitScript }}></script>
      </document_1.Head>
      <body>
        <document_1.Main />
        <document_1.NextScript />
        <div id="portal-root"></div>
      </body>
    </document_1.Html>);
}
exports.default = Document;
