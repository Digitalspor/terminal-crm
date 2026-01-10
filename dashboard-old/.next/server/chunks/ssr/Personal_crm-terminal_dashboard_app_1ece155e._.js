module.exports = [
"[project]/Personal/crm-terminal/dashboard/app/theme.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "applyTheme",
    ()=>applyTheme,
    "customTheme",
    ()=>customTheme
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$create$2d$theme$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/helpers/create-theme.js [app-rsc] (ecmascript)");
;
const customTheme = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$create$2d$theme$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createTheme"])({
    modal: {
        content: {
            inner: "dark:bg-gray-800"
        },
        header: {
            base: "items-center dark:border-gray-700",
            title: "font-semibold",
            close: {
                base: "hover:bg-gray-200 dark:hover:bg-gray-700"
            }
        },
        footer: {
            base: "dark:border-gray-700"
        }
    },
    progress: {
        color: {
            blue: "bg-primary-600",
            dark: "bg-gray-900 dark:bg-white"
        },
        size: {
            md: "h-2"
        }
    },
    sidebar: {
        root: {
            inner: "bg-white"
        },
        collapse: {
            button: "text-gray-900 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
        },
        item: {
            base: "text-gray-900 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700",
            label: "text-primary-800 bg-primary-100 ml-3 inline-flex h-5 w-5 items-center justify-center rounded-full p-1 text-sm font-medium"
        }
    },
    card: {
        root: {
            base: "border-none shadow",
            children: "p-4 sm:p-6 xl:p-8"
        }
    }
});
const applyTheme = {
    card: {
        root: {
            children: "replace"
        }
    }
};
}),
"[project]/Personal/crm-terminal/dashboard/app/layout.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>RootLayout,
    "metadata",
    ()=>metadata
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$theme$2f$mode$2d$script$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/theme/mode-script.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$app$2f$theme$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/app/theme.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/index.js [app-rsc] (ecmascript)");
;
;
;
;
;
const metadata = {
    title: "CRM Dashboard",
    description: "CRM Dashboard for managing customers and invoices"
};
function RootLayout({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("html", {
        lang: "no",
        suppressHydrationWarning: true,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("head", {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$theme$2f$mode$2d$script$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ThemeModeScript"], {}, void 0, false, {
                    fileName: "[project]/Personal/crm-terminal/dashboard/app/layout.tsx",
                    lineNumber: 19,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/Personal/crm-terminal/dashboard/app/layout.tsx",
                lineNumber: 18,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("body", {
                className: "bg-gray-50 dark:bg-gray-900",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Flowbite"], {
                    theme: {
                        theme: __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$app$2f$theme$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["customTheme"],
                        applyTheme: __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$app$2f$theme$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["applyTheme"]
                    },
                    children: children
                }, void 0, false, {
                    fileName: "[project]/Personal/crm-terminal/dashboard/app/layout.tsx",
                    lineNumber: 22,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/Personal/crm-terminal/dashboard/app/layout.tsx",
                lineNumber: 21,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Personal/crm-terminal/dashboard/app/layout.tsx",
        lineNumber: 17,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=Personal_crm-terminal_dashboard_app_1ece155e._.js.map