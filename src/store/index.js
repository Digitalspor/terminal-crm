import { create } from 'zustand';
import { db } from '../db/database.js';
import { search } from '../lib/search.js';

/**
 * Global CRM Store using Zustand
 *
 * Stores:
 * - Customers
 * - Invoices
 * - Projects
 * - Expenses
 * - UI State (current view, selected items, etc.)
 * - Search state
 */

export const useCRMStore = create((set, get) => ({
  // ============================================
  // CUSTOMERS STATE
  // ============================================
  customers: [],
  selectedCustomer: null,
  customersLoading: false,

  loadCustomers: () => {
    set({ customersLoading: true });
    const customers = db.getAllCustomers();
    set({ customers, customersLoading: false });
  },

  selectCustomer: (customerId) => {
    const customer = db.getCustomer(customerId);
    set({ selectedCustomer: customer });
  },

  searchCustomers: (query) => {
    const results = search.searchCustomers(query);
    set({ customers: results });
  },

  clearCustomerSelection: () => {
    set({ selectedCustomer: null });
  },

  // ============================================
  // INVOICES STATE
  // ============================================
  invoices: [],
  selectedInvoice: null,
  invoicesLoading: false,

  loadInvoices: () => {
    set({ invoicesLoading: true });
    const invoices = db.getAllInvoices();
    set({ invoices, invoicesLoading: false });
  },

  loadInvoicesByCustomer: (customerId) => {
    set({ invoicesLoading: true });
    const invoices = db.getInvoicesByCustomer(customerId);
    set({ invoices, invoicesLoading: false });
  },

  selectInvoice: (invoiceId) => {
    const invoice = db.getInvoice(invoiceId);
    set({ selectedInvoice: invoice });
  },

  searchInvoices: (query, options) => {
    const results = search.searchInvoices(query, options);
    set({ invoices: results });
  },

  clearInvoiceSelection: () => {
    set({ selectedInvoice: null });
  },

  getOverdueInvoices: () => {
    const overdueInvoices = db.getOverdueInvoices();
    set({ invoices: overdueInvoices });
  },

  // ============================================
  // PROJECTS STATE
  // ============================================
  projects: [],
  selectedProject: null,
  projectsLoading: false,

  loadProjects: () => {
    set({ projectsLoading: true });
    const projects = db.getAllProjects();
    set({ projects, projectsLoading: false });
  },

  loadProjectsByCustomer: (customerId) => {
    set({ projectsLoading: true });
    const projects = db.getProjectsByCustomer(customerId);
    set({ projects, projectsLoading: false });
  },

  selectProject: (projectId) => {
    const project = db.getProject(projectId);
    set({ selectedProject: project });
  },

  searchProjects: (query, options) => {
    const results = search.searchProjects(query, options);
    set({ projects: results });
  },

  clearProjectSelection: () => {
    set({ selectedProject: null });
  },

  // ============================================
  // EXPENSES STATE
  // ============================================
  expenses: [],
  selectedExpense: null,
  expensesLoading: false,

  loadExpenses: () => {
    set({ expensesLoading: true });
    const expenses = db.getAllExpenses();
    set({ expenses, expensesLoading: false });
  },

  selectExpense: (expenseId) => {
    const expense = db.getExpense(expenseId);
    set({ selectedExpense: expense });
  },

  searchExpenses: (query, options) => {
    const results = search.searchExpenses(query, options);
    set({ expenses: results });
  },

  clearExpenseSelection: () => {
    set({ selectedExpense: null });
  },

  // ============================================
  // STATS STATE
  // ============================================
  stats: null,
  statsLoading: false,

  loadStats: () => {
    set({ statsLoading: true });
    const stats = db.getOverallStats();
    set({ stats, statsLoading: false });
  },

  // ============================================
  // UI STATE
  // ============================================
  currentView: 'main-menu', // 'main-menu', 'customer-list', 'customer-detail', etc.
  previousView: null,
  searchQuery: '',
  isSearching: false,

  setView: (view) => {
    const previousView = get().currentView;
    set({ currentView: view, previousView });
  },

  goBack: () => {
    const previousView = get().previousView;
    if (previousView) {
      set({ currentView: previousView, previousView: null });
    } else {
      set({ currentView: 'main-menu' });
    }
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query, isSearching: query.length > 0 });
  },

  clearSearch: () => {
    set({ searchQuery: '', isSearching: false });
  },

  // ============================================
  // GLOBAL ACTIONS
  // ============================================
  refreshAll: () => {
    get().loadCustomers();
    get().loadInvoices();
    get().loadProjects();
    get().loadExpenses();
    get().loadStats();
  },

  reset: () => {
    set({
      customers: [],
      invoices: [],
      projects: [],
      expenses: [],
      selectedCustomer: null,
      selectedInvoice: null,
      selectedProject: null,
      selectedExpense: null,
      stats: null,
      currentView: 'main-menu',
      searchQuery: '',
      isSearching: false
    });
  }
}));

// Convenience hooks for specific slices
export const useCustomers = () => useCRMStore((state) => ({
  customers: state.customers,
  selectedCustomer: state.selectedCustomer,
  loading: state.customersLoading,
  load: state.loadCustomers,
  select: state.selectCustomer,
  search: state.searchCustomers,
  clear: state.clearCustomerSelection
}));

export const useInvoices = () => useCRMStore((state) => ({
  invoices: state.invoices,
  selectedInvoice: state.selectedInvoice,
  loading: state.invoicesLoading,
  load: state.loadInvoices,
  loadByCustomer: state.loadInvoicesByCustomer,
  select: state.selectInvoice,
  search: state.searchInvoices,
  clear: state.clearInvoiceSelection,
  getOverdue: state.getOverdueInvoices
}));

export const useProjects = () => useCRMStore((state) => ({
  projects: state.projects,
  selectedProject: state.selectedProject,
  loading: state.projectsLoading,
  load: state.loadProjects,
  loadByCustomer: state.loadProjectsByCustomer,
  select: state.selectProject,
  search: state.searchProjects,
  clear: state.clearProjectSelection
}));

export const useExpenses = () => useCRMStore((state) => ({
  expenses: state.expenses,
  selectedExpense: state.selectedExpense,
  loading: state.expensesLoading,
  load: state.loadExpenses,
  select: state.selectExpense,
  search: state.searchExpenses,
  clear: state.clearExpenseSelection
}));

export const useUI = () => useCRMStore((state) => ({
  currentView: state.currentView,
  previousView: state.previousView,
  searchQuery: state.searchQuery,
  isSearching: state.isSearching,
  setView: state.setView,
  goBack: state.goBack,
  setSearchQuery: state.setSearchQuery,
  clearSearch: state.clearSearch
}));

export const useStats = () => useCRMStore((state) => ({
  stats: state.stats,
  loading: state.statsLoading,
  load: state.loadStats
}));
