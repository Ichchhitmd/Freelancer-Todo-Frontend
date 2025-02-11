export interface Expense {
  title: string;
  amount: string;
  description: string;
  screenshot: null | string;
  companyId: number;
  userId: number;
}

export interface CreateExpense {
  title: string;
  amount: string;
  description: string;
  screenshot: null | string;
  companyId: number;
  userId: number;
}

export interface ExpenseResponse {
  id: number;
  title: string;
  amount: string;
  description: string;
  screenshotUrl: null | string;
  companyId: number;
  createdAt: string;
  updatedAt: string;
  userId: number;
}
