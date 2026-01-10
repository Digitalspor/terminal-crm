module.exports = [
"[project]/Personal/crm-terminal/dashboard/.next-internal/server/app/(dashboard)/invoices/page/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__, module, exports) => {

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
"[project]/Personal/crm-terminal/dashboard/app/(dashboard)/invoices/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>InvoicesPage,
    "dynamic",
    ()=>dynamic
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/lib/db.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$components$2f$Badge$2f$Badge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/components/Badge/Badge.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$components$2f$Card$2f$Card$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/components/Card/Card.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$components$2f$Table$2f$Table$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/components/Table/Table.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$components$2f$Table$2f$TableBody$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/components/Table/TableBody.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$components$2f$Table$2f$TableCell$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/components/Table/TableCell.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$components$2f$Table$2f$TableHead$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/components/Table/TableHead.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$components$2f$Table$2f$TableHeadCell$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/components/Table/TableHeadCell.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$components$2f$Table$2f$TableRow$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/node_modules/flowbite-react/dist/components/Table/TableRow.js [app-rsc] (ecmascript)");
;
;
;
const dynamic = "force-dynamic";
function InvoicesPage() {
    const invoices = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getInvoices"])();
    const formatCurrency = (amount)=>{
        return new Intl.NumberFormat("nb-NO", {
            style: "currency",
            currency: "NOK",
            minimumFractionDigits: 0
        }).format(amount / 100);
    };
    const isOverdue = (invoice)=>{
        return invoice.status !== "paid" && new Date(invoice.due_date) < new Date();
    };
    const statusConfig = {
        draft: {
            color: "gray",
            label: "Utkast"
        },
        sent: {
            color: "info",
            label: "Sendt"
        },
        paid: {
            color: "success",
            label: "Betalt"
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-2xl font-bold text-gray-900 dark:text-white",
                        children: "Fakturaer"
                    }, void 0, false, {
                        fileName: "[project]/Personal/crm-terminal/dashboard/app/(dashboard)/invoices/page.tsx",
                        lineNumber: 40,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-gray-500 dark:text-gray-400",
                        children: [
                            invoices.length,
                            " fakturaer totalt"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Personal/crm-terminal/dashboard/app/(dashboard)/invoices/page.tsx",
                        lineNumber: 43,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Personal/crm-terminal/dashboard/app/(dashboard)/invoices/page.tsx",
                lineNumber: 39,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$components$2f$Card$2f$Card$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Card"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$components$2f$Table$2f$Table$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Table"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$components$2f$Table$2f$TableHead$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TableHead"], {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$components$2f$Table$2f$TableRow$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TableRow"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$components$2f$Table$2f$TableHeadCell$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TableHeadCell"], {
                                        children: "Faktura"
                                    }, void 0, false, {
                                        fileName: "[project]/Personal/crm-terminal/dashboard/app/(dashboard)/invoices/page.tsx",
                                        lineNumber: 52,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$components$2f$Table$2f$TableHeadCell$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TableHeadCell"], {
                                        children: "Kunde"
                                    }, void 0, false, {
                                        fileName: "[project]/Personal/crm-terminal/dashboard/app/(dashboard)/invoices/page.tsx",
                                        lineNumber: 53,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$components$2f$Table$2f$TableHeadCell$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TableHeadCell"], {
                                        children: "Dato"
                                    }, void 0, false, {
                                        fileName: "[project]/Personal/crm-terminal/dashboard/app/(dashboard)/invoices/page.tsx",
                                        lineNumber: 54,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$components$2f$Table$2f$TableHeadCell$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TableHeadCell"], {
                                        children: "Forfall"
                                    }, void 0, false, {
                                        fileName: "[project]/Personal/crm-terminal/dashboard/app/(dashboard)/invoices/page.tsx",
                                        lineNumber: 55,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$components$2f$Table$2f$TableHeadCell$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TableHeadCell"], {
                                        children: "Status"
                                    }, void 0, false, {
                                        fileName: "[project]/Personal/crm-terminal/dashboard/app/(dashboard)/invoices/page.tsx",
                                        lineNumber: 56,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$components$2f$Table$2f$TableHeadCell$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TableHeadCell"], {
                                        className: "text-right",
                                        children: "Belop"
                                    }, void 0, false, {
                                        fileName: "[project]/Personal/crm-terminal/dashboard/app/(dashboard)/invoices/page.tsx",
                                        lineNumber: 57,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Personal/crm-terminal/dashboard/app/(dashboard)/invoices/page.tsx",
                                lineNumber: 51,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Personal/crm-terminal/dashboard/app/(dashboard)/invoices/page.tsx",
                            lineNumber: 50,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$components$2f$Table$2f$TableBody$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TableBody"], {
                            className: "divide-y",
                            children: invoices.map((invoice)=>{
                                const overdue = isOverdue(invoice);
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$components$2f$Table$2f$TableRow$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TableRow"], {
                                    className: overdue ? "bg-red-50 dark:bg-red-900/20" : "bg-white dark:bg-gray-800",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$components$2f$Table$2f$TableCell$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TableCell"], {
                                            className: "font-medium text-gray-900 dark:text-white",
                                            children: [
                                                "#",
                                                invoice.invoice_number
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Personal/crm-terminal/dashboard/app/(dashboard)/invoices/page.tsx",
                                            lineNumber: 68,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$components$2f$Table$2f$TableCell$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TableCell"], {
                                            children: invoice.customer_name || "-"
                                        }, void 0, false, {
                                            fileName: "[project]/Personal/crm-terminal/dashboard/app/(dashboard)/invoices/page.tsx",
                                            lineNumber: 71,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$components$2f$Table$2f$TableCell$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TableCell"], {
                                            className: "text-gray-500",
                                            children: invoice.date
                                        }, void 0, false, {
                                            fileName: "[project]/Personal/crm-terminal/dashboard/app/(dashboard)/invoices/page.tsx",
                                            lineNumber: 72,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$components$2f$Table$2f$TableCell$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TableCell"], {
                                            className: overdue ? "text-red-600 font-medium" : "text-gray-500",
                                            children: invoice.due_date
                                        }, void 0, false, {
                                            fileName: "[project]/Personal/crm-terminal/dashboard/app/(dashboard)/invoices/page.tsx",
                                            lineNumber: 73,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$components$2f$Table$2f$TableCell$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TableCell"], {
                                            children: overdue ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$components$2f$Badge$2f$Badge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Badge"], {
                                                color: "failure",
                                                children: "Forfalt"
                                            }, void 0, false, {
                                                fileName: "[project]/Personal/crm-terminal/dashboard/app/(dashboard)/invoices/page.tsx",
                                                lineNumber: 78,
                                                columnNumber: 23
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$components$2f$Badge$2f$Badge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Badge"], {
                                                color: statusConfig[invoice.status]?.color || "gray",
                                                children: statusConfig[invoice.status]?.label || invoice.status
                                            }, void 0, false, {
                                                fileName: "[project]/Personal/crm-terminal/dashboard/app/(dashboard)/invoices/page.tsx",
                                                lineNumber: 80,
                                                columnNumber: 23
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/Personal/crm-terminal/dashboard/app/(dashboard)/invoices/page.tsx",
                                            lineNumber: 76,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Personal$2f$crm$2d$terminal$2f$dashboard$2f$node_modules$2f$flowbite$2d$react$2f$dist$2f$components$2f$Table$2f$TableCell$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TableCell"], {
                                            className: "text-right font-medium text-gray-900 dark:text-white",
                                            children: formatCurrency(invoice.total)
                                        }, void 0, false, {
                                            fileName: "[project]/Personal/crm-terminal/dashboard/app/(dashboard)/invoices/page.tsx",
                                            lineNumber: 85,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, invoice.id, true, {
                                    fileName: "[project]/Personal/crm-terminal/dashboard/app/(dashboard)/invoices/page.tsx",
                                    lineNumber: 64,
                                    columnNumber: 17
                                }, this);
                            })
                        }, void 0, false, {
                            fileName: "[project]/Personal/crm-terminal/dashboard/app/(dashboard)/invoices/page.tsx",
                            lineNumber: 60,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Personal/crm-terminal/dashboard/app/(dashboard)/invoices/page.tsx",
                    lineNumber: 49,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/Personal/crm-terminal/dashboard/app/(dashboard)/invoices/page.tsx",
                lineNumber: 48,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Personal/crm-terminal/dashboard/app/(dashboard)/invoices/page.tsx",
        lineNumber: 38,
        columnNumber: 5
    }, this);
}
}),
"[project]/Personal/crm-terminal/dashboard/app/(dashboard)/invoices/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/Personal/crm-terminal/dashboard/app/(dashboard)/invoices/page.tsx [app-rsc] (ecmascript)"));
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__5a800cca._.js.map