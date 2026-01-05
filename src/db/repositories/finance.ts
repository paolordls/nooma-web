import { db } from "../client";
import { accounts, categories, transactions, budgets } from "../schema";
import { eq, desc, and, gte, lte, sql } from "drizzle-orm";

export const financeRepository = {
  // Accounts
  async getAccounts() {
    return db.select().from(accounts).orderBy(desc(accounts.createdAt));
  },

  async getAccount(id: string) {
    const result = await db.select().from(accounts).where(eq(accounts.id, id));
    return result[0];
  },

  async createAccount(data: {
    name: string;
    type: "checking" | "savings" | "credit_card" | "cash" | "investment";
    currency?: string;
    balance?: number;
    institution?: string;
  }) {
    const result = db.insert(accounts).values({
      name: data.name,
      type: data.type,
      currency: data.currency || "USD",
      balance: data.balance || 0,
      institution: data.institution,
    }).returning();
    return result.get();
  },

  async updateAccount(id: string, data: Partial<{
    name: string;
    type: "checking" | "savings" | "credit_card" | "cash" | "investment";
    currency: string;
    balance: number;
    institution: string;
    isActive: boolean;
  }>) {
    const result = db.update(accounts)
      .set({ ...data, updatedAt: new Date().toISOString() })
      .where(eq(accounts.id, id))
      .returning();
    return result.get();
  },

  async deleteAccount(id: string) {
    return db.delete(accounts).where(eq(accounts.id, id));
  },

  // Categories
  async getCategories() {
    return db.select().from(categories).orderBy(categories.name);
  },

  async createCategory(data: { name: string; type: "income" | "expense"; icon?: string; color?: string }) {
    const result = db.insert(categories).values(data).returning();
    return result.get();
  },

  // Transactions
  async getTransactions(filters?: {
    accountId?: string;
    categoryId?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
  }) {
    let query = db.select().from(transactions);

    const conditions = [];
    if (filters?.accountId) conditions.push(eq(transactions.accountId, filters.accountId));
    if (filters?.categoryId) conditions.push(eq(transactions.categoryId, filters.categoryId));
    if (filters?.startDate) conditions.push(gte(transactions.date, filters.startDate));
    if (filters?.endDate) conditions.push(lte(transactions.date, filters.endDate));

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as typeof query;
    }

    return query.orderBy(desc(transactions.date)).limit(filters?.limit || 100);
  },

  async createTransaction(data: {
    accountId: string;
    categoryId?: string;
    type: "income" | "expense" | "transfer";
    amount: number;
    description: string;
    date: string;
    notes?: string;
  }) {
    const result = db.insert(transactions).values(data).returning();
    return result.get();
  },

  async updateTransaction(id: string, data: Partial<{
    accountId: string;
    categoryId: string;
    type: "income" | "expense" | "transfer";
    amount: number;
    description: string;
    date: string;
    notes: string;
  }>) {
    const result = db.update(transactions)
      .set({ ...data, updatedAt: new Date().toISOString() })
      .where(eq(transactions.id, id))
      .returning();
    return result.get();
  },

  async deleteTransaction(id: string) {
    return db.delete(transactions).where(eq(transactions.id, id));
  },

  // Budgets
  async getBudgets() {
    return db.select().from(budgets).orderBy(desc(budgets.createdAt));
  },

  async createBudget(data: {
    categoryId: string;
    amount: number;
    period: "weekly" | "monthly" | "quarterly" | "yearly";
    startDate: string;
  }) {
    const result = db.insert(budgets).values(data).returning();
    return result.get();
  },

  // Insights
  async getInsights() {
    const allAccounts = await db.select().from(accounts);
    const recentTransactions = await db.select().from(transactions)
      .orderBy(desc(transactions.date))
      .limit(100);

    const totalBalance = allAccounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);
    const totalIncome = recentTransactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + (t.amount || 0), 0);
    const totalExpenses = recentTransactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    return {
      totalBalance,
      totalIncome,
      totalExpenses,
      netCashFlow: totalIncome - totalExpenses,
      accountCount: allAccounts.length,
      transactionCount: recentTransactions.length,
    };
  },
};
