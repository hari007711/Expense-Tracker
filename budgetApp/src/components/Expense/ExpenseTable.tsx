import  { useMemo, useState, useEffect } from "react";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import { useExpenseStore } from "@/store/expenseStore";
import {
  SquarePen,
  Trash2,
  ChevronDownIcon,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

import { useForm, Controller } from "react-hook-form";
import * as XLSX from "xlsx";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Expense = {
  id: string;
  title: string;
  amount: number;
  date: string;
  currency: string;
  convertedAmount: number;
  category: string;
  notes: string;
  image_src?: string;
  isIncome?: boolean;
  createdAt?: string;
};

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

export default function ExpenseTable() {
  const { expenses, remove, fetchExpenses, updateApi } = useExpenseStore();

  console.log(expenses, "expenses");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [expenseToDeleteId, setExpenseToDeleteId] = useState<string | null>(
    null
  );
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [displayedMonth, setDisplayedMonth] = useState(new Date());
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    control,
    formState: { errors },
  } = useForm<FormValues>();

  useEffect(() => {
    if (editingExpense) {
      setValue("title", editingExpense.title);
      setValue("amount", editingExpense.amount.toString());
      setValue("currency", editingExpense.currency);
      setValue("convertedAmount", editingExpense.convertedAmount.toString());
      setValue("category", editingExpense.category);
      setValue("notes", editingExpense.notes);
      setValue("date", editingExpense.date);
      setValue("image_src", editingExpense.image_src || "");
    }
  }, [editingExpense, setValue]);

  console.log(editingExpense?.date, "ddddddd");

  const DeleteRecord = (id: string) => {
    remove(id);
    fetchExpenses();
    toast.success("Deleted Successfully.");
  };

  const handleEditClick = (expense: Expense) => {
    setEditingExpense(expense);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async (data: FormValues) => {
    if (!editingExpense) return;

    const formattedDate = new Date(data.date).toISOString().split("T")[0];
    console.log(formattedDate, "formattedDate");

    const updatedExpense: Expense = {
      ...editingExpense,
      title: data.title,
      amount: parseFloat(data.amount),
      currency: data.currency,
      convertedAmount: parseFloat(data.convertedAmount),
      category: data.category,
      notes: data.notes,
      date: formattedDate,
      image_src: data.image_src,
      isIncome: data?.category?.toLowerCase() === "income",
    };

    try {
      await updateApi(editingExpense.id, updatedExpense);
      fetchExpenses();
      toast.success("Expense updated successfully!");
      setIsEditDialogOpen(false);
      setEditingExpense(null);
      reset();
    } catch (error) {
      console.error("Error updating expense:", error);
      toast.error("Failed to update expense.");
    }
  };

  const filteredExpenses = useMemo(() => {
    const targetMonth = displayedMonth.getMonth();
    const targetYear = displayedMonth.getFullYear();

    return expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return (
        expenseDate.getMonth() === targetMonth &&
        expenseDate.getFullYear() === targetYear
      );
    });
  }, [expenses, displayedMonth]);

  const handlePreviousMonth = () => {
    setDisplayedMonth((prevMonth) => {
      const newMonth = new Date(prevMonth);
      newMonth.setMonth(newMonth.getMonth() - 1);
      return newMonth;
    });
  };

  const handleNextMonth = () => {
    setDisplayedMonth((prevMonth) => {
      const newMonth = new Date(prevMonth);
      newMonth.setMonth(newMonth.getMonth() + 1);
      return newMonth;
    });
  };

  const isCurrentMonth = useMemo(() => {
    const now = new Date();
    return (
      displayedMonth.getMonth() === now.getMonth() &&
      displayedMonth.getFullYear() === now.getFullYear()
    );
  }, [displayedMonth]);

  const columns = useMemo<MRT_ColumnDef<Expense>[]>(
    () => [
      {
        accessorKey: "title",
        header: "Title",
        minSize: 300,
        muiTableHeadCellProps: {
          className: "align-center",
        },
      },
      {
        accessorKey: "convertedAmount",
        header: "Amount",
        minSize: 300,
        Cell: ({ cell }) =>
          new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
          }).format(cell.getValue<number>()),
      },
      {
        accessorKey: "date",
        header: "Date",
        minSize: 300,
      },
      {
        accessorKey: "actions",
        header: "Actions",
        enableSorting: false,
        enableColumnFilter: false,
        muiTableHeadCellProps: {
          className: "text-center",
        },
        Cell: ({ row }) => {
          const expense = row.original;

          return (
            <div className="flex items-center justify-center gap-4">
              <div
                className="bg-blue-200 p-2 rounded cursor-pointer"
                onClick={() => handleEditClick(expense)}
              >
                <SquarePen className="h-[2vh]" />
              </div>
              <div className="bg-red-200 p-2 rounded cursor-pointer">
                <Trash2
                  onClick={() => handleDeleteClick(expense.id)}
                  className="h-[2vh]"
                />
              </div>
            </div>
          );
        },
      },
    ],
    [DeleteRecord]
  );

  const handleDownloadExcel = () => {
    if (filteredExpenses.length === 0) {
      toast.info("No data to download for the current month.");
      return;
    }

    const dataForExport = filteredExpenses.map((item) => ({
      ID: item.id,
      Title: item.title,
      Amount: new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(item.amount),
      Currency: item.currency,
      "Converted Amount": new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(item.convertedAmount),
      Category: item.category,
      Notes: item.notes,
      Date: new Date(item.date).toLocaleDateString("en-GB"),
      "Is Income": item.isIncome ? "Yes" : "No",
      "Created At": item.createdAt
        ? new Date(item.createdAt).toLocaleDateString("en-GB")
        : "",
    }));

    const ws = XLSX.utils.json_to_sheet(dataForExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Expenses");
    const monthName = displayedMonth.toLocaleString("en-US", {
      month: "long",
      year: "numeric",
    });
    const fileName = `Expenses_for_${monthName}.xlsx`;
    XLSX.writeFile(wb, fileName);
    toast.success("Excel file downloaded successfully!");
  };

  const handleDeleteClick = (id: string) => {
    setExpenseToDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirmed = () => {
    if (expenseToDeleteId) {
      remove(expenseToDeleteId);
      fetchExpenses();
      toast.success("Deleted Successfully.");
      setExpenseToDeleteId(null);
    }
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="w-full pb-[25px]">
      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle>
            <div className="flex justify-between items-center">
              Recent Expenses
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handlePreviousMonth}
                  className="cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4 cursor-pointer" />
                </Button>
                <span className="font-semibold text-lg">
                  {displayedMonth.toLocaleString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleNextMonth}
                  disabled={isCurrentMonth}
                  className="cursor-pointer"
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  className="cursor-pointer"
                  onClick={handleDownloadExcel}
                >
                  Download
                </Button>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-[10px] w-full">
            <MaterialReactTable
              columns={columns}
              data={filteredExpenses}
              enableSorting
              enableColumnResizing
              initialState={{ density: "comfortable" }}
            />
          </div>
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="w-[100vw]">
          <form onSubmit={handleSubmit(handleSaveEdit)}>
            <DialogHeader>
              <DialogTitle>Edit Expense</DialogTitle>
              <DialogDescription>
                Modify the expense details and click "Save Changes".
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="flex justify-between">
                <div className="grid gap-3">
                  <Label htmlFor="edit-title">Spent On</Label>
                  <Input
                    id="edit-title"
                    className="w-[12.5vw]"
                    placeholder="Enter title"
                    {...register("title", { required: "Please Enter Title" })}
                  />
                  {errors.title && (
                    <p className="text-red-500">{errors.title.message}</p>
                  )}
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="edit-amount">Amount</Label>
                  <Input
                    id="edit-amount"
                    type="number"
                    className="w-[12.5vw]"
                    placeholder="Enter Amount"
                    {...register("amount", {
                      required: "Please Enter Amount",
                      valueAsNumber: true,
                    })}
                  />
                  {errors.amount && (
                    <p className="text-red-500">{errors.amount.message}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-between">
                <div className="grid gap-3">
                  <Label htmlFor="edit-currency">Currency</Label>
                  <Controller
                    name="currency"
                    control={control}
                    rules={{ required: "Please select a currency" }}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
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
                    )}
                  />
                  {errors.currency && (
                    <p className="text-red-500">{errors.currency.message}</p>
                  )}
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="edit-converted-amount">
                    Converted Amount
                  </Label>
                  <Input
                    id="edit-converted-amount"
                    type="number"
                    className="w-[12.5vw]"
                    placeholder="Enter Converted Amount"
                    {...register("convertedAmount", {
                      required: "Please Enter Converted Amount",
                      valueAsNumber: true,
                    })}
                  />
                  {errors.convertedAmount && (
                    <p className="text-red-500">
                      {errors.convertedAmount.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-between">
                <div className="grid gap-3">
                  <Label htmlFor="edit-category">Category</Label>
                  <Input
                    id="edit-category"
                    className="w-[12.5vw]"
                    placeholder="Enter Category"
                    {...register("category", {
                      required: "Please Enter Category",
                    })}
                  />
                  {errors.category && (
                    <p className="text-red-500">{errors.category.message}</p>
                  )}
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="edit-notes">Notes</Label>
                  <Textarea
                    id="edit-notes"
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
                        <Label htmlFor="edit-date" className="px-1">
                          Date
                        </Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              id="edit-date"
                              className="w-48 justify-between font-normal"
                            >
                              {field.value
                                ? new Date(field.value).toLocaleDateString(
                                    "en-GB"
                                  )
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
                                field.onChange(
                                  selectedDate?.toISOString().split("T")[0]
                                );
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
                  <Label htmlFor="edit-image">Upload Image</Label>
                  <Input
                    id="edit-image"
                    type="file"
                    accept="image/*"
                    className="w-[12.5vw]"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setValue("image_src", reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  {watch("image_src") && (
                    <img
                      src={watch("image_src")}
                      alt="Preview"
                      className="w-16 h-16 object-cover mt-2 rounded"
                    />
                  )}
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
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              expense record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setExpenseToDeleteId(null)}
              className="cursor-pointer"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirmed}
              className="cursor-pointer"
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
