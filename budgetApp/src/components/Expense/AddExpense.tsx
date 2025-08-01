import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "../ui/textarea";
import { useExpenseStore } from "@/store/expenseStore";
import { v4 as uuidv4 } from "uuid";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";

type FormValues = {
  title: string;
  amount: string;
  currency: string;
  convertedAmount: string;
  category: string;
  notes: string;
  date: string;
  image_src: string;
};

export default function AddExpense() {
  const { add, fetchExpenses } = useExpenseStore();
  const [open, setOpen] = useState(false);
  const [openDate, setOpenDate] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      title: "",
      amount: "",
      currency: "",
      convertedAmount: "",
      category: "",
      notes: "",
      image_src: "",
    },
  });

  const [selectVal, setSelectVal] = useState<String>("");
  console.log(selectVal, "selectVal");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setValue("image_src", reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data: FormValues) => {

    let check = false;
    if (selectVal == "") {
      check = true;
    }
    if (!check) {
      const formattedDate = new Date(data.date).toISOString().split("T")[0];

      const expenseData = {
        ...data,
        date: formattedDate,
        amount: parseFloat(data.amount),
        convertedAmount: parseFloat(data.convertedAmount),
        isIncome: data.category.toLowerCase() === "income",
        createdAt: new Date().toLocaleDateString("en-GB"),
        id: uuidv4(),
      };

      try {
        await add(expenseData);
        fetchExpenses();
        reset();
        setOpen(false);
      } catch (error) {
        console.error("Error adding expense:", error);
      }
    }
  };

  return (
    <div className="w-full">
      <Dialog open={open} onOpenChange={setOpen}>
        <div className="flex justify-end mb-5">
          <DialogTrigger asChild>
            <Button className="cursor-pointer">Add Expense</Button>
          </DialogTrigger>
        </div>

        <DialogContent className="w-[30vw] min-w-[30vw]">
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Add Expense</DialogTitle>
              <DialogDescription>
                Fill in the expense details and click "Save".
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="flex justify-between">
                <div className="grid gap-3">
                  <Label>Spent On</Label>
                  <Input
                    className="w-[12.5vw]"
                    placeholder="Enter title"
                    {...register("title", { required: "Please Enter Title" })}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm">
                      {errors.title.message}

                    </p>
                  )}
                </div>
                <div className="grid gap-3 ">
                  <Label>Amount</Label>
                  <Input
                    type="number"
                    className="w-[12.5vw]"
                    placeholder="Enter Amount"
                    {...register("amount", { required: "Please Enter Amount" })}
                  />
                  {errors.amount && (
                    <p className="text-red-500 text-sm">
                      {errors.amount.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-between">
                <div className="grid gap-3">
                  <Label>Currency</Label>
                  <Select
                    onValueChange={(value) => {
                      setSelectVal(value);
                      console.log(value, "vvvvvvv");

                      setValue("currency", value);
                    }}
                    value={watch("currency")}
                  >
                    <SelectTrigger className="w-[12.5vw]">
                      <SelectValue placeholder="Currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INR">INR</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {/* <p className="text-red-500 text-sm">{currErrorMsg}</p> */}
                <div className="grid gap-3">
                  <Label>Converted Amount</Label>
                  <Input
                    type="number"
                    className="w-[12.5vw]"
                    placeholder="Enter Converted Amount"
                    {...register("convertedAmount", {
                      required: "Please Enter Converted Amount",
                    })}
                  />
                  {errors.convertedAmount && (
                    <p className="text-red-500 text-sm">
                      {errors.convertedAmount.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-between">
                <div className="grid gap-3">
                  <Label>Category</Label>
                  <Input
                    className="w-[12.5vw]"
                    placeholder="Enter Category"
                    {...register("category", {
                      required: "Please Enter Category",
                    })}
                  />
                  {errors.category && (
                    <p className="text-red-500 text-sm">
                      {errors.category.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-3">
                  <Label>Notes</Label>
                  <Textarea
                    className="w-[12.5vw]"
                    placeholder="Enter Notes"
                    {...register("notes")}
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <div className="flex flex-col gap-3">
                  <Controller
                    name="date"
                    control={control}
                    rules={{ required: "Please select a date" }}
                    render={({ field }) => (
                      <div className="flex flex-col gap-3">
                        <Label htmlFor="date" className="px-1">
                          Date
                        </Label>
                        <Popover open={openDate} onOpenChange={setOpenDate}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              id="date"
                              className="w-48 justify-between font-normal"
                            >
                              {field.value
                                ? new Date(field.value).toLocaleDateString()
                                : "Select date"}
                              <ChevronDownIcon />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-auto overflow-hidden p-0"
                            align="start"
                          >
                            <Calendar
                              mode="single"
                              selected={
                                field.value ? new Date(field.value) : undefined
                              }
                              captionLayout="dropdown"
                              onSelect={(selectedDate) => {
                                field.onChange(selectedDate?.toISOString());
                                setOpenDate(false);
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                        {errors.date && (
                          <p className="text-red-500 text-sm">
                            {errors.date.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                </div>

                <div className="grid gap-3">
                  <Label>Upload Image</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    className="w-[12.5vw]"
                    onChange={handleImageChange}
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button
                  variant="outline"
                  type="button"
                  className="cursor-pointer"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" className="cursor-pointer">
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
