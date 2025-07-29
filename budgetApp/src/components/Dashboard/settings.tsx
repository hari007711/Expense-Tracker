import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
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
import { useExpenseStore, useExpenseStoreSettings } from "@/store/expenseStore";
import { Settings } from "lucide-react";
import { toast } from "sonner";

type SettingsForm = {
  currency: string;
  budget: number;
};

export default function SettingsComp() {
  const [open, setOpen] = useState(false);

  const {
    setDefaultCurrency,
    setMonthlyBudget,
    monthlyBudget,
    defaultCurrency,
  } = useExpenseStoreSettings();

  const { expenses } = useExpenseStore();

  const { handleSubmit, setValue, register, reset, watch } =
    useForm<SettingsForm>({
      defaultValues: {
        currency: defaultCurrency || "INR",
        budget: monthlyBudget || 0,
      },
    });

  useEffect(() => {
    if (open) {
      reset({
        currency: defaultCurrency,
        budget: monthlyBudget,
      });
    }
  }, [open, defaultCurrency, monthlyBudget, reset]);

  const toNumber = (val: string | number): number =>
    typeof val === "string" ? parseFloat(val) : val;

  const totalExpense = expenses
    .filter((e) => !e.isIncome)
    .reduce((sum, e) => sum + toNumber(e.amount), 0);

  const validateBudget = (a: number) => {
    if (a < totalExpense) {
      toast.error("Monthly budget is less than total expenses!");
    }
  };

  const onSubmit = (data: SettingsForm) => {
    setDefaultCurrency(data.currency);
    setMonthlyBudget(data.budget);
    validateBudget(data.budget);
    setOpen(false); 
  };

  return (
    <div className="w-full">
      <Dialog open={open} onOpenChange={setOpen}>
        <div className="flex justify-end mb-5">
          <DialogTrigger asChild>
            <Settings className="cursor-pointer flex items-center " />
          </DialogTrigger>
        </div>

        <DialogContent className="w-[100vw]">
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Settings</DialogTitle>
              <DialogDescription>Configure your preferences.</DialogDescription>
            </DialogHeader>

            <div className="grid gap-3 mt-3">
              <Label className="font-bold">Default Currency</Label>
              <Select
                onValueChange={(value) => setValue("currency", value)}
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

            <div className="grid gap-3 mt-5">
              <Label className="font-bold">Monthly Budget</Label>
              <Input
                type="number"
                className="w-[12.5vw]"
                placeholder="Enter amount"
                {...register("budget", { valueAsNumber: true })}
              />
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
