import AddExpense from "@/components/Expense/AddExpense";
import BarGraph from "@/components/Expense/BarGraph";
import ExpenseTable from "@/components/Expense/ExpenseTable";
import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";

export default function Expense() {
  return (
    <div className="w-full p-5">
      <AddExpense />
      <BarGraph />
      <ExpenseTable />
    </div>
  );
}
