"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.colorInputVariants = exports.inputVariants = void 0;
const class_variance_authority_1 = require("class-variance-authority");
exports.inputVariants = (0, class_variance_authority_1.cva)("relative w-full leading-tight font-sans disabled:opacity-50 disabled:cursor-not-allowed outline-hidden transition-all duration-300", {
    variants: {
        color: {
            default: "border border-muted-200 bg-white dark:border-muted-700 dark:bg-muted-800 text-muted-600 dark:text-muted-300 dark:placeholder:text-muted-600 dark:hover:enabled:border-muted-600 placeholder:text-muted-300 hover:enabled:border-muted-300 focus-visible:border-muted-300 focus-visible:outline-hidden focus-visible:shadow-lg focus-visible:shadow-muted-300/30 dark:focus-visible:shadow-muted-800/20",
            contrast: "border border-muted-200 bg-white dark:border-muted-800 dark:bg-muted-900 text-muted-600 dark:text-muted-300 dark:placeholder:text-muted-700 dark:hover:enabled:border-muted-700 placeholder:text-muted-300 hover:enabled:border-muted-300 focus-visible:border-muted-300 focus-visible:outline-hidden focus-visible:shadow-lg focus-visible:shadow-muted-300/30 dark:focus-visible:shadow-muted-900/20",
            muted: "border border-muted-200 bg-muted-100 dark:border-muted-700 dark:bg-muted-800 text-muted-600 dark:text-muted-300 dark:placeholder:text-muted-600 dark:hover:enabled:border-muted-600 placeholder:text-muted-400/60 hover:enabled:border-muted-300 focus-visible:border-muted-300 focus-visible:outline-hidden focus-visible:shadow-lg focus-visible:shadow-muted-300/30 dark:focus-visible:shadow-muted-800/20",
            mutedContrast: "border border-muted-200 bg-muted-100 dark:border-muted-800 dark:bg-muted-900 text-muted-600 dark:text-muted-300 dark:placeholder:text-muted-700 dark:hover:enabled:border-muted-700 placeholder:text-muted-400/60 hover:enabled:border-muted-300 focus-visible:border-muted-300 focus-visible:outline-hidden focus-visible:shadow-lg focus-visible:shadow-muted-300/30 dark:focus-visible:shadow-muted-900/20",
        },
        shape: {
            straight: "",
            "rounded-xs": "rounded-xs",
            "rounded-sm": "rounded-sm",
            rounded: "rounded-md",
            smooth: "rounded-lg",
            curved: "rounded-xl",
            full: "rounded-full",
        },
        size: {
            xs: "h-6 py-1 text-xs",
            sm: "h-8 py-2 text-xs",
            md: "h-10 py-2 text-sm",
            lg: "h-12 py-2 text-base",
        },
    },
    defaultVariants: {
        shape: "smooth",
        color: "default",
        size: "md",
    },
});
exports.colorInputVariants = (0, class_variance_authority_1.cva)("relative w-full leading-tight font-sans disabled:opacity-50 disabled:cursor-not-allowed outline-hidden transition-all duration-300", {
    variants: {
        color: {
            default: "border border-muted-200 bg-white dark:border-muted-700 dark:bg-muted-800 text-muted-600 dark:text-muted-300 dark:placeholder:text-muted-600 dark:hover:enabled:border-muted-600 placeholder:text-muted-300 hover:enabled:border-muted-300 focus-visible:border-muted-300 focus-visible:outline-hidden focus-visible:shadow-lg focus-visible:shadow-muted-300/30 dark:focus-visible:shadow-muted-800/20",
            contrast: "border border-muted-200 bg-white dark:border-muted-800 dark:bg-muted-900 text-muted-600 dark:text-muted-300 dark:placeholder:text-muted-700 dark:hover:enabled:border-muted-700 placeholder:text-muted-300 hover:enabled:border-muted-300 focus-visible:border-muted-300 focus-visible:outline-hidden focus-visible:shadow-lg focus-visible:shadow-muted-300/30 dark:focus-visible:shadow-muted-900/20",
            muted: "border border-muted-200 bg-muted-100 dark:border-muted-700 dark:bg-muted-800 text-muted-600 dark:text-muted-300 dark:placeholder:text-muted-600 dark:hover:enabled:border-muted-600 placeholder:text-muted-400/60 hover:enabled:border-muted-300 focus-visible:border-muted-300 focus-visible:outline-hidden focus-visible:shadow-lg focus-visible:shadow-muted-300/30 dark:focus-visible:shadow-muted-800/20",
            mutedContrast: "border border-muted-200 bg-muted-100 dark:border-muted-800 dark:bg-muted-900 text-muted-600 dark:text-muted-300 dark:placeholder:text-muted-700 dark:hover:enabled:border-muted-700 placeholder:text-muted-400/60 hover:enabled:border-muted-300 focus-visible:border-muted-300 focus-visible:outline-hidden focus-visible:shadow-lg focus-visible:shadow-muted-300/30 dark:focus-visible:shadow-muted-900/20",
        },
        shape: {
            straight: "",
            "rounded-xs": "rounded-xs",
            "rounded-sm": "rounded-sm",
            rounded: "rounded-md",
            smooth: "rounded-lg",
            curved: "rounded-xl",
            full: "rounded-full",
        },
        size: {
            sm: "h-8 py-1 text-xs",
            md: "h-10 py-1 text-sm",
            lg: "h-12 py-1 text-base",
        },
    },
    defaultVariants: {
        shape: "smooth",
        color: "default",
        size: "md",
    },
});
