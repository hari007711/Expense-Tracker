import { useExpenseStore } from "@/store/expenseStore";
import { TrendingDown, TrendingUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const IncomeDash = () => {
  const { expenses } = useExpenseStore();

  return (
    <div className=" p-4 flex justify-between mb-10">
      
      <div className=" flex h-[50vh]">
        <Card className="w-[36vw] border-none">
          <CardHeader>
            <CardTitle>Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl mt-5 justify-between h-[35vh] overflow-scroll overflow-x-hidden">
              {expenses
                ?.filter((item) => item.isIncome)
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
                      <div className="text-green-500 text-[16px] bg-[#d3ffd3] p-[6px] rounded-[7px] flex w-[6vw] justify-center items-center">
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
            <CardTitle>Income Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Card Content</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IncomeDash;
