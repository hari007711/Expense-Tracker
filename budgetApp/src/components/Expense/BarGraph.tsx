import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useExpenseStore } from "@/store/expenseStore";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import  { useMemo } from "react";


const BarGraph = () => {
  const { expenses } = useExpenseStore();
  const toNumber = (val: string | number): number =>
    typeof val === "string" ? parseFloat(val) : val;

  const monthlyData = useMemo(() => {
    const monthMap: {
      [key: string]: { name: string; totalConvertedAmount: number };
    } = {};
    const now = new Date();
    const currentYear = now.getFullYear();
    for (let i = 0; i <= 12; i++) {
      const date = new Date(currentYear, i, 1);
      const monthName = date.toLocaleString("en-US", { month: "short" });
      const monthKey = `${currentYear}-${(i + 1).toString().padStart(2, "0")}`;
      monthMap[monthKey] = { name: monthName, totalConvertedAmount: 0 };
    }

    expenses.forEach((item) => {
      if (!item.isIncome && item.date) {
        const itemDate = new Date(item.date);
        if (itemDate.getFullYear() === currentYear) {
          const monthKey = `${itemDate.getFullYear()}-${(itemDate.getMonth() + 1).toString().padStart(2, "0")}`;
          if (monthMap[monthKey]) {
            monthMap[monthKey].totalConvertedAmount += toNumber(
              item.convertedAmount
            );
          }
        }
      }
    });
    const dataArray = Object.values(monthMap);
    dataArray.sort((a, b) => {
      const monthOrder = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      return monthOrder.indexOf(a.name) - monthOrder.indexOf(b.name);
    });

    return dataArray;
  }, [expenses]);

  return (
    <div>
      <Card className="w-[full] border border-gray-200 mb-10">
        <CardHeader>
          <CardTitle>Monthly Expenses Overview (Expenses Amount)</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-80">
          {monthlyData.every((m) => m.totalConvertedAmount === 0) ? (
            <p className="text-gray-500">
              No expense data for the current year up to the current month to
              display chart.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis
                  tickFormatter={(value: number) =>
                    `₹${value.toLocaleString()}`
                  }
                />
                <Tooltip
                  formatter={(value: number) => `₹ ${value.toLocaleString()}`}
                  labelFormatter={(label: string) => `Month: ${label}`}
                />
                <Legend />
                <Bar
                  dataKey="totalConvertedAmount"
                  fill="#8884d8"
                  name="Total Expenses"
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BarGraph;
