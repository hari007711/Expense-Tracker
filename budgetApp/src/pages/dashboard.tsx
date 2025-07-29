import BudgetCards from "@/components/Dashboard/budgetcards";
import RecentTransaction from "@/components/Dashboard/RecentTransaction";
import { useExpenseStore, useExpenseStoreSettings } from "@/store/expenseStore";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import Expense from "./expense";
import ExpensesDash from "@/components/Dashboard/ExpensesDash";
import IncomeDash from "@/components/Dashboard/IncomeDash";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

export default function Dashboard() {
  const activeMenu = "Dashboard";
  const { fetchExpenses, monthlyBudget, defaultCurrency } =
    useExpenseStoreSettings();

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <div className="">
      <h1 className="text-xl">
        <BudgetCards />
        <RecentTransaction />
      </h1>
    </div>
  );
}
