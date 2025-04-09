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
exports.Menu = void 0;
const react_1 = __importStar(require("react"));
const NavDropdown_1 = __importDefault(require("../navbar/NavDropdown"));
const NavbarItem_1 = __importDefault(require("../navbar/NavbarItem"));
const router_1 = require("next/router");
const dashboard_1 = require("@/stores/dashboard");
const MenuBase = () => {
    const { isSidebarOpenedMobile, filteredMenu } = (0, dashboard_1.useDashboardStore)();
    const router = (0, router_1.useRouter)();
    const [isMounted, setIsMounted] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        setIsMounted(true);
    }, []);
    const isMenuItemActive = (item) => {
        return item.href === router.pathname;
    };
    // Helper function to render a single link
    const renderLink = (item, key, hasDescription = false) => (<NavbarItem_1.default key={key} icon={item.icon || (isMenuItemActive(item) ? "ph:dot-fill" : "ph:dot-duotone")} title={item.title} href={item.href} description={hasDescription && item.description}/>);
    // Helper function to render a dropdown or link based on the item type
    const renderDropdownOrLink = (item, idx, nested = false, hasDescription = false) => {
        const subMenu = Array.isArray(item.subMenu) ? item.subMenu : item.menu;
        if (Array.isArray(subMenu)) {
            return (<NavDropdown_1.default key={idx} title={item.title} icon={item.icon ||
                    (isMenuItemActive(item) ? "ph:dot-fill" : "ph:dot-duotone")} nested={nested} description={hasDescription && item.description}>
          {subMenu.map((subItem, subIdx) => subItem.subMenu || subItem.menu
                    ? renderDropdownOrLink(subItem, `subdropdown-${subIdx}`, true, true)
                    : renderLink(subItem, `sublink-${subIdx}`, true))}
        </NavDropdown_1.default>);
        }
        // Otherwise, it's a direct link
        return renderLink(item, `link-${idx}`);
    };
    const renderMenus = () => {
        return filteredMenu.map((item, idx) => renderDropdownOrLink(item, idx));
    };
    if (!isMounted) {
        return null; // Prevent rendering on the server side
    }
    return (<div className={`grow flex-wrap items-stretch overflow-y-auto scrollbar-hidden dark:bg-muted-900 lg:flex lg:overflow-visible lg:bg-transparent dark:lg:bg-transparent ${isSidebarOpenedMobile ? "block max-h-[80vh]" : "hidden lg:block"}`}>
      <div className={`lg:!flex lg:flex-1 lg:basis-full lg:items-stretch lg:justify-center px-4 pb-2 lg:pb-0 lg:space-x-1  ${isSidebarOpenedMobile ? "block" : "hidden"}`}>
        {renderMenus()}
      </div>
    </div>);
};
exports.Menu = MenuBase;
