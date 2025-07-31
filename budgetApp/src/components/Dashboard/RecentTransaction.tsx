import  { useEffect, useMemo } from "react";
import { useExpenseStore } from "../../store/expenseStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { Link } from "@tanstack/react-router";
import { Button } from "../ui/button";
import { ArrowRight, TrendingDown, TrendingUp } from "lucide-react";

const BudgetCards = () => {
  const { expenses, fetchExpenses, loading, error } = useExpenseStore();
  useEffect(() => {
    if (expenses.length === 0 && !loading && !error) {
      fetchExpenses();
    }
  }, [expenses.length, fetchExpenses, loading, error]);

  const toNumber = (val: string | number): number =>
    typeof val === "string" ? parseFloat(val) : val;
  const { totalIncome, totalExpense, totalBalance } = useMemo(() => {
    const incomeSum = expenses
      .filter((e) => e.isIncome)
      .reduce((sum, e) => sum + toNumber(e.amount), 0);

    const expenseSum = expenses
      .filter((e) => !e.isIncome)
      .reduce((sum, e) => sum + toNumber(e.amount), 0);

    return {
      totalIncome: incomeSum,
      totalExpense: expenseSum,
      totalBalance: incomeSum - expenseSum,
    };
  }, [expenses]);

  const pieChartData = [
    { name: "Total Income", value: totalIncome },
    { name: "Total Expense", value: totalExpense },
    { name: "Total Balance", value: totalBalance },
  ];

  const COLORS = ["#ff6900", "#ff172c", "#cc8bff"];

  if (loading) return <p>Loading financial data...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="p-4 flex justify-between">
      <div className=" flex h-[69vh]">
        <Card className="w-[39vw] border border-gray-200">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <>Recent Transactions </>
              <Link to="/expense" className="inline-block">
                <Button className="bg-transparent text-black border border-[#d8d8d8] hover:bg-white cursor-pointer">
                  See All
                  <ArrowRight />
                </Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl mt-5 justify-between h-[50vh] overflow-scroll overflow-x-hidden scroll-auto">
              {expenses?.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center space-x-4 mb-8 justify-between"
                >
                  <div className="flex">
                    <img
                      src={item?.image_src}
                      alt={item?.title}
                      className="w-10 h-10 rounded-full  object-cover "
                    />
                    <div className="ml-3">
                      <p className="text-[18px] font-medium">{item.title}</p>
                      {/* <p className="text-sm font-medium text-gray-500">
                        {item.date}
                      </p> */}
                      <p className="text-sm font-medium text-gray-500 mt-1">
                        {new Date(item.date)
                          .toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })
                          .replace(/^(\d{2})/, (match) => `${match}th`)}
                      </p>
                    </div>
                  </div>
                  {item.isIncome ? (
                    <div className="text-green-500 text-[16px] bg-[#d3ffd3] p-[6px] rounded-[7px] flex w-[6vw] justify-center items-center mr-6">
                      ₹{item.amount}
                      <TrendingUp />
                    </div>
                  ) : (
                    <div className="text-red-500 text-[16px] p-[6px] bg-[#ffb7b7] rounded-[7px] flex w-[6vw] justify-center items-center mr-6">
                      ₹{item.amount}
                      <TrendingDown />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="w-[39vw] border border-gray-200">
        <CardHeader>
          <CardTitle className="mt-[7px]">Financial Overview</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-89 mt-10">
          {totalIncome + totalExpense === 0 ? (
            <p className="text-gray-500">No financial data to display chart.</p>
          ) : (
            <ResponsiveContainer width="100%" height="107%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={140}
                  innerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                >
                  {pieChartData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-lg font-semibold"
                  fill="#333"
                >
                  <tspan x="50%" dy="-0.6em">
                    Total Balance
                  </tspan>
                  <tspan x="50%" dy="1.2em">
                    ₹{totalIncome - totalExpense}
                  </tspan>
                </text>
                <Tooltip formatter={(value) => `₹ ${value.toLocaleString()}`} />{" "}
                <Legend
                  wrapperStyle={{ bottom: -15 }}
                  content={({ payload }) => (
                    <ul className="w-full px-4 mt-4 flex justify-between">
                      {payload?.map((entry, index) => (
                        <li
                          key={`item-${index}`}
                          className="flex items-center mb-2 text-md"
                        >
                          <span className="flex items-center gap-2">
                            <span
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: entry.color }}
                            />
                            {entry.value}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BudgetCards;
