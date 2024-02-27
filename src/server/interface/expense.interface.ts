export interface ExpenseData {
  description: string;
  date: string;
  price: number;
}

export interface DataExpenseModel {
  description: string;
  date: string;
  price: number;
  userfk: number;
}
