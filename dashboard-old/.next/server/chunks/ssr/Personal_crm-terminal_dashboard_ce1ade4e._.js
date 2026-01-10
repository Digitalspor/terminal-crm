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
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$theme$2f$provider$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/theme/provider.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$app$2f$theme$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/app/theme.ts [app-rsc] (ecmascript)");
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
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$theme$2f$provider$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ThemeProvider"], {
                    theme: __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$app$2f$theme$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["customTheme"],
                    applyTheme: __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$app$2f$theme$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["applyTheme"],
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
"[project]/Personal/crm-terminal/dashboard/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/Personal/crm-terminal/dashboard/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-rsc] (ecmascript)").vendored['react-rsc'].ReactJsxDevRuntime; //# sourceMappingURL=react-jsx-dev-runtime.js.map
}),
"[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/store/index.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getDark",
    ()=>getDark,
    "getMode",
    ()=>getMode,
    "getPrefix",
    ()=>getPrefix,
    "setStore",
    ()=>setStore
]);
const store = {
    dark: void 0,
    mode: void 0,
    prefix: void 0
};
function setStore(data) {
    if ("dark" in data) {
        store.dark = data.dark;
    }
    if ("mode" in data) {
        if ([
            "light",
            "dark",
            "auto"
        ].includes(data.mode)) {
            store.mode = data.mode;
        } else {
            console.warn(`Invalid mode value: ${data.mode}.
Available values: light, dark, auto`);
        }
    }
    if ("prefix" in data) {
        store.prefix = data.prefix;
    }
}
function getDark() {
    return store.dark;
}
function getMode() {
    return store.mode;
}
function getPrefix() {
    return store.prefix;
}
;
 //# sourceMappingURL=index.js.map
}),
"[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/theme/mode-script.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThemeModeScript",
    ()=>ThemeModeScript,
    "getThemeModeScript",
    ()=>getThemeModeScript,
    "initThemeMode",
    ()=>initThemeMode
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$store$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/store/index.js [app-rsc] (ecmascript)");
;
;
const defaultOptions = {
    defaultMode: "auto",
    localStorageKey: "flowbite-theme-mode",
    prefix: ""
};
function ThemeModeScript({ mode, defaultMode = defaultOptions.defaultMode, localStorageKey = defaultOptions.localStorageKey, ...others }) {
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsx"])("script", {
        ...others,
        "data-flowbite-theme-mode-script": true,
        dangerouslySetInnerHTML: {
            __html: getThemeModeScript({
                mode,
                defaultMode,
                localStorageKey,
                prefix: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$store$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getPrefix"])() ?? ""
            })
        }
    });
}
ThemeModeScript.displayName = "ThemeModeScript";
function getThemeModeScript(props = {}) {
    const { mode, defaultMode = defaultOptions.defaultMode, localStorageKey = defaultOptions.localStorageKey, prefix = defaultOptions.prefix } = props;
    return `
    try {
      const storageMode = window.localStorage.getItem("${localStorageKey}");
      const isStorageModeValid = storageMode === "light" || storageMode === "dark" || storageMode === "auto";
      const resolvedMode = (isStorageModeValid ? storageMode : null) ?? ${mode ? `"${mode}"` : void 0} ?? "${defaultMode}";
      const computedMode =
        resolvedMode === "auto" ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") : resolvedMode;

      if (computedMode === "dark") {
        document.documentElement.classList.add("${prefix}dark");
      } else {
        document.documentElement.classList.remove("${prefix}dark");
      }
      localStorage.setItem("${localStorageKey}", resolvedMode);

      // Add listener for system theme changes
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      mediaQuery.addEventListener("change", (e) => {
        const storageMode = window.localStorage.getItem("${localStorageKey}");
        const isStorageModeValid = storageMode === "light" || storageMode === "dark" || storageMode === "auto";
        const resolvedMode = isStorageModeValid ? storageMode : "${defaultMode}";

        if (resolvedMode === "auto") {
          if (e.matches) {
            document.documentElement.classList.add("${prefix}dark");
          } else {
            document.documentElement.classList.remove("${prefix}dark");
          }
        }
      });

      // Add listener for storage changes
      window.addEventListener("storage", (e) => {
        if (e.key === "${localStorageKey}") {
          const newMode = e.newValue;
          const isStorageModeValid = newMode === "light" || newMode === "dark" || newMode === "auto";
          const resolvedMode = isStorageModeValid ? newMode : "${defaultMode}";

          if (resolvedMode === "dark" || (resolvedMode === "auto" && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
            document.documentElement.classList.add("${prefix}dark");
          } else {
            document.documentElement.classList.remove("${prefix}dark");
          }
        }
      });
    } catch (e) {}
  `;
}
function initThemeMode(props = {}) {
    const { mode, defaultMode = defaultOptions.defaultMode, localStorageKey = defaultOptions.localStorageKey, prefix = defaultOptions.prefix } = props;
    try {
        const storageMode = window.localStorage.getItem(localStorageKey);
        const isStorageModeValid = storageMode === "light" || storageMode === "dark" || storageMode === "auto";
        const resolvedMode = (isStorageModeValid ? storageMode : null) ?? mode ?? defaultMode;
        const computedMode = resolvedMode === "auto" ? window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light" : resolvedMode;
        if (computedMode === "dark") {
            document.documentElement.classList.add(`${prefix}dark`);
        } else {
            document.documentElement.classList.remove(`${prefix}dark`);
        }
        localStorage.setItem(localStorageKey, resolvedMode);
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        mediaQuery.addEventListener("change", (e)=>{
            const storageMode2 = window.localStorage.getItem(localStorageKey);
            const isStorageModeValid2 = storageMode2 === "light" || storageMode2 === "dark" || storageMode2 === "auto";
            const resolvedMode2 = isStorageModeValid2 ? storageMode2 : defaultMode;
            if (resolvedMode2 === "auto") {
                if (e.matches) {
                    document.documentElement.classList.add(`${prefix}dark`);
                } else {
                    document.documentElement.classList.remove(`${prefix}dark`);
                }
            }
        });
        window.addEventListener("storage", (e)=>{
            if (e.key === localStorageKey) {
                const newMode = e.newValue;
                const isStorageModeValid2 = newMode === "light" || newMode === "dark" || newMode === "auto";
                const resolvedMode2 = isStorageModeValid2 ? newMode : defaultMode;
                if (resolvedMode2 === "dark" || resolvedMode2 === "auto" && window.matchMedia("(prefers-color-scheme: dark)").matches) {
                    document.documentElement.classList.add(`${prefix}dark`);
                } else {
                    document.documentElement.classList.remove(`${prefix}dark`);
                }
            }
        });
    } catch (e) {}
}
;
 //# sourceMappingURL=mode-script.js.map
}),
"[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/theme/provider.js [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "ThemeProvider",
    ()=>ThemeProvider,
    "useThemeProvider",
    ()=>useThemeProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const ThemeProvider = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call ThemeProvider() from the server but ThemeProvider is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/theme/provider.js <module evaluation>", "ThemeProvider");
const useThemeProvider = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call useThemeProvider() from the server but useThemeProvider is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/theme/provider.js <module evaluation>", "useThemeProvider");
}),
"[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/theme/provider.js [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "ThemeProvider",
    ()=>ThemeProvider,
    "useThemeProvider",
    ()=>useThemeProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const ThemeProvider = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call ThemeProvider() from the server but ThemeProvider is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/theme/provider.js", "ThemeProvider");
const useThemeProvider = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call useThemeProvider() from the server but useThemeProvider is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/theme/provider.js", "useThemeProvider");
}),
"[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/theme/provider.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$theme$2f$provider$2e$js__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/theme/provider.js [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$theme$2f$provider$2e$js__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/theme/provider.js [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$theme$2f$provider$2e$js__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/helpers/create-theme.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createTheme",
    ()=>createTheme
]);
function createTheme(input) {
    return input;
}
;
 //# sourceMappingURL=create-theme.js.map
}),
];

//# sourceMappingURL=Personal_crm-terminal_dashboard_ce1ade4e._.js.map