import Fuse from 'fuse.js';
import { db } from '../db/database.js';

/**
 * Hybrid search system combining FTS5 (exact matches) and Fuse.js (fuzzy matching)
 *
 * Strategy:
 * 1. Try FTS5 first for fast exact matches
 * 2. If FTS5 returns < 3 results, use Fuse.js for fuzzy matching
 * 3. Merge and deduplicate results
 */

class SearchEngine {
  constructor() {
    this.fuseOptions = {
      includeScore: true,
      threshold: 0.4, // Lower = more strict, higher = more fuzzy
      keys: [] // Will be set per search type
    };
  }

  // ============================================
  // CUSTOMER SEARCH
  // ============================================

  searchCustomers(query, options = {}) {
    if (!query || query.trim().length === 0) {
      return db.getAllCustomers();
    }

    const {
      fuzzyFallback = true,
      limit = 50
    } = options;

    // Try FTS5 first
    const ftsResults = this.searchCustomersFTS(query);

    // If we have enough results, return them
    if (ftsResults.length >= 3 || !fuzzyFallback) {
      return ftsResults.slice(0, limit);
    }

    // Otherwise, use fuzzy search
    const fuzzyResults = this.searchCustomersFuzzy(query, limit);

    // Merge and deduplicate
    const merged = this.mergeResults(ftsResults, fuzzyResults, 'id');
    return merged.slice(0, limit);
  }

  searchCustomersFTS(query) {
    try {
      // Escape special FTS5 characters and prepare query
      const ftsQuery = this.prepareFTSQuery(query);
      return db.searchCustomers(ftsQuery);
    } catch (error) {
      console.error('FTS5 search error:', error.message);
      return [];
    }
  }

  searchCustomersFuzzy(query, limit = 50) {
    const allCustomers = db.getAllCustomers();

    const fuse = new Fuse(allCustomers, {
      ...this.fuseOptions,
      keys: [
        { name: 'name', weight: 2 },
        { name: 'contact_name', weight: 1.5 },
        { name: 'contact_email', weight: 1 },
        { name: 'org_nr', weight: 1 },
        { name: 'notes', weight: 0.5 }
      ]
    });

    const results = fuse.search(query);
    return results.map(r => r.item).slice(0, limit);
  }

  // ============================================
  // INVOICE SEARCH
  // ============================================

  searchInvoices(query, options = {}) {
    if (!query || query.trim().length === 0) {
      return db.getAllInvoices();
    }

    const {
      fuzzyFallback = true,
      limit = 50,
      status = null
    } = options;

    // Try FTS5 first
    let ftsResults = this.searchInvoicesFTS(query);

    // Filter by status if provided
    if (status) {
      ftsResults = ftsResults.filter(inv => inv.status === status);
    }

    // If we have enough results, return them
    if (ftsResults.length >= 3 || !fuzzyFallback) {
      return ftsResults.slice(0, limit);
    }

    // Otherwise, use fuzzy search
    const fuzzyResults = this.searchInvoicesFuzzy(query, limit, status);

    // Merge and deduplicate
    const merged = this.mergeResults(ftsResults, fuzzyResults, 'id');
    return merged.slice(0, limit);
  }

  searchInvoicesFTS(query) {
    try {
      const ftsQuery = this.prepareFTSQuery(query);
      return db.searchInvoices(ftsQuery);
    } catch (error) {
      console.error('FTS5 search error:', error.message);
      return [];
    }
  }

  searchInvoicesFuzzy(query, limit = 50, status = null) {
    let allInvoices = db.getAllInvoices();

    if (status) {
      allInvoices = allInvoices.filter(inv => inv.status === status);
    }

    const fuse = new Fuse(allInvoices, {
      ...this.fuseOptions,
      keys: [
        { name: 'invoice_number', weight: 2 },
        { name: 'customer_name', weight: 1.5 },
        { name: 'notes', weight: 1 }
      ]
    });

    const results = fuse.search(query);
    return results.map(r => r.item).slice(0, limit);
  }

  // ============================================
  // PROJECT SEARCH
  // ============================================

