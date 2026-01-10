module.exports = [
"[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/helpers/get.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "get",
    ()=>get
]);
function get(input, path) {
    const keys = path.split(".");
    let result = input;
    for (const key of keys){
        if (typeof result === "boolean" || typeof result === "string") {
            return result;
        }
        if (result == null || typeof result !== "object") {
            return void 0;
        }
        result = result[key];
    }
    return result;
}
;
 //# sourceMappingURL=get.js.map
}),
"[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/helpers/without-theming-props.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "withoutThemingProps",
    ()=>withoutThemingProps
]);
function withoutThemingProps(props) {
    const { theme, clearTheme, applyTheme, ...rest } = props;
    return rest;
}
;
 //# sourceMappingURL=without-theming-props.js.map
}),
"[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/helpers/resolve-props.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "resolveProps",
    ()=>resolveProps
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$without$2d$theming$2d$props$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/helpers/without-theming-props.js [app-ssr] (ecmascript)");
;
function resolveProps(props, providerProps) {
    let mergedProps = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$without$2d$theming$2d$props$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["withoutThemingProps"])(props);
    if (providerProps) {
        mergedProps = {
            ...providerProps,
            ...props
        };
    }
    return mergedProps;
}
;
 //# sourceMappingURL=resolve-props.js.map
}),
"[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/helpers/apply-prefix.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "applyPrefix",
    ()=>applyPrefix
]);
const cache = /* @__PURE__ */ new Map();
function applyPrefix(classNames, prefix) {
    if (!classNames.trim().length || !prefix.trim().length) {
        return classNames;
    }
    classNames = classNames.trim();
    prefix = prefix.trim();
    const cacheKey = `${classNames}.${prefix}`;
    const cacheValue = cache.get(cacheKey);
    if (cacheValue) {
        return cacheValue;
    }
    const result = classNames.split(/\s+/).map((className)=>{
        className = className.trim();
        if (!className.length || className.startsWith(prefix)) {
            return className;
        }
        return `${prefix}:${className}`;
    }).join(" ");
    cache.set(cacheKey, result);
    return result;
}
;
 //# sourceMappingURL=apply-prefix.js.map
}),
"[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/helpers/apply-prefix-v3.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "applyPrefixV3",
    ()=>applyPrefixV3
]);
const cache = /* @__PURE__ */ new Map();
function applyPrefixV3(classNames, prefix, separator = ":") {
    if (!classNames.trim().length || !prefix.trim().length) {
        return classNames;
    }
    classNames = classNames.trim();
    prefix = prefix.trim();
    separator = separator.trim();
    const cacheKey = `${classNames}.${prefix}.${separator}`;
    const cacheValue = cache.get(cacheKey);
    if (cacheValue) {
        return cacheValue;
    }
    const result = classNames.split(/\s+/).map((className)=>{
        className = className.trim();
        if (!className.length) {
            return className;
        }
        if (className.startsWith("[") && className.endsWith("]")) {
            return className;
        }
        const parts = className.split(separator);
        const baseClass = parts.pop() ?? "";
        let prefixedBaseClass = baseClass;
        let modifiers = "";
        if (prefixedBaseClass[0] === "!") {
            modifiers = "!";
            prefixedBaseClass = prefixedBaseClass.slice(1);
        }
        if (prefixedBaseClass[0] === "-") {
            modifiers += "-";
            prefixedBaseClass = prefixedBaseClass.slice(1);
        }
        if (prefixedBaseClass.startsWith(prefix)) {
            return className;
        }
        prefixedBaseClass = modifiers + prefix + prefixedBaseClass;
        if (!parts.length) {
            return prefixedBaseClass;
        }
        return `${parts.join(separator)}${separator}${prefixedBaseClass}`;
    }).join(" ");
    cache.set(cacheKey, result);
    return result;
}
;
 //# sourceMappingURL=apply-prefix-v3.js.map
}),
"[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/helpers/convert-utilities-to-v4.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "convertUtilitiesToV4",
    ()=>convertUtilitiesToV4
]);
const cache = /* @__PURE__ */ new Map();
function convertUtilitiesToV4(classNames) {
    if (!classNames.trim().length) {
        return classNames;
    }
    const cacheKey = classNames;
    const cacheValue = cache.get(cacheKey);
    if (cacheValue) {
        return cacheValue;
    }
    const parts = classNames.split(/(\s+)/);
    const result = parts.map((part)=>{
        if (/^\s+$/.test(part)) {
            return part;
        }
        const processed = part;
        const modifierMatch = processed.match(/^([^:]+:)?(.+)$/);
        if (modifierMatch) {
            const [, modifier = "", baseClass] = modifierMatch;
            for (const [regex, replacement] of regexMap){
                if (regex.test(baseClass)) {
                    return modifier + baseClass.replace(regex, replacement);
                }
            }
        }
        return processed;
    }).join("");
    cache.set(cacheKey, result);
    return result;
}
const regexMap = [
    [
        /^shadow-sm$/,
        "shadow-xs"
    ],
    [
        /^shadow$/,
        "shadow-sm"
    ],
    [
        /^drop-shadow-sm$/,
        "drop-shadow-xs"
    ],
    [
        /^drop-shadow$/,
        "drop-shadow-sm"
    ],
    [
        /^blur-sm$/,
        "blur-xs"
    ],
    [
        /^blur$/,
        "blur-sm"
    ],
    [
        /^rounded-sm$/,
        "rounded-xs"
    ],
    [
        /^rounded$/,
        "rounded-sm"
    ],
    // TODO: revisit this - it breaks anything focused using tab
    // [/^outline-none$/, "outline-hidden"],
    [
        /^ring$/,
        "ring-3"
    ]
];
;
 //# sourceMappingURL=convert-utilities-to-v4.js.map
}),
"[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/helpers/is-equal.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "isEqual",
    ()=>isEqual
]);
function isEqual(a, b) {
    if (a === b) {
        return true;
    }
    if (a && b && typeof a === "object" && typeof b === "object") {
        if (a.constructor !== b.constructor) {
            return false;
        }
        if (Array.isArray(a)) {
            if (a.length !== b.length) {
                return false;
            }
            return a.every((item, index)=>isEqual(item, b[index]));
        }
        if (a.constructor === RegExp) {
            return a.source === b.source && a.flags === b.flags;
        }
        if (a.valueOf !== Object.prototype.valueOf) {
            return a.valueOf() === b.valueOf();
        }
        if (a.toString !== Object.prototype.toString) {
            return a.toString() === b.toString();
        }
        const aKeys = Object.keys(a);
        if (aKeys.length !== Object.keys(b).length) {
            return false;
        }
        return aKeys.every((key)=>Object.prototype.hasOwnProperty.call(b, key) && isEqual(a[key], b[key]));
    }
    return a !== a && b !== b;
}
;
 //# sourceMappingURL=is-equal.js.map
}),
"[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/helpers/strip-dark.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "stripDark",
    ()=>stripDark
]);
const cache = /* @__PURE__ */ new Map();
function stripDark(classNames) {
    if (classNames === void 0 || classNames === null) {
        return classNames;
    }
    if (!classNames.trim().length) {
        return classNames;
    }
    classNames = classNames.trim();
    const cacheKey = classNames;
    const cacheValue = cache.get(cacheKey);
    if (cacheValue) {
        return cacheValue;
    }
    const result = classNames.split(/\s+/).filter((className)=>!className.includes("dark:")).join(" ");
    cache.set(cacheKey, result);
    return result;
}
;
 //# sourceMappingURL=strip-dark.js.map
}),
"[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/helpers/resolve-theme.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "resolveTheme",
    ()=>resolveTheme,
    "useResolveTheme",
    ()=>useResolveTheme,
    "useStableMemo",
    ()=>useStableMemo
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$deepmerge$2d$ts$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/deepmerge-ts/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$klona$2f$json$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/klona/json/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$store$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/store/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$apply$2d$prefix$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/helpers/apply-prefix.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$apply$2d$prefix$2d$v3$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/helpers/apply-prefix-v3.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$convert$2d$utilities$2d$to$2d$v4$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/helpers/convert-utilities-to-v4.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$deep$2d$merge$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/helpers/deep-merge.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$get$2d$tailwind$2d$version$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/helpers/get-tailwind-version.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$is$2d$equal$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/helpers/is-equal.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$strip$2d$dark$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/helpers/strip-dark.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$tailwind$2d$merge$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/helpers/tailwind-merge.js [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
;
function useResolveTheme(...input) {
    return useStableMemo(()=>resolveTheme(...input), input);
}
function useStableMemo(factory, dependencies) {
    const prevDepsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])();
    const prevResultRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])();
    const hasChanged = !prevDepsRef.current || !(0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$is$2d$equal$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isEqual"])(prevDepsRef.current, dependencies);
    if (hasChanged) {
        prevDepsRef.current = dependencies;
        prevResultRef.current = factory();
    }
    return prevResultRef.current;
}
function resolveTheme([base, ...custom], clearThemeList, applyThemeList) {
    const dark = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$store$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDark"])();
    const prefix = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$store$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getPrefix"])();
    const version = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$get$2d$tailwind$2d$version$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getTailwindVersion"])();
    const _custom = custom?.length ? custom?.filter((value)=>value !== void 0) : void 0;
    const _clearThemeList = clearThemeList?.length ? clearThemeList?.filter((value)=>value !== void 0) : void 0;
    const _applyThemeList = applyThemeList?.length ? applyThemeList?.filter((value)=>value !== void 0) : void 0;
    const baseTheme = _clearThemeList?.length || dark === false || version === 4 || prefix ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$klona$2f$json$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["klona"])(base) : base;
    if (_clearThemeList?.length) {
        const finalClearTheme = cloneWithValue(baseTheme, false);
        let run = false;
        for (const clearTheme of _clearThemeList){
            if (clearTheme) {
                run = true;
            }
            patchClearTheme(finalClearTheme, clearTheme);
        }
        if (run) {
            runClearTheme(baseTheme, finalClearTheme);
        }
    }
    if (dark === false || version === 4 || prefix) {
        stringIterator(baseTheme, (value)=>{
            if (dark === false) {
                value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$strip$2d$dark$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["stripDark"])(value);
            }
            if (version === 4) {
                value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$convert$2d$utilities$2d$to$2d$v4$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["convertUtilitiesToV4"])(value);
            }
            if (prefix) {
                if (version === 3) {
                    value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$apply$2d$prefix$2d$v3$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["applyPrefixV3"])(value, prefix);
                }
                if (version === 4) {
                    value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$apply$2d$prefix$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["applyPrefix"])(value, prefix);
                }
            }
            return value;
        });
    }
    let theme = baseTheme;
    if (_custom?.length) {
        theme = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$deep$2d$merge$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deepMergeStrings"])(__TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$tailwind$2d$merge$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["twMerge"])(baseTheme, ..._custom);
    }
    if (_applyThemeList?.length && _custom?.length) {
        const finalApplyTheme = cloneWithValue(baseTheme, "merge");
        let run = false;
        for (const applyTheme of _applyThemeList){
            if (applyTheme !== "merge") {
                run = true;
            }
            patchApplyTheme(finalApplyTheme, applyTheme);
        }
        if (run) {
            runApplyTheme(theme, (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$deepmerge$2d$ts$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deepmerge"])(baseTheme, ...custom), finalApplyTheme);
        }
    }
    return theme;
}
function patchClearTheme(base, clearTheme) {
    function iterate(base2, clearTheme2) {
        if (typeof clearTheme2 === "boolean") {
            if (typeof base2 === "object" && base2 !== null) {
                for(const key in base2){
                    base2[key] = iterate(base2[key], clearTheme2);
                }
            } else {
                return clearTheme2;
            }
        }
        if (typeof clearTheme2 === "object" && clearTheme2 !== null) {
            for(const key in clearTheme2){
                base2[key] = iterate(base2[key], clearTheme2[key]);
            }
        }
        return base2;
    }
    iterate(base, clearTheme);
}
function patchApplyTheme(base, applyTheme) {
    function iterate(base2, applyTheme2) {
        if (typeof applyTheme2 === "string") {
            if (typeof base2 === "object" && base2 !== null) {
                for(const key in base2){
                    base2[key] = iterate(base2[key], applyTheme2);
                }
            } else {
                return applyTheme2;
            }
        }
        if (typeof applyTheme2 === "object" && applyTheme2 !== null) {
            for(const key in applyTheme2){
                base2[key] = iterate(base2[key], applyTheme2[key]);
            }
        }
        return base2;
    }
    iterate(base, applyTheme);
}
function runClearTheme(base, clearTheme) {
    function iterate(base2, clearTheme2) {
        if (clearTheme2 === true) {
            if (typeof base2 === "object" && base2 !== null) {
                for(const key in base2){
                    base2[key] = iterate(base2[key], clearTheme2);
                }
            } else {
                return "";
            }
        }
        if (typeof clearTheme2 === "object" && clearTheme2 !== null) {
            for(const key in clearTheme2){
                base2[key] = iterate(base2[key], clearTheme2[key]);
            }
        }
        return base2;
    }
    iterate(base, clearTheme);
}
function runApplyTheme(base, target, applyTheme) {
    function iterate(base2, target2, applyTheme2) {
        if (applyTheme2 === "replace") {
            if (typeof base2 === "object" && base2 !== null) {
                for(const key in base2){
                    base2[key] = iterate(base2[key], target2[key], applyTheme2);
                }
            } else {
                return target2;
            }
        }
        if (typeof applyTheme2 === "object" && applyTheme2 !== null) {
            for(const key in applyTheme2){
                base2[key] = iterate(base2[key], target2[key], applyTheme2[key]);
            }
        }
        return base2;
    }
    iterate(base, target, applyTheme);
}
function stringIterator(input, callback) {
    function iterate(input2) {
        if (typeof input2 === "string") {
            return callback(input2);
        } else if (Array.isArray(input2)) {
            for(let i = 0; i < input2.length; i++){
                input2[i] = iterate(input2[i]);
            }
        } else if (typeof input2 === "object" && input2 !== null) {
            for(const key in input2){
                input2[key] = iterate(input2[key]);
            }
        }
        return input2;
    }
    iterate(input);
}
function cloneWithValue(input, value) {
    if (input === null || typeof input !== "object") {
        return value;
    }
    const clone = {};
    for(const key in input){
        clone[key] = cloneWithValue(input[key], value);
    }
    return clone;
}
;
 //# sourceMappingURL=resolve-theme.js.map
}),
"[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/helpers/is-client.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "isClient",
    ()=>isClient
]);
function isClient() {
    return "undefined" !== "undefined";
}
;
 //# sourceMappingURL=is-client.js.map
}),
"[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/hooks/use-watch-localstorage-value.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useWatchLocalStorageValue",
    ()=>useWatchLocalStorageValue
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
function useWatchLocalStorageValue({ key: watchKey, onChange }) {
    function handleStorageChange({ key, newValue }) {
        if (key === watchKey) onChange(newValue);
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        window.addEventListener("storage", handleStorageChange);
        return ()=>window.removeEventListener("storage", handleStorageChange);
    }, []);
}
;
 //# sourceMappingURL=use-watch-localstorage-value.js.map
}),
"[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/hooks/use-theme-mode.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useThemeMode",
    ()=>useThemeMode
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$is$2d$client$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/helpers/is-client.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$hooks$2f$use$2d$watch$2d$localstorage$2d$value$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/hooks/use-watch-localstorage-value.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$store$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/store/index.js [app-ssr] (ecmascript)");
'use client';
;
;
;
;
const DEFAULT_MODE = "auto";
const LS_THEME_MODE = "flowbite-theme-mode";
const SYNC_THEME_MODE = "flowbite-theme-mode-sync";
function useThemeMode() {
    const [mode, setMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(getInitialMode((0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$store$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getMode"])()));
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$hooks$2f$use$2d$watch$2d$localstorage$2d$value$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useWatchLocalStorageValue"])({
        key: LS_THEME_MODE,
        onChange (newMode) {
            setMode(validateMode(newMode ?? DEFAULT_MODE));
        }
    });
    useSyncMode((mode2)=>setMode(mode2));
    function handleSetMode(mode2) {
        setMode(mode2);
        setModeInLS(mode2);
        setModeInDOM(mode2);
        document.dispatchEvent(new CustomEvent(SYNC_THEME_MODE, {
            detail: mode2
        }));
    }
    function toggleMode() {
        let newMode = mode;
        if (newMode === "auto") {
            newMode = computeModeValue(newMode);
        }
        newMode = newMode === "dark" ? "light" : "dark";
        handleSetMode(newMode);
    }
    function clearMode() {
        const newMode = mode ?? DEFAULT_MODE;
        handleSetMode(newMode);
    }
    return {
        mode,
        computedMode: computeModeValue(mode),
        setMode: handleSetMode,
        toggleMode,
        clearMode
    };
}
function useSyncMode(onChange) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        function handleSync(e) {
            const mode = e.detail;
            onChange(mode);
        }
        document.addEventListener(SYNC_THEME_MODE, handleSync);
        return ()=>document.removeEventListener(SYNC_THEME_MODE, handleSync);
    }, []);
}
function setModeInLS(mode) {
    localStorage.setItem(LS_THEME_MODE, mode);
}
function setModeInDOM(mode) {
    const prefix = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$store$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getPrefix"])() ?? "";
    const computedMode = computeModeValue(mode);
    if (computedMode === "dark") {
        document.documentElement.classList.add(`${prefix}dark`);
    } else {
        document.documentElement.classList.remove(`${prefix}dark`);
    }
}
function getInitialMode(defaultMode) {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$is$2d$client$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isClient"])()) {
        return DEFAULT_MODE;
    }
    const storageMode = localStorage.getItem(LS_THEME_MODE);
    return validateMode(storageMode ?? defaultMode ?? DEFAULT_MODE);
}
function computeModeValue(mode) {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$is$2d$client$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isClient"])()) {
        return DEFAULT_MODE;
    }
    return mode === "auto" ? prefersColorScheme() : mode;
}
function prefersColorScheme() {
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
function validateMode(mode) {
    if ([
        "light",
        "dark",
        "auto"
    ].includes(mode)) {
        return mode;
    }
    return DEFAULT_MODE;
}
;
 //# sourceMappingURL=use-theme-mode.js.map
}),
"[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/icons/moon-icon.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MoonIcon",
    ()=>MoonIcon
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
;
;
const MoonIcon = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])((props, ref)=>/* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        width: "1em",
        height: "1em",
        fill: "currentColor",
        stroke: "currentColor",
        strokeWidth: 0,
        viewBox: "0 0 20 20",
        ref,
        ...props,
        children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("path", {
            stroke: "none",
            d: "M17.293 13.293A8 8 0 0 1 6.707 2.707a8.001 8.001 0 1 0 10.586 10.586z"
        })
    }));
MoonIcon.displayName = "MoonIcon";
;
 //# sourceMappingURL=moon-icon.js.map
}),
"[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/icons/sun-icon.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SunIcon",
    ()=>SunIcon
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
;
;
const SunIcon = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])((props, ref)=>/* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        width: "1em",
        height: "1em",
        fill: "currentColor",
        stroke: "currentColor",
        strokeWidth: 0,
        viewBox: "0 0 20 20",
        ref,
        ...props,
        children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("path", {
            fillRule: "evenodd",
            stroke: "none",
            d: "M10 2a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1zm4 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0zm-.464 4.95.707.707a1 1 0 0 0 1.414-1.414l-.707-.707a1 1 0 0 0-1.414 1.414zm2.12-10.607a1 1 0 0 1 0 1.414l-.706.707a1 1 0 1 1-1.414-1.414l.707-.707a1 1 0 0 1 1.414 0zM17 11a1 1 0 1 0 0-2h-1a1 1 0 1 0 0 2h1zm-7 4a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1zM5.05 6.464A1 1 0 1 0 6.465 5.05l-.708-.707a1 1 0 0 0-1.414 1.414l.707.707zm1.414 8.486-.707.707a1 1 0 0 1-1.414-1.414l.707-.707a1 1 0 0 1 1.414 1.414zM4 11a1 1 0 1 0 0-2H3a1 1 0 0 0 0 2h1z",
            clipRule: "evenodd"
        })
    }));
SunIcon.displayName = "SunIcon";
;
 //# sourceMappingURL=sun-icon.js.map
}),
"[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/helpers/create-theme.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/components/DarkThemeToggle/theme.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "darkThemeToggleTheme",
    ()=>darkThemeToggleTheme
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$create$2d$theme$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/helpers/create-theme.js [app-ssr] (ecmascript)");
;
const darkThemeToggleTheme = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$create$2d$theme$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createTheme"])({
    root: {
        base: "rounded-lg p-2.5 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-700",
        icon: {
            base: "h-5 w-5",
            dark: "hidden dark:block",
            light: "dark:hidden"
        }
    }
});
;
 //# sourceMappingURL=theme.js.map
}),
"[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/components/DarkThemeToggle/DarkThemeToggle.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DarkThemeToggle",
    ()=>DarkThemeToggle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$get$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/helpers/get.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$resolve$2d$props$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/helpers/resolve-props.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$resolve$2d$theme$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/helpers/resolve-theme.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$tailwind$2d$merge$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/helpers/tailwind-merge.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$hooks$2f$use$2d$theme$2d$mode$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/hooks/use-theme-mode.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$icons$2f$moon$2d$icon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/icons/moon-icon.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$icons$2f$sun$2d$icon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/icons/sun-icon.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$theme$2f$provider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/theme/provider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$components$2f$DarkThemeToggle$2f$theme$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/components/DarkThemeToggle/theme.js [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
;
;
;
;
const DarkThemeToggle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])((props, ref)=>{
    const provider = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$theme$2f$provider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useThemeProvider"])();
    const theme = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$resolve$2d$theme$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useResolveTheme"])([
        __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$components$2f$DarkThemeToggle$2f$theme$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["darkThemeToggleTheme"],
        provider.theme?.darkThemeToggle,
        props.theme
    ], [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$get$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["get"])(provider.clearTheme, "darkThemeToggle"),
        props.clearTheme
    ], [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$get$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["get"])(provider.applyTheme, "darkThemeToggle"),
        props.applyTheme
    ]);
    const { className, iconDark: IconDark = __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$icons$2f$sun$2d$icon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SunIcon"], iconLight: IconLight = __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$icons$2f$moon$2d$icon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MoonIcon"], ...restProps } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$resolve$2d$props$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resolveProps"])(props, provider.props?.darkThemeToggle);
    const { toggleMode } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$hooks$2f$use$2d$theme$2d$mode$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useThemeMode"])();
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxs"])("button", {
        ref,
        type: "button",
        "aria-label": "Toggle dark mode",
        "data-testid": "dark-theme-toggle",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$tailwind$2d$merge$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["twMerge"])(theme.root.base, className),
        onClick: toggleMode,
        ...restProps,
        children: [
            /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(IconDark, {
                "aria-label": "Currently dark mode",
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$tailwind$2d$merge$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["twMerge"])(theme.root.icon.base, theme.root.icon.dark)
            }),
            /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(IconLight, {
                "aria-label": "Currently light mode",
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$tailwind$2d$merge$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["twMerge"])(theme.root.icon.base, theme.root.icon.light)
            })
        ]
    });
});
DarkThemeToggle.displayName = "DarkThemeToggle";
;
 //# sourceMappingURL=DarkThemeToggle.js.map
}),
"[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/components/Navbar/NavbarContext.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NavbarContext",
    ()=>NavbarContext,
    "useNavbarContext",
    ()=>useNavbarContext
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
const NavbarContext = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(void 0);
function useNavbarContext() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(NavbarContext);
    if (!context) {
        throw new Error("useNavBarContext should be used within the NavbarContext provider!");
    }
    return context;
}
;
 //# sourceMappingURL=NavbarContext.js.map
}),
"[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/components/Navbar/theme.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "navbarTheme",
    ()=>navbarTheme
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$create$2d$theme$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/helpers/create-theme.js [app-ssr] (ecmascript)");
;
const navbarTheme = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$create$2d$theme$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createTheme"])({
    root: {
        base: "bg-white px-2 py-2.5 sm:px-4 dark:border-gray-700 dark:bg-gray-800",
        rounded: {
            on: "rounded",
            off: ""
        },
        bordered: {
            on: "border",
            off: ""
        },
        inner: {
            base: "mx-auto flex flex-wrap items-center justify-between",
            fluid: {
                on: "",
                off: "container"
            }
        }
    },
    brand: {
        base: "flex items-center"
    },
    collapse: {
        base: "w-full md:block md:w-auto",
        list: "mt-4 flex flex-col md:mt-0 md:flex-row md:space-x-8 md:text-sm md:font-medium",
        hidden: {
            on: "hidden",
            off: ""
        }
    },
    link: {
        base: "block py-2 pl-3 pr-4 md:p-0",
        active: {
            on: "bg-primary-700 text-white md:bg-transparent md:text-primary-700 dark:text-white",
            off: "border-b border-gray-100 text-gray-700 hover:bg-gray-50 md:border-0 md:hover:bg-transparent md:hover:text-primary-700 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent md:dark:hover:text-white"
        },
        disabled: {
            on: "text-gray-400 hover:cursor-not-allowed dark:text-gray-600",
            off: ""
        }
    },
    toggle: {
        base: "inline-flex items-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 md:hidden dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600",
        icon: "h-6 w-6 shrink-0",
        title: "sr-only"
    }
});
;
 //# sourceMappingURL=theme.js.map
}),
"[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/components/Navbar/Navbar.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Navbar",
    ()=>Navbar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$get$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/helpers/get.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$resolve$2d$props$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/helpers/resolve-props.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$resolve$2d$theme$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/helpers/resolve-theme.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$tailwind$2d$merge$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/helpers/tailwind-merge.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$theme$2f$provider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/theme/provider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$components$2f$Navbar$2f$NavbarContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/components/Navbar/NavbarContext.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$components$2f$Navbar$2f$theme$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/components/Navbar/theme.js [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
;
;
const Navbar = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])((props, ref)=>{
    const provider = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$theme$2f$provider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useThemeProvider"])();
    const theme = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$resolve$2d$theme$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useResolveTheme"])([
        __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$components$2f$Navbar$2f$theme$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["navbarTheme"],
        provider.theme?.navbar,
        props.theme
    ], [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$get$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["get"])(provider.clearTheme, "navbar"),
        props.clearTheme
    ], [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$get$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["get"])(provider.applyTheme, "navbar"),
        props.applyTheme
    ]);
    const { border, children, className, fluid = false, menuOpen, rounded, ...restProps } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$resolve$2d$props$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resolveProps"])(props, provider.props?.navbar);
    const [isOpen, setIsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(menuOpen);
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$components$2f$Navbar$2f$NavbarContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NavbarContext"].Provider, {
        value: {
            theme: props.theme,
            clearTheme: props.clearTheme,
            applyTheme: props.applyTheme,
            isOpen,
            setIsOpen
        },
        children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("nav", {
            ref,
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$tailwind$2d$merge$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["twMerge"])(theme.root.base, theme.root.bordered[border ? "on" : "off"], theme.root.rounded[rounded ? "on" : "off"], className),
            ...restProps,
            children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("div", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$tailwind$2d$merge$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["twMerge"])(theme.root.inner.base, theme.root.inner.fluid[fluid ? "on" : "off"]),
                children
            })
        })
    });
});
Navbar.displayName = "Navbar";
;
 //# sourceMappingURL=Navbar.js.map
}),
"[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/components/Navbar/NavbarBrand.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NavbarBrand",
    ()=>NavbarBrand
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$get$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/helpers/get.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$resolve$2d$props$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/helpers/resolve-props.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$resolve$2d$theme$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/helpers/resolve-theme.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$tailwind$2d$merge$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/helpers/tailwind-merge.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$theme$2f$provider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/theme/provider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$components$2f$Navbar$2f$NavbarContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/components/Navbar/NavbarContext.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$components$2f$Navbar$2f$theme$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/components/Navbar/theme.js [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
;
;
const NavbarBrand = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])((props, ref)=>{
    const { theme: rootTheme, clearTheme: rootClearTheme, applyTheme: rootApplyTheme } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$components$2f$Navbar$2f$NavbarContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useNavbarContext"])();
    const provider = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$theme$2f$provider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useThemeProvider"])();
    const theme = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$resolve$2d$theme$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useResolveTheme"])([
        __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$components$2f$Navbar$2f$theme$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["navbarTheme"].brand,
        provider.theme?.navbar?.brand,
        rootTheme?.brand,
        props.theme
    ], [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$get$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["get"])(provider.clearTheme, "navbar.brand"),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$get$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["get"])(rootClearTheme, "brand"),
        props.clearTheme
    ], [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$get$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["get"])(provider.applyTheme, "navbar.brand"),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$get$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["get"])(rootApplyTheme, "brand"),
        props.applyTheme
    ]);
    const { as: Component = "a", className, ...restProps } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$resolve$2d$props$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resolveProps"])(props, provider.props?.navbarBrand);
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(Component, {
        ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$tailwind$2d$merge$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["twMerge"])(theme.base, className),
        ...restProps
    });
});
NavbarBrand.displayName = "NavbarBrand";
;
 //# sourceMappingURL=NavbarBrand.js.map
}),
"[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/components/Floating/helpers.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getArrowPlacement",
    ()=>getArrowPlacement,
    "getMiddleware",
    ()=>getMiddleware,
    "getPlacement",
    ()=>getPlacement
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f40$floating$2d$ui$2f$react$2d$dom$2f$dist$2f$floating$2d$ui$2e$react$2d$dom$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/@floating-ui/react-dom/dist/floating-ui.react-dom.mjs [app-ssr] (ecmascript) <locals>");
;
const getMiddleware = ({ arrowRef, placement })=>{
    const middleware = [];
    middleware.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f40$floating$2d$ui$2f$react$2d$dom$2f$dist$2f$floating$2d$ui$2e$react$2d$dom$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["offset"])(8));
    middleware.push(placement === "auto" ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f40$floating$2d$ui$2f$react$2d$dom$2f$dist$2f$floating$2d$ui$2e$react$2d$dom$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["autoPlacement"])() : (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f40$floating$2d$ui$2f$react$2d$dom$2f$dist$2f$floating$2d$ui$2e$react$2d$dom$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["flip"])());
    middleware.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f40$floating$2d$ui$2f$react$2d$dom$2f$dist$2f$floating$2d$ui$2e$react$2d$dom$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["shift"])({
        padding: 8
    }));
    if (arrowRef?.current) {
        middleware.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f40$floating$2d$ui$2f$react$2d$dom$2f$dist$2f$floating$2d$ui$2e$react$2d$dom$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["arrow"])({
            element: arrowRef.current
        }));
    }
    return middleware;
};
const getPlacement = ({ placement })=>{
    return placement === "auto" ? void 0 : placement;
};
const getArrowPlacement = ({ placement })=>{
    return ({
        top: "bottom",
        right: "left",
        bottom: "top",
        left: "right"
    })[placement.split("-")[0]];
};
;
 //# sourceMappingURL=helpers.js.map
}),
"[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/hooks/use-floating.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useBaseFLoating",
    ()=>useBaseFLoating,
    "useFloatingInteractions",
    ()=>useFloatingInteractions
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f40$floating$2d$ui$2f$react$2f$dist$2f$floating$2d$ui$2e$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/@floating-ui/react/dist/floating-ui.react.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f40$floating$2d$ui$2f$dom$2f$dist$2f$floating$2d$ui$2e$dom$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/@floating-ui/dom/dist/floating-ui.dom.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$components$2f$Floating$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/components/Floating/helpers.js [app-ssr] (ecmascript)");
;
;
const useBaseFLoating = ({ open, arrowRef, placement = "top", setOpen })=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f40$floating$2d$ui$2f$react$2f$dist$2f$floating$2d$ui$2e$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useFloating"])({
        placement: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$components$2f$Floating$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getPlacement"])({
            placement
        }),
        open,
        onOpenChange: setOpen,
        whileElementsMounted: __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f40$floating$2d$ui$2f$dom$2f$dist$2f$floating$2d$ui$2e$dom$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["autoUpdate"],
        middleware: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$components$2f$Floating$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getMiddleware"])({
            placement,
            arrowRef
        })
    });
};
const useFloatingInteractions = ({ context, trigger, role = "tooltip", interactions = [] })=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f40$floating$2d$ui$2f$react$2f$dist$2f$floating$2d$ui$2e$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useInteractions"])([
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f40$floating$2d$ui$2f$react$2f$dist$2f$floating$2d$ui$2e$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useClick"])(context, {
            enabled: trigger === "click"
        }),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f40$floating$2d$ui$2f$react$2f$dist$2f$floating$2d$ui$2e$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useHover"])(context, {
            enabled: trigger === "hover",
            handleClose: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f40$floating$2d$ui$2f$react$2f$dist$2f$floating$2d$ui$2e$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["safePolygon"])()
        }),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f40$floating$2d$ui$2f$react$2f$dist$2f$floating$2d$ui$2e$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useDismiss"])(context),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f40$floating$2d$ui$2f$react$2f$dist$2f$floating$2d$ui$2e$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useRole"])(context, {
            role
        }),
        ...interactions
    ]);
};
;
 //# sourceMappingURL=use-floating.js.map
}),
"[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/components/Floating/Floating.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Floating",
    ()=>Floating
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f40$floating$2d$ui$2f$react$2f$dist$2f$floating$2d$ui$2e$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/@floating-ui/react/dist/floating-ui.react.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f40$floating$2d$ui$2f$dom$2f$dist$2f$floating$2d$ui$2e$dom$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/@floating-ui/dom/dist/floating-ui.dom.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$tailwind$2d$merge$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/helpers/tailwind-merge.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$hooks$2f$use$2d$floating$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/hooks/use-floating.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$components$2f$Floating$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/components/Floating/helpers.js [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
function Floating({ animation = "duration-300", arrow = true, children, className, content, placement = "top", style = "dark", theme, trigger = "hover", minWidth, ...props }) {
    const arrowRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const floatingProperties = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$hooks$2f$use$2d$floating$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useBaseFLoating"])({
        open,
        placement,
        arrowRef,
        setOpen
    });
    const { context, middlewareData: { arrow: { x: arrowX, y: arrowY } = {} }, refs, strategy, update, x, y } = floatingProperties;
    const focus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f40$floating$2d$ui$2f$react$2f$dist$2f$floating$2d$ui$2e$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useFocus"])(context);
    const { getFloatingProps, getReferenceProps } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$hooks$2f$use$2d$floating$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useFloatingInteractions"])({
        context,
        role: "tooltip",
        trigger,
        interactions: [
            focus
        ]
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (refs.reference.current && refs.floating.current && open) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f40$floating$2d$ui$2f$dom$2f$dist$2f$floating$2d$ui$2e$dom$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["autoUpdate"])(refs.reference.current, refs.floating.current, update);
        }
    }, [
        open,
        refs.floating,
        refs.reference,
        update
    ]);
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxs"])(__TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("div", {
                ref: refs.setReference,
                className: theme.target,
                "data-testid": "flowbite-tooltip-target",
                ...getReferenceProps(),
                children
            }),
            /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxs"])("div", {
                ref: refs.setFloating,
                "data-testid": "flowbite-tooltip",
                ...getFloatingProps({
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$tailwind$2d$merge$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["twMerge"])(theme.base, animation && `${theme.animation} ${animation}`, !open && theme.hidden, theme.style[style], className),
                    style: {
                        position: strategy,
                        top: y ?? " ",
                        left: x ?? " ",
                        minWidth
                    },
                    ...props
                }),
                children: [
                    /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("div", {
                        className: theme.content,
                        children: content
                    }),
                    arrow && /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("div", {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$tailwind$2d$merge$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["twMerge"])(theme.arrow.base, style === "dark" && theme.arrow.style.dark, style === "light" && theme.arrow.style.light, style === "auto" && theme.arrow.style.auto),
                        "data-testid": "flowbite-tooltip-arrow",
                        ref: arrowRef,
                        style: {
                            top: arrowY ?? " ",
                            left: arrowX ?? " ",
                            right: " ",
                            bottom: " ",
                            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$components$2f$Floating$2f$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getArrowPlacement"])({
                                placement: floatingProperties.placement
                            })]: theme.arrow.placement
                        },
                        children: "\xA0"
                    })
                ]
            })
        ]
    });
}
Floating.displayName = "Floating";
;
 //# sourceMappingURL=Floating.js.map
}),
"[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/components/Tooltip/theme.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "tooltipTheme",
    ()=>tooltipTheme
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$create$2d$theme$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/helpers/create-theme.js [app-ssr] (ecmascript)");
;
const tooltipTheme = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$create$2d$theme$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createTheme"])({
    target: "w-fit",
    animation: "transition-opacity",
    arrow: {
        base: "absolute z-10 h-2 w-2 rotate-45",
        style: {
            dark: "bg-gray-900 dark:bg-gray-700",
            light: "bg-white",
            auto: "bg-white dark:bg-gray-700"
        },
        placement: "-4px"
    },
    base: "absolute z-10 inline-block rounded-lg px-3 py-2 text-sm font-medium shadow-sm",
    hidden: "invisible opacity-0",
    style: {
        dark: "bg-gray-900 text-white dark:bg-gray-700",
        light: "border border-gray-200 bg-white text-gray-900",
        auto: "border border-gray-200 bg-white text-gray-900 dark:border-none dark:bg-gray-700 dark:text-white"
    },
    content: "relative z-20"
});
;
 //# sourceMappingURL=theme.js.map
}),
"[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/components/Tooltip/Tooltip.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Tooltip",
    ()=>Tooltip
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$get$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/helpers/get.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$resolve$2d$props$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/helpers/resolve-props.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$resolve$2d$theme$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/helpers/resolve-theme.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$theme$2f$provider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/theme/provider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$components$2f$Floating$2f$Floating$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/components/Floating/Floating.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$components$2f$Tooltip$2f$theme$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/components/Tooltip/theme.js [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
function Tooltip(props) {
    const provider = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$theme$2f$provider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useThemeProvider"])();
    const theme = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$resolve$2d$theme$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useResolveTheme"])([
        __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$components$2f$Tooltip$2f$theme$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tooltipTheme"],
        provider.theme?.tooltip,
        props.theme
    ], [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$get$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["get"])(provider.clearTheme, "tooltip"),
        props.clearTheme
    ], [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$get$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["get"])(provider.applyTheme, "tooltip"),
        props.applyTheme
    ]);
    const { animation = "duration-300", arrow = true, children, className, content, placement = "top", style = "dark", trigger = "hover", ...restProps } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$resolve$2d$props$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resolveProps"])(props, provider.props?.tooltip);
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$components$2f$Floating$2f$Floating$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Floating"], {
        animation,
        arrow,
        content,
        placement,
        style,
        theme,
        trigger,
        className,
        ...restProps,
        children
    });
}
Tooltip.displayName = "Tooltip";
;
 //# sourceMappingURL=Tooltip.js.map
}),
"[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/components/Sidebar/SidebarContext.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SidebarContext",
    ()=>SidebarContext,
    "useSidebarContext",
    ()=>useSidebarContext
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
const SidebarContext = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(void 0);
function useSidebarContext() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(SidebarContext);
    if (!context) {
        throw new Error("useSidebarContext should be used within the SidebarContext provider!");
    }
    return context;
}
;
 //# sourceMappingURL=SidebarContext.js.map
}),
"[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/components/Sidebar/theme.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "sidebarTheme",
    ()=>sidebarTheme
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$create$2d$theme$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/helpers/create-theme.js [app-ssr] (ecmascript)");
;
const sidebarTheme = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$create$2d$theme$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createTheme"])({
    root: {
        base: "h-full",
        collapsed: {
            on: "w-16",
            off: "w-64"
        },
        inner: "h-full overflow-y-auto overflow-x-hidden rounded bg-gray-50 px-3 py-4 dark:bg-gray-800"
    },
    collapse: {
        button: "group flex w-full items-center rounded-lg p-2 text-base font-normal text-gray-900 transition duration-75 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700",
        icon: {
            base: "h-6 w-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white",
            open: {
                off: "",
                on: "text-gray-900"
            }
        },
        label: {
            base: "ml-3 flex-1 whitespace-nowrap text-left",
            title: "sr-only",
            icon: {
                base: "h-6 w-6 transition delay-0 ease-in-out",
                open: {
                    on: "rotate-180",
                    off: ""
                }
            }
        },
        list: "space-y-2 py-2"
    },
    cta: {
        base: "mt-6 rounded-lg bg-gray-100 p-4 dark:bg-gray-700",
        color: {
            blue: "bg-cyan-50 dark:bg-cyan-900",
            dark: "bg-dark-50 dark:bg-dark-900",
            failure: "bg-red-50 dark:bg-red-900",
            gray: "bg-gray-50 dark:bg-gray-900",
            green: "bg-green-50 dark:bg-green-900",
            light: "bg-light-50 dark:bg-light-900",
            red: "bg-red-50 dark:bg-red-900",
            purple: "bg-purple-50 dark:bg-purple-900",
            success: "bg-green-50 dark:bg-green-900",
            yellow: "bg-yellow-50 dark:bg-yellow-900",
            warning: "bg-yellow-50 dark:bg-yellow-900"
        }
    },
    item: {
        base: "flex items-center justify-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700",
        active: "bg-gray-100 dark:bg-gray-700",
        collapsed: {
            insideCollapse: "group w-full pl-8 transition duration-75",
            noIcon: "font-bold"
        },
        content: {
            base: "flex-1 whitespace-nowrap px-3"
        },
        icon: {
            base: "h-6 w-6 shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white",
            active: "text-gray-700 dark:text-gray-100"
        },
        label: "",
        listItem: ""
    },
    items: {
        base: ""
    },
    itemGroup: {
        base: "mt-4 space-y-2 border-t border-gray-200 pt-4 first:mt-0 first:border-t-0 first:pt-0 dark:border-gray-700"
    },
    logo: {
        base: "mb-5 flex items-center pl-2.5",
        collapsed: {
            on: "hidden",
            off: "self-center whitespace-nowrap text-xl font-semibold dark:text-white"
        },
        img: "mr-3 h-6 sm:h-7"
    }
});
;
 //# sourceMappingURL=theme.js.map
}),
"[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/components/Sidebar/Sidebar.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Sidebar",
    ()=>Sidebar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$get$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/helpers/get.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$resolve$2d$props$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/helpers/resolve-props.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$resolve$2d$theme$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/helpers/resolve-theme.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$tailwind$2d$merge$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/helpers/tailwind-merge.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$theme$2f$provider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/theme/provider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$components$2f$Sidebar$2f$SidebarContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/components/Sidebar/SidebarContext.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$components$2f$Sidebar$2f$theme$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/components/Sidebar/theme.js [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
;
;
const Sidebar = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])((props, ref)=>{
    const provider = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$theme$2f$provider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useThemeProvider"])();
    const theme = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$resolve$2d$theme$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useResolveTheme"])([
        __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$components$2f$Sidebar$2f$theme$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sidebarTheme"],
        provider.theme?.sidebar,
        props.theme
    ], [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$get$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["get"])(provider.clearTheme, "sidebar"),
        props.clearTheme
    ], [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$get$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["get"])(provider.applyTheme, "sidebar"),
        props.applyTheme
    ]);
    const { as: Component = "nav", children, className, collapseBehavior = "collapse", collapsed: isCollapsed = false, ...restProps } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$resolve$2d$props$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resolveProps"])(props, provider.props?.sidebar);
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$components$2f$Sidebar$2f$SidebarContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SidebarContext"].Provider, {
        value: {
            theme: props.theme,
            clearTheme: props.clearTheme,
            applyTheme: props.applyTheme,
            isCollapsed
        },
        children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(Component, {
            ref,
            "aria-label": "Sidebar",
            hidden: isCollapsed && collapseBehavior === "hide",
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$tailwind$2d$merge$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["twMerge"])(theme.root.base, theme.root.collapsed[isCollapsed ? "on" : "off"], className),
            ...restProps,
            children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("div", {
                className: theme.root.inner,
                children
            })
        })
    });
});
Sidebar.displayName = "Sidebar";
;
 //# sourceMappingURL=Sidebar.js.map
}),
"[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/components/Badge/theme.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "badgeTheme",
    ()=>badgeTheme
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$create$2d$theme$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/helpers/create-theme.js [app-ssr] (ecmascript)");
;
const badgeTheme = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$create$2d$theme$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createTheme"])({
    root: {
        base: "flex h-fit items-center gap-1 font-semibold",
        color: {
            info: "bg-cyan-100 text-cyan-800 hover:bg-cyan-200 dark:bg-cyan-200 dark:text-cyan-800 dark:hover:bg-cyan-300",
            gray: "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600",
            failure: "bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-200 dark:text-red-900 dark:hover:bg-red-300",
            success: "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-200 dark:text-green-900 dark:hover:bg-green-300",
            warning: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-200 dark:text-yellow-900 dark:hover:bg-yellow-300",
            indigo: "bg-indigo-100 text-indigo-800 hover:bg-indigo-200 dark:bg-indigo-200 dark:text-indigo-900 dark:hover:bg-indigo-300",
            purple: "bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-200 dark:text-purple-900 dark:hover:bg-purple-300",
            pink: "bg-pink-100 text-pink-800 hover:bg-pink-200 dark:bg-pink-200 dark:text-pink-900 dark:hover:bg-pink-300",
            blue: "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-200 dark:text-blue-900 dark:hover:bg-blue-300",
            cyan: "bg-cyan-100 text-cyan-800 hover:bg-cyan-200 dark:bg-cyan-200 dark:text-cyan-900 dark:hover:bg-cyan-300",
            dark: "bg-gray-600 text-gray-100 hover:bg-gray-500 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-700",
            light: "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-400 dark:text-gray-900 dark:hover:bg-gray-500",
            green: "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-200 dark:text-green-900 dark:hover:bg-green-300",
            lime: "bg-lime-100 text-lime-800 hover:bg-lime-200 dark:bg-lime-200 dark:text-lime-900 dark:hover:bg-lime-300",
            red: "bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-200 dark:text-red-900 dark:hover:bg-red-300",
            teal: "bg-teal-100 text-teal-800 hover:bg-teal-200 dark:bg-teal-200 dark:text-teal-900 dark:hover:bg-teal-300",
            yellow: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-200 dark:text-yellow-900 dark:hover:bg-yellow-300"
        },
        size: {
            xs: "p-1 text-xs",
            sm: "p-1.5 text-sm"
        }
    },
    icon: {
        off: "rounded px-2 py-0.5",
        on: "rounded-full p-1.5",
        size: {
            xs: "h-3 w-3",
            sm: "h-3.5 w-3.5"
        }
    }
});
;
 //# sourceMappingURL=theme.js.map
}),
"[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/components/Badge/Badge.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Badge",
    ()=>Badge
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$get$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/helpers/get.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$resolve$2d$props$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/helpers/resolve-props.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$resolve$2d$theme$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/helpers/resolve-theme.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$tailwind$2d$merge$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/helpers/tailwind-merge.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$theme$2f$provider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/theme/provider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$components$2f$Badge$2f$theme$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/components/Badge/theme.js [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
;
const Badge = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])((props, ref)=>{
    const provider = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$theme$2f$provider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useThemeProvider"])();
    const theme = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$resolve$2d$theme$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useResolveTheme"])([
        __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$components$2f$Badge$2f$theme$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["badgeTheme"],
        provider.theme?.badge,
        props.theme
    ], [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$get$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["get"])(provider.clearTheme, "badge"),
        props.clearTheme
    ], [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$get$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["get"])(provider.applyTheme, "badge"),
        props.applyTheme
    ]);
    const { children, color = "info", icon: Icon, size = "xs", className, ...restProps } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$resolve$2d$props$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resolveProps"])(props, provider.props?.badge);
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxs"])("span", {
        ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$tailwind$2d$merge$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["twMerge"])(theme.root.base, theme.root.color[color], theme.root.size[size], theme.icon[Icon ? "on" : "off"], className),
        "data-testid": "flowbite-badge",
        ...restProps,
        children: [
            Icon && /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(Icon, {
                "aria-hidden": true,
                className: theme.icon.size[size],
                "data-testid": "flowbite-badge-icon"
            }),
            children && /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("span", {
                children
            })
        ]
    });
});
Badge.displayName = "Badge";
;
 //# sourceMappingURL=Badge.js.map
}),
"[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/components/Sidebar/SidebarItemContext.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SidebarItemContext",
    ()=>SidebarItemContext,
    "useSidebarItemContext",
    ()=>useSidebarItemContext
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
const SidebarItemContext = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(void 0);
function useSidebarItemContext() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(SidebarItemContext);
    if (!context) {
        throw new Error("useSidebarItemContext should be used within the SidebarItemContext provider!");
    }
    return context;
}
;
 //# sourceMappingURL=SidebarItemContext.js.map
}),
"[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/components/Sidebar/SidebarItem.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SidebarItem",
    ()=>SidebarItem
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$get$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/helpers/get.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$resolve$2d$props$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/helpers/resolve-props.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$resolve$2d$theme$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/helpers/resolve-theme.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$tailwind$2d$merge$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/helpers/tailwind-merge.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$theme$2f$provider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/theme/provider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$components$2f$Badge$2f$Badge$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/components/Badge/Badge.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$components$2f$Tooltip$2f$Tooltip$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/components/Tooltip/Tooltip.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$components$2f$Sidebar$2f$SidebarContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/components/Sidebar/SidebarContext.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$components$2f$Sidebar$2f$SidebarItemContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/components/Sidebar/SidebarItemContext.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$components$2f$Sidebar$2f$theme$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/components/Sidebar/theme.js [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
;
;
;
;
;
const SidebarItem = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])((props, ref)=>{
    const id = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useId"])();
    const { theme: rootTheme, clearTheme: rootClearTheme, applyTheme: rootApplyTheme, isCollapsed } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$components$2f$Sidebar$2f$SidebarContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSidebarContext"])();
    const { isInsideCollapse } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$components$2f$Sidebar$2f$SidebarItemContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSidebarItemContext"])();
    const provider = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$theme$2f$provider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useThemeProvider"])();
    const theme = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$resolve$2d$theme$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useResolveTheme"])([
        __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$components$2f$Sidebar$2f$theme$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sidebarTheme"].item,
        provider.theme?.sidebar?.item,
        rootTheme?.item,
        props.theme
    ], [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$get$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["get"])(provider.clearTheme, "sidebar.item"),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$get$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["get"])(rootClearTheme, "item"),
        props.clearTheme
    ], [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$get$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["get"])(provider.applyTheme, "sidebar.item"),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$get$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["get"])(rootApplyTheme, "item"),
        props.applyTheme
    ]);
    const { active: isActive, as: Component = "a", children, className, icon: Icon, label, labelColor = "info", ...restProps } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$resolve$2d$props$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resolveProps"])(props, provider.props?.sidebarItem);
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(ListItem, {
        theme,
        className: theme.listItem,
        id,
        isCollapsed,
        tooltipChildren: children,
        children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxs"])(Component, {
            "aria-labelledby": `flowbite-sidebar-item-${id}`,
            ref,
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$tailwind$2d$merge$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["twMerge"])(theme.base, isActive && theme.active, !isCollapsed && isInsideCollapse && theme.collapsed.insideCollapse, className),
            ...restProps,
            children: [
                Icon && /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(Icon, {
                    "aria-hidden": true,
                    "data-testid": "flowbite-sidebar-item-icon",
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$tailwind$2d$merge$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["twMerge"])(theme.icon.base, isActive && theme.icon.active)
                }),
                isCollapsed && !Icon && /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("span", {
                    className: theme.collapsed.noIcon,
                    children: children.charAt(0).toLocaleUpperCase() ?? "?"
                }),
                !isCollapsed && /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(Children, {
                    id,
                    theme,
                    children
                }),
                !isCollapsed && label && /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$components$2f$Badge$2f$Badge$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                    color: labelColor,
                    "data-testid": "flowbite-sidebar-label",
                    hidden: isCollapsed,
                    className: theme.label,
                    children: label
                })
            ]
        })
    });
});
SidebarItem.displayName = "SidebarItem";
function ListItem({ id, theme, isCollapsed, tooltipChildren, children: wrapperChildren, ...props }) {
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("li", {
        ...props,
        children: isCollapsed ? /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$components$2f$Tooltip$2f$Tooltip$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Tooltip"], {
            content: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(Children, {
                id,
                theme,
                children: tooltipChildren
            }),
            placement: "right",
            children: wrapperChildren
        }) : wrapperChildren
    });
}
ListItem.displayName = "SidebarItem.ListItem";
function Children({ id, theme, children }) {
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("span", {
        "data-testid": "flowbite-sidebar-item-content",
        id: `flowbite-sidebar-item-${id}`,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$tailwind$2d$merge$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["twMerge"])(theme.content.base),
        children
    });
}
ListItem.displayName = "SidebarItem.Children";
;
 //# sourceMappingURL=SidebarItem.js.map
}),
"[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/components/Sidebar/SidebarItemGroup.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SidebarItemGroup",
    ()=>SidebarItemGroup
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$get$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/helpers/get.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$resolve$2d$props$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/helpers/resolve-props.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$resolve$2d$theme$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/helpers/resolve-theme.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$tailwind$2d$merge$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/helpers/tailwind-merge.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$theme$2f$provider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/theme/provider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$components$2f$Sidebar$2f$SidebarContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/components/Sidebar/SidebarContext.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$components$2f$Sidebar$2f$SidebarItemContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/components/Sidebar/SidebarItemContext.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$components$2f$Sidebar$2f$theme$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/components/Sidebar/theme.js [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
;
;
;
const SidebarItemGroup = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])((props, ref)=>{
    const { theme: rootTheme, clearTheme: rootClearTheme, applyTheme: rootApplyTheme } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$components$2f$Sidebar$2f$SidebarContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSidebarContext"])();
    const provider = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$theme$2f$provider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useThemeProvider"])();
    const theme = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$resolve$2d$theme$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useResolveTheme"])([
        __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$components$2f$Sidebar$2f$theme$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sidebarTheme"].itemGroup,
        provider.theme?.sidebar?.itemGroup,
        rootTheme?.itemGroup,
        props.theme
    ], [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$get$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["get"])(provider.clearTheme, "sidebar.itemGroup"),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$get$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["get"])(rootClearTheme, "itemGroup"),
        props.clearTheme
    ], [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$get$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["get"])(provider.applyTheme, "sidebar.itemGroup"),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$get$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["get"])(rootApplyTheme, "itemGroup"),
        props.applyTheme
    ]);
    const { className, ...restProps } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$resolve$2d$props$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resolveProps"])(props, provider.props?.sidebarItemGroup);
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$components$2f$Sidebar$2f$SidebarItemContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SidebarItemContext"].Provider, {
        value: {
            isInsideCollapse: false
        },
        children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("ul", {
            ref,
            "data-testid": "flowbite-sidebar-item-group",
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$tailwind$2d$merge$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["twMerge"])(theme.base, className),
            ...restProps
        })
    });
});
SidebarItemGroup.displayName = "SidebarItemGroup";
;
 //# sourceMappingURL=SidebarItemGroup.js.map
}),
"[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/components/Sidebar/SidebarItems.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SidebarItems",
    ()=>SidebarItems
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$get$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/helpers/get.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$resolve$2d$props$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/helpers/resolve-props.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$resolve$2d$theme$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/helpers/resolve-theme.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$tailwind$2d$merge$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/helpers/tailwind-merge.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$theme$2f$provider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/theme/provider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$components$2f$Sidebar$2f$SidebarContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/components/Sidebar/SidebarContext.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$components$2f$Sidebar$2f$theme$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/components/Sidebar/theme.js [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
;
;
const SidebarItems = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])((props, ref)=>{
    const { theme: rootTheme, clearTheme: rootClearTheme, applyTheme: rootApplyTheme } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$components$2f$Sidebar$2f$SidebarContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSidebarContext"])();
    const provider = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$theme$2f$provider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useThemeProvider"])();
    const theme = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$resolve$2d$theme$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useResolveTheme"])([
        __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$components$2f$Sidebar$2f$theme$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sidebarTheme"].items,
        provider.theme?.sidebar?.items,
        rootTheme?.items,
        props.theme
    ], [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$get$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["get"])(provider.clearTheme, "sidebar.items"),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$get$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["get"])(rootClearTheme, "items"),
        props.clearTheme
    ], [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$get$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["get"])(provider.applyTheme, "sidebar.items"),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$get$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["get"])(rootApplyTheme, "items"),
        props.applyTheme
    ]);
    const { className, ...restProps } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$resolve$2d$props$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resolveProps"])(props, provider.props?.sidebarItems);
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("div", {
        ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$helpers$2f$tailwind$2d$merge$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["twMerge"])(theme.base, className),
        "data-testid": "flowbite-sidebar-items",
        ...restProps
    });
});
SidebarItems.displayName = "SidebarItems";
;
 //# sourceMappingURL=SidebarItems.js.map
}),
];

//# sourceMappingURL=c44cd_flowbite-react_dist_ef2ff787._.js.map