import React, { useEffect } from "react";
import {
  useExpenseStore,
  useExpenseStoreSettings,
} from "../../store/expenseStore";
import balance from "../../assets/wallet.png";
import income from "../../assets/income.png";
import expense from "../../assets/spending.png";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

const BudgetCards = () => {
  const { expenses, fetchExpenses, loading, error } = useExpenseStore();

  useEffect(() => {
    if (expenses.length === 0) {
      fetchExpenses();
    }
  }, []);

  const toNumber = (val: string | number): number =>
    typeof val === "string" ? parseFloat(val) : val;

  const totalIncome = expenses
    .filter((e) => e.isIncome)
    .reduce((sum, e) => sum + toNumber(e.amount), 0);

  const totalExpense = expenses
    .filter((e) => !e.isIncome)
    .reduce((sum, e) => sum + toNumber(e.amount), 0);

  const totalBalance = totalIncome - totalExpense;

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="w-[25.8vw] border border-gray-200">
          <div className="flex items-center">
            <CardHeader>
              <CardTitle className="bg-purple-500 rounded-full h-[7vh] w-[3.5vw] flex items-center justify-center">
                <img className="h-[6vh] p-[10px] " src={balance} alt="" />
              </CardTitle>
            </CardHeader>
            <CardContent className="ml-10">
              <h2 className="text-[16px] text-gray-500 font-semibold mb-2">
                Total Balance
              </h2>
              <p className="text-[24px] font-semibold">
                ₹ {totalBalance.toLocaleString()}
              </p>
            </CardContent>
          </div>
        </Card>
        <Card className="w-[25.8vw] border border-gray-200">
          <div className="flex">
            <CardHeader>
              <CardTitle className="bg-orange-500 rounded-full h-[7vh] w-[3.5vw] flex items-center justify-center">
                <img className="h-[6vh] p-[10px] " src={income} alt="" />
              </CardTitle>
            </CardHeader>
            <CardContent className="ml-10">
              <h2 className="text-[16px] text-gray-500 font-semibold mb-2">
                Total Income
              </h2>
              <p className="text-[24px] font-semibold">
                ₹ {totalIncome.toLocaleString()}
              </p>
            </CardContent>
          </div>
        </Card>
        <Card className="w-[25.6vw] border border-gray-200">
          <div className="flex">
            <CardHeader>
              <CardTitle className="bg-red-500 rounded-full h-[7vh] w-[3.5vw] flex items-center justify-center">
                <img className="h-[6vh] p-[10px]  " src={expense} alt="" />
              </CardTitle>
            </CardHeader>
            <CardContent className="ml-10">
              <h2 className="text-[16px] text-gray-500 font-semibold mb-2">
                Total Expense
              </h2>
              <p className="text-[24px] font-semibold">
                ₹ {totalExpense.toLocaleString()}
              </p>
            </CardContent>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BudgetCards;
