import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  getExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
} from "../api/getExpense";

type Expense = {
  id: string;
  title: string;
  amount: number;
  date: string;
  currency: string;
  convertedAmount: number;
  category: string;
  notes: string;
  image_src?: string;
  isIncome?: boolean;
  createdAt?: string;
};

type ExpenseStore = {
  expenses: Expense[];
  loading: boolean;
  error: string | null;

  fetchExpenses: () => Promise<void>;
  add: (data: Omit<Expense, "id">) => Promise<void>;
  updateApi: (id: string, data: Partial<Expense>) => Promise<void>;
  remove: (id: string) => Promise<void>;
  clearAll: () => void;
};

type SettingsExpenseStore = {
  defaultCurrency: string;
  monthlyBudget: number;
  setDefaultCurrency: (currency: string) => void;
  setMonthlyBudget: (budget: number) => void;
  fetchExpenses: () => void;
};

export const useExpenseStoreSettings = create<SettingsExpenseStore>()(
  persist(
    (set) => ({
      defaultCurrency: "INR",
      monthlyBudget: 0,
      setDefaultCurrency: (currency) => set({ defaultCurrency: currency }),
      setMonthlyBudget: (budget) => set({ monthlyBudget: Number(budget) }),
      fetchExpenses: () => {},
    }),
    {
      name: "expense-storage",
    }
  )
);

export const useExpenseStore = create<ExpenseStore>()(
  persist(
    (set) => ({
      expenses: [],
      loading: false,
      error: null,

      fetchExpenses: async () => {
        set({ loading: true, error: null });
        try {
          const data = await getExpenses();
          set({ expenses: data, loading: false });
        } catch (err: any) {
          set({ error: err.message, loading: false });
        }
      },

      add: async (data) => {
        try {
          const newExpense = await addExpense(data);
          set((state) => ({
            expenses: [...state.expenses, newExpense],
          }));
        } catch (err: any) {
          set({ error: err.message });
        }
      },

      updateApi: async (id, data) => {
        try {
          const updated = await updateExpense(id, data);
          set((state) => ({
            expenses: state.expenses.map((e) => (e.id === id ? updated : e)),
          }));
        } catch (err: any) {
          set({ error: err.message });
        }
      },

      remove: async (id) => {
        try {
          await deleteExpense(id);
          set((state) => ({
            expenses: state.expenses.filter((e) => e.id !== id),
          }));
        } catch (err: any) {
          set({ error: err.message });
        }
      },

      clearAll: () => set({ expenses: [] }),
    }),
    {
      name: "expense-storage",
      partialize: (state) => ({
        expenses: state.expenses,
      }),
    }
  )
);
