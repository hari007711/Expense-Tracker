
export type Expense = {
  id: string;
  title: string;
  amount: number;
  date: string;
  isIncome: boolean;
  image_src?: string; 
  currency: string;
  convertedAmount: number;
  category: string;
  notes: string;
  createdAt?: string; 
};
