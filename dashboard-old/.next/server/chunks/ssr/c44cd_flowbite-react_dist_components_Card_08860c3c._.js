module.exports = [
"[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/components/Card/theme.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cardTheme",
    ()=>cardTheme
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$create$2d$theme$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/helpers/create-theme.js [app-ssr] (ecmascript)");
;
const cardTheme = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$create$2d$theme$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createTheme"])({
    root: {
        base: "flex rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800",
        children: "flex h-full flex-col justify-center gap-4 p-6",
        horizontal: {
            off: "flex-col",
            on: "flex-col md:max-w-xl md:flex-row"
        },
        href: "hover:bg-gray-100 dark:hover:bg-gray-700"
    },
    img: {
        base: "",
        horizontal: {
            off: "rounded-t-lg",
            on: "h-96 w-full rounded-t-lg object-cover md:h-auto md:w-48 md:rounded-none md:rounded-l-lg"
        }
    }
});
;
 //# sourceMappingURL=theme.js.map
}),
"[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/components/Card/Card.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Card",
    ()=>Card
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$get$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/helpers/get.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$resolve$2d$props$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/helpers/resolve-props.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$resolve$2d$theme$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/helpers/resolve-theme.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$tailwind$2d$merge$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/helpers/tailwind-merge.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$theme$2f$provider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/theme/provider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$components$2f$Card$2f$theme$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/components/Card/theme.js [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
;
const Card = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])((props, ref)=>{
    const provider = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$theme$2f$provider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useThemeProvider"])();
    const theme = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$resolve$2d$theme$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useResolveTheme"])([
        __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$components$2f$Card$2f$theme$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cardTheme"],
        provider.theme?.card,
        props.theme
    ], [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$get$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["get"])(provider.clearTheme, "card"),
        props.clearTheme
    ], [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$get$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["get"])(provider.applyTheme, "card"),
        props.applyTheme
    ]);
    const { children, className, horizontal, href, imgAlt, imgSrc, renderImage, ...restProps } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$resolve$2d$props$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resolveProps"])(props, provider.props?.card);
    const Component = typeof href === "undefined" ? "div" : "a";
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxs"])(Component, {
        ref,
        "data-testid": "flowbite-card",
        href,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$tailwind$2d$merge$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["twMerge"])(theme.root.base, theme.root.horizontal[horizontal ? "on" : "off"], href && theme.root.href, className),
        ...restProps,
        children: [
            renderImage?.(theme, !!horizontal) ?? (imgSrc && /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("img", {
                "data-testid": "flowbite-card-image",
                alt: imgAlt ?? "",
                src: imgSrc,
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$tailwind$2d$merge$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["twMerge"])(theme.img.base, theme.img.horizontal[props.horizontal ? "on" : "off"])
            })),
            /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("div", {
                className: theme.root.children,
                children
            })
        ]
    });
});
Card.displayName = "Card";
;
 //# sourceMappingURL=Card.js.map
}),
];

//# sourceMappingURL=c44cd_flowbite-react_dist_components_Card_08860c3c._.js.map