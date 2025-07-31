import AddExpense from "@/components/Expense/AddExpense";
import BarGraph from "@/components/Expense/BarGraph";
import ExpenseTable from "@/components/Expense/ExpenseTable";

export default function Expense() {
  return (
    <div className="w-full p-5">
      <AddExpense />
      <BarGraph />
      <ExpenseTable />
    </div>
  );
}
