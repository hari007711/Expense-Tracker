import { useExpenseStore } from "@/store/expenseStore";
import { TrendingDown, TrendingUp } from "lucide-react";
import  { useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend, 
} from "recharts";


const ExpensesDash = () => {
  const { expenses } = useExpenseStore();
  const toNumber = (val: string | number): number =>
    typeof val === "string" ? parseFloat(val) : val;
  const expenseByDayData = useMemo(() => {
    const dayMap: { [key: string]: number } = {};

    expenses
      .filter((item) => !item.isIncome) 
      .forEach((item) => {
        const dateKey = item.date; 
        const amount = toNumber(item.amount);
        dayMap[dateKey] = (dayMap[dateKey] || 0) + amount;
      });
    const dataArray = Object.keys(dayMap).map((date) => ({
      name: date, 
      expenses: dayMap[date], 
    }));
    dataArray.sort(
      (a, b) => new Date(a.name).getTime() - new Date(b.name).getTime()
    );

    return dataArray;
  }, [expenses]); 

  return (
    <div className=" p-4 flex justify-between ">
      <div className=" flex h-[50vh]">
        <Card className="w-[36vw] border-none">
          <CardHeader>
            <CardTitle>Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl mt-5 justify-between h-[35vh] overflow-scroll overflow-x-hidden">
              {expenses
                ?.filter((item) => !item.isIncome)
                ?.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-4 mb-4 justify-between"
                  >
                    <div className="flex">
                      <img
                        src={item?.image_src}
                        alt={item?.title}
                        className="w-10 h-10 rounded-full object-cover border"
                      />
                      <div className="ml-3">
                        <p className="text-[18px] font-medium">{item.title}</p>
                        <p className="text-sm font-medium text-gray-500">
                          {item.date}
                        </p>
                      </div>
                    </div>
                    {item.isIncome ? (
                      <div className="text-green-500 text-[16px] bg-[#d3ffd3] p-[6px] rounded-[7px] flex w-[6vw] justify-center items-center ">
                        ₹{item.amount}
                        <TrendingUp />
                      </div>
                    ) : (
                      <div className="text-red-500 text-[16px] p-[6px] bg-[#ffb7b7] rounded-[7px] flex w-[6vw] justify-center items-center">
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
      <div className=" flex h-[50vh]">
        <Card className="w-[36vw] border-none">
          <CardHeader>
            <CardTitle>Daily Expenses Overview</CardTitle>
          </CardHeader>
          <CardContent className="h-[40vh] flex items-center justify-center">
            {expenseByDayData.length === 0 ? (
              <p className="text-gray-500">
                No expense data to display chart for the selected period.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={expenseByDayData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    angle={-30} 
                    textAnchor="end"
                    height={70} 
                    tickFormatter={(tick) => {
                      const date = new Date(tick);
                      return `${date.getDate()}/${date.getMonth() + 1}`; 
                    }}
                  />
                  <YAxis
                    tickFormatter={(value: number) =>
                      `₹${value.toLocaleString()}`
                    }
                  />
                  <Tooltip
                    formatter={(value: number) => `₹ ${value.toLocaleString()}`}
                    labelFormatter={(label) =>
                      `Date: ${new Date(label).toLocaleDateString("en-GB")}`
                    } 
                  />
                  <Legend />
                  <Bar dataKey="expenses" fill="#ff7300" name="Total Expense" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExpensesDash;