  searchProjects(query, options = {}) {
    if (!query || query.trim().length === 0) {
      return db.getAllProjects();
    }

    const {
      limit = 50,
      status = null
    } = options;

    let allProjects = db.getAllProjects();

    if (status) {
      allProjects = allProjects.filter(p => p.status === status);
    }

    const fuse = new Fuse(allProjects, {
      ...this.fuseOptions,
      keys: [
        { name: 'name', weight: 2 },
        { name: 'customer_name', weight: 1.5 },
        { name: 'description', weight: 1 },
        { name: 'tags', weight: 0.8 },
        { name: 'notes', weight: 0.5 }
      ]
    });

    const results = fuse.search(query);
    return results.map(r => r.item).slice(0, limit);
  }

  // ============================================
  // EXPENSE SEARCH
  // ============================================

  searchExpenses(query, options = {}) {
    if (!query || query.trim().length === 0) {
      return db.getAllExpenses();
    }

    const {
      limit = 50,
      category = null
    } = options;

    let allExpenses = db.getAllExpenses();

    if (category) {
      allExpenses = allExpenses.filter(e => e.category === category);
    }

    const fuse = new Fuse(allExpenses, {
      ...this.fuseOptions,
      keys: [
        { name: 'description', weight: 2 },
        { name: 'vendor', weight: 1.5 },
        { name: 'category', weight: 1 },
        { name: 'receipt_number', weight: 1 },
        { name: 'notes', weight: 0.5 }
      ]
    });

    const results = fuse.search(query);
    return results.map(r => r.item).slice(0, limit);
  }

  // ============================================
  // GLOBAL SEARCH (across all entities)
  // ============================================

  searchGlobal(query, options = {}) {
    const { limit = 20 } = options;

    const results = {
      customers: this.searchCustomers(query, { limit: limit / 4 }),
      invoices: this.searchInvoices(query, { limit: limit / 4 }),
      projects: this.searchProjects(query, { limit: limit / 4 }),
      expenses: this.searchExpenses(query, { limit: limit / 4 })
    };

    return results;
  }

  // ============================================
  // HELPER METHODS
  // ============================================

  prepareFTSQuery(query) {
    // Escape special FTS5 characters: " * - + ( )
    let escaped = query
      .replace(/"/g, '""')
      .replace(/[*\-+()]/g, '');

    // Split into words and join with OR
    const words = escaped.trim().split(/\s+/);

    // Use prefix matching for short queries (< 3 chars)
    if (words.length === 1 && words[0].length < 3) {
      return `${words[0]}*`;
    }

    // For multi-word queries, try exact phrase first, then individual words
    if (words.length > 1) {
      return `"${escaped}" OR ${words.join(' OR ')}`;
    }

    return escaped;
  }

  mergeResults(arr1, arr2, keyField) {
    const seen = new Set();
    const merged = [];

    // Add all from first array
    arr1.forEach(item => {
      const key = item[keyField];
      if (!seen.has(key)) {
        seen.add(key);
        merged.push(item);
      }
    });

    // Add unique items from second array
    arr2.forEach(item => {
      const key = item[keyField];
      if (!seen.has(key)) {
        seen.add(key);
        merged.push(item);
      }
    });

    return merged;
  }

  // ============================================
  // ADVANCED FILTERS
  // ============================================

  filterCustomersByRevenue(minRevenue = 0, maxRevenue = Infinity) {
    const customersWithRevenue = db.getRevenueByCustomer(100);
    return customersWithRevenue.filter(
      c => c.total_revenue >= minRevenue && c.total_revenue <= maxRevenue
    );
  }

  filterInvoicesByDateRange(startDate, endDate) {
    const allInvoices = db.getAllInvoices();
    return allInvoices.filter(inv => {
      const invoiceDate = new Date(inv.date);
      return invoiceDate >= new Date(startDate) && invoiceDate <= new Date(endDate);
    });
  }

  filterProjectsByBudget(minBudget = 0, maxBudget = Infinity) {
    const allProjects = db.getAllProjects();
    return allProjects.filter(
      p => p.budget >= minBudget && p.budget <= maxBudget
    );
  }
}

// Export singleton instance
export const search = new SearchEngine();

// Also export class for testing
export { SearchEngine };
