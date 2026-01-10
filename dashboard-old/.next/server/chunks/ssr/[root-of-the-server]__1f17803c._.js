module.exports = [
"[project]/Personal/crm-terminal/dashboard/.next-internal/server/app/(dashboard)/dashboard/page/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__, module, exports) => {

}),
"[project]/Personal/crm-terminal/dashboard/app/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/app/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/Personal/crm-terminal/dashboard/app/(dashboard)/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/app/(dashboard)/layout.tsx [app-rsc] (ecmascript)"));
}),
"[externals]/better-sqlite3 [external] (better-sqlite3, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("better-sqlite3", () => require("better-sqlite3"));

module.exports = mod;
}),
"[project]/Personal/crm-terminal/dashboard/lib/db.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getCustomer",
    ()=>getCustomer,
    "getCustomers",
    ()=>getCustomers,
    "getDb",
    ()=>getDb,
    "getInvoices",
    ()=>getInvoices,
    "getOverdueInvoices",
    ()=>getOverdueInvoices,
    "getStats",
    ()=>getStats
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$better$2d$sqlite3__$5b$external$5d$__$28$better$2d$sqlite3$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/better-sqlite3 [external] (better-sqlite3, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
;
;
const dbPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), '..', 'data', 'crm.db');
function getDb() {
    return new __TURBOPACK__imported__module__$5b$externals$5d2f$better$2d$sqlite3__$5b$external$5d$__$28$better$2d$sqlite3$2c$__cjs$29$__["default"](dbPath, {
        readonly: true
    });
}
function getStats() {
    const db = getDb();
    const stats = db.prepare(`
    SELECT
      (SELECT COUNT(*) FROM customers) as total_customers,
      (SELECT COUNT(*) FROM invoices) as total_invoices,
      (SELECT COUNT(*) FROM projects) as total_projects,
      (SELECT SUM(total) FROM invoices WHERE status = 'paid') as total_revenue,
      (SELECT SUM(total) FROM invoices WHERE status = 'sent') as outstanding,
      (SELECT COUNT(*) FROM invoices WHERE status <> 'paid' AND due_date < date('now')) as overdue_count
  `).get();
    db.close();
    return stats;
}
function getCustomers(limit = 100) {
    const db = getDb();
    const customers = db.prepare(`
    SELECT
      c.*,
      (SELECT COUNT(*) FROM invoices WHERE customer_id = c.id) as invoice_count,
      (SELECT SUM(total) FROM invoices WHERE customer_id = c.id AND status = 'paid') as total_revenue
    FROM customers c
    ORDER BY c.name
    LIMIT ?
  `).all(limit);
    db.close();
    return customers;
}
function getCustomer(id) {
    const db = getDb();
    const customer = db.prepare(`SELECT * FROM customers WHERE id = ?`).get(id);
    const invoices = db.prepare(`
    SELECT * FROM invoices
    WHERE customer_id = ?
    ORDER BY date DESC
  `).all(id);
    db.close();
    return {
        customer,
        invoices
    };
}
function getInvoices(limit = 100) {
    const db = getDb();
    const invoices = db.prepare(`
    SELECT
      i.*,
      c.name as customer_name
    FROM invoices i
    LEFT JOIN customers c ON i.customer_id = c.id
    ORDER BY i.date DESC
    LIMIT ?
  `).all(limit);
    db.close();
    return invoices;
}
function getOverdueInvoices() {
    const db = getDb();
    const invoices = db.prepare(`
    SELECT
      i.*,
      c.name as customer_name
    FROM invoices i
    LEFT JOIN customers c ON i.customer_id = c.id
    WHERE i.status <> 'paid' AND i.due_date < date('now')
    ORDER BY i.due_date ASC
  `).all();
    db.close();
    return invoices;
}
}),
"[project]/Personal/crm-terminal/dashboard/app/(dashboard)/dashboard/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DashboardPage,
    "dynamic",
    ()=>dynamic
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/lib/db.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$components$2f$Badge$2f$Badge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/components/Badge/Badge.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$components$2f$Card$2f$Card$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/components/Card/Card.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/next/dist/client/app-dir/link.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$react$2d$icons$2f$hi$2f$index$2e$esm$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/react-icons/hi/index.esm.js [app-rsc] (ecmascript)");
;
;
;
;
;
const dynamic = "force-dynamic";
function DashboardPage() {
    const stats = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getStats"])();
    const overdueInvoices = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getOverdueInvoices"])();
    const formatCurrency = (amount)=>{
        if (amount === null || amount === undefined) return "kr 0";
        return new Intl.NumberFormat("nb-NO", {
            style: "currency",
            currency: "NOK",
            minimumFractionDigits: 0
        }).format(amount / 100);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-2xl font-bold text-gray-900 dark:text-white",
                        children: "Dashboard"
                    }, void 0, false, {
                        fileName: "[project]/Personal/crm-terminal/dashboard/app/(dashboard)/dashboard/page.tsx",
                        lineNumber: 46,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-gray-500 dark:text-gray-400",
                        children: "Oversikt over CRM-data"
                    }, void 0, false, {
                        fileName: "[project]/Personal/crm-terminal/dashboard/app/(dashboard)/dashboard/page.tsx",
                        lineNumber: 49,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Personal/crm-terminal/dashboard/app/(dashboard)/dashboard/page.tsx",
                lineNumber: 45,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(StatCard, {
                        title: "Kunder",
                        value: stats.total_customers || 0,
                        icon: __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$react$2d$icons$2f$hi$2f$index$2e$esm$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["HiUserGroup"],
                        color: "blue"
                    }, void 0, false, {
                        fileName: "[project]/Personal/crm-terminal/dashboard/app/(dashboard)/dashboard/page.tsx",
                        lineNumber: 56,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(StatCard, {
                        title: "Fakturaer",
                        value: stats.total_invoices || 0,
                        icon: __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$react$2d$icons$2f$hi$2f$index$2e$esm$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["HiDocumentText"],
                        color: "purple"
                    }, void 0, false, {
                        fileName: "[project]/Personal/crm-terminal/dashboard/app/(dashboard)/dashboard/page.tsx",
                        lineNumber: 62,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(StatCard, {
                        title: "Omsetning",
                        value: formatCurrency(stats.total_revenue),
                        icon: __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$react$2d$icons$2f$hi$2f$index$2e$esm$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["HiCurrencyDollar"],
                        color: "green"
                    }, void 0, false, {
                        fileName: "[project]/Personal/crm-terminal/dashboard/app/(dashboard)/dashboard/page.tsx",
                        lineNumber: 68,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(StatCard, {
                        title: "Forfalte",
                        value: stats.overdue_count || 0,
                        icon: __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$react$2d$icons$2f$hi$2f$index$2e$esm$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["HiExclamation"],
                        color: "yellow",
                        highlight: stats.overdue_count > 0
                    }, void 0, false, {
                        fileName: "[project]/Personal/crm-terminal/dashboard/app/(dashboard)/dashboard/page.tsx",
                        lineNumber: 74,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Personal/crm-terminal/dashboard/app/(dashboard)/dashboard/page.tsx",
                lineNumber: 55,
                columnNumber: 7
            }, this),
            overdueInvoices.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$components$2f$Card$2f$Card$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Card"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between mb-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-lg font-semibold text-gray-900 dark:text-white",
                                children: "Forfalte fakturaer"
                            }, void 0, false, {
                                fileName: "[project]/Personal/crm-terminal/dashboard/app/(dashboard)/dashboard/page.tsx",
                                lineNumber: 87,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                                href: "/overdue",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$components$2f$Badge$2f$Badge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Badge"], {
                                    color: "failure",
                                    children: "Se alle"
                                }, void 0, false, {
                                    fileName: "[project]/Personal/crm-terminal/dashboard/app/(dashboard)/dashboard/page.tsx",
                                    lineNumber: 91,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Personal/crm-terminal/dashboard/app/(dashboard)/dashboard/page.tsx",
                                lineNumber: 90,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Personal/crm-terminal/dashboard/app/(dashboard)/dashboard/page.tsx",
                        lineNumber: 86,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "divide-y divide-gray-200 dark:divide-gray-700",
                        children: overdueInvoices.slice(0, 5).map((invoice)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between py-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "font-medium text-gray-900 dark:text-white",
                                                children: [
                                                    "#",
                                                    invoice.invoice_number
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Personal/crm-terminal/dashboard/app/(dashboard)/dashboard/page.tsx",
                                                lineNumber: 101,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-gray-500",
                                                children: invoice.customer_name || "Ukjent kunde"
                                            }, void 0, false, {
                                                fileName: "[project]/Personal/crm-terminal/dashboard/app/(dashboard)/dashboard/page.tsx",
                                                lineNumber: 104,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Personal/crm-terminal/dashboard/app/(dashboard)/dashboard/page.tsx",
                                        lineNumber: 100,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$components$2f$Badge$2f$Badge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Badge"], {
                                                color: "failure",
                                                children: invoice.due_date
                                            }, void 0, false, {
                                                fileName: "[project]/Personal/crm-terminal/dashboard/app/(dashboard)/dashboard/page.tsx",
                                                lineNumber: 109,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-bold text-red-600",
                                                children: formatCurrency(invoice.total)
                                            }, void 0, false, {
                                                fileName: "[project]/Personal/crm-terminal/dashboard/app/(dashboard)/dashboard/page.tsx",
                                                lineNumber: 110,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Personal/crm-terminal/dashboard/app/(dashboard)/dashboard/page.tsx",
                                        lineNumber: 108,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, invoice.id, true, {
                                fileName: "[project]/Personal/crm-terminal/dashboard/app/(dashboard)/dashboard/page.tsx",
                                lineNumber: 96,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/Personal/crm-terminal/dashboard/app/(dashboard)/dashboard/page.tsx",
                        lineNumber: 94,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Personal/crm-terminal/dashboard/app/(dashboard)/dashboard/page.tsx",
                lineNumber: 85,
                columnNumber: 9
            }, this),
            overdueInvoices.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$components$2f$Card$2f$Card$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Card"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "py-8 text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$react$2d$icons$2f$hi$2f$index$2e$esm$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["HiExclamation"], {
                            className: "mx-auto h-12 w-12 text-green-400"
                        }, void 0, false, {
                            fileName: "[project]/Personal/crm-terminal/dashboard/app/(dashboard)/dashboard/page.tsx",
                            lineNumber: 123,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "mt-4 text-lg font-medium text-green-900 dark:text-green-300",
                            children: "Ingen forfalte fakturaer!"
                        }, void 0, false, {
                            fileName: "[project]/Personal/crm-terminal/dashboard/app/(dashboard)/dashboard/page.tsx",
                            lineNumber: 124,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mt-2 text-sm text-green-600 dark:text-green-400",
                            children: "Alle fakturaer er betalt eller ikke forfalt ennaa."
                        }, void 0, false, {
                            fileName: "[project]/Personal/crm-terminal/dashboard/app/(dashboard)/dashboard/page.tsx",
                            lineNumber: 127,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Personal/crm-terminal/dashboard/app/(dashboard)/dashboard/page.tsx",
                    lineNumber: 122,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/Personal/crm-terminal/dashboard/app/(dashboard)/dashboard/page.tsx",
                lineNumber: 121,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Personal/crm-terminal/dashboard/app/(dashboard)/dashboard/page.tsx",
        lineNumber: 44,
        columnNumber: 5
    }, this);
}
function StatCard({ title, value, icon: Icon, color, highlight }) {
    const colors = {
        blue: "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
        green: "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400",
        yellow: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400",
        purple: "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400"
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$components$2f$Card$2f$Card$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Card"], {
        className: highlight ? "ring-2 ring-yellow-400" : "",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center gap-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `rounded-lg p-3 ${colors[color]}`,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                        className: "size-6"
                    }, void 0, false, {
                        fileName: "[project]/Personal/crm-terminal/dashboard/app/(dashboard)/dashboard/page.tsx",
                        lineNumber: 164,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/Personal/crm-terminal/dashboard/app/(dashboard)/dashboard/page.tsx",
                    lineNumber: 163,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm text-gray-500 dark:text-gray-400",
                            children: title
                        }, void 0, false, {
                            fileName: "[project]/Personal/crm-terminal/dashboard/app/(dashboard)/dashboard/page.tsx",
                            lineNumber: 167,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-2xl font-bold text-gray-900 dark:text-white",
                            children: value
                        }, void 0, false, {
                            fileName: "[project]/Personal/crm-terminal/dashboard/app/(dashboard)/dashboard/page.tsx",
                            lineNumber: 168,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Personal/crm-terminal/dashboard/app/(dashboard)/dashboard/page.tsx",
                    lineNumber: 166,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Personal/crm-terminal/dashboard/app/(dashboard)/dashboard/page.tsx",
            lineNumber: 162,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/Personal/crm-terminal/dashboard/app/(dashboard)/dashboard/page.tsx",
        lineNumber: 161,
        columnNumber: 5
    }, this);
}
}),
"[project]/Personal/crm-terminal/dashboard/app/(dashboard)/dashboard/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/app/(dashboard)/dashboard/page.tsx [app-rsc] (ecmascript)"));
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1f17803c._.js.map