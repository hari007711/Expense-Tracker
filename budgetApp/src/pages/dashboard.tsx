import BudgetCards from "@/components/Dashboard/budgetcards";
import RecentTransaction from "@/components/Dashboard/RecentTransaction";
import {  useExpenseStoreSettings } from "@/store/expenseStore";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

export default function Dashboard() {
  const { fetchExpenses} =
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
